---
title: Start Up Travel - OAuth
date: 2022/09/17
description: 简述接入多平台 OAuth 接入
tags: ["development", "start up travel", "go", "golang"]
author: Hexagram
---

### 前言

此文专注于解决从工程上接入第三方 OAuth 登录可能遇到的困难。OAuth 的原理并不在讨论范围中，如果阁下想要了解 OAuth 的原理，请参考 [Wikipedia OAuth](https://en.wikipedia.org/wiki/OAuth) 和 [[筆記] 認識 OAuth 2.0：一次了解各角色、各類型流程的差異](https://medium.com/%E9%BA%A5%E5%85%8B%E7%9A%84%E5%8D%8A%E8%B7%AF%E5%87%BA%E5%AE%B6%E7%AD%86%E8%A8%98/%E7%AD%86%E8%A8%98-%E8%AA%8D%E8%AD%98-oauth-2-0-%E4%B8%80%E6%AC%A1%E4%BA%86%E8%A7%A3%E5%90%84%E8%A7%92%E8%89%B2-%E5%90%84%E9%A1%9E%E5%9E%8B%E6%B5%81%E7%A8%8B%E7%9A%84%E5%B7%AE%E7%95%B0-c42da83a6015)。
 
本文以 Go 后端接入 Github、Facebook、Twitter、Apple、Google 五家的 OAuth 为例。

### 接入 OAuth 的困难之源

OAuth 对于开发者是一个有一定标准的黑箱，它遵从一些基础逻辑，但如果要让其正常工作，需要付出不少努力。

虽然，OAuth 有一个相对规范的[标准流程](https://www.oauth.com/)，但是各家提供商因为安全因素在内的各种原因，导致具体的实现大不相同。

而在后端工程中接入 OAuth 又需要工程师尽可能抹平这些差异性，给前端提供一致的接口。

前端，也可能因为一些奇特的业务需求，如 Native App 使用 Web OAuth，而遇到不少新麻烦。

于此同时，运维还需要跟各家提供商的 OAuth Secret 申请流程和管理界面打交道，这里每一家的申请流程和管理界面都有不同的交互逻辑和限制，也使得相关工作富有挑战性。

### 准备工作的困难

#### 千奇百怪的申请流程

各家提供商的 OAuth 申请流程都是不同的，虽然各家都提供了自己的申请文档，但是找到各家的文档本身就不是一件容易事。而且因为各家提供商都用自己的行文逻辑去编写自家文档，所有有较大的理解成本。

笔者采用的逃课方式是，全部查看 [supabase 的 Auth 文档](https://supabase.com/docs/guides/auth)，supabase 重写了一遍申请流程，逻辑更清晰，同时行文逻辑统一。（同时在这里推荐大家 side project 可以去白嫖 supabase 提供的数据库）

同时，在申请时各家提供商还有需要各自需要注意的地方。

Twitter Developer Account 只有**一次**申请机会，申请失败了，就永远没有下一次机会了，请好好写你的英语小作文。（曾经开放的 twitter 已经离我们远去了）

Apple OAuth Secret 的申请流程非常复杂，但是跟着 supabase 的文档一步步走不会有错。同时一定要注意，Apple 的 OAuth Secret 有有效期限制，**最多 180 天**。
如果在生成 Secret 时填写超过 180 天的有效期不会报错，但是会在使用时收到如下，非常迷惑的报错。

> oauth2:+cannot+fetch+token:+400+Response:+"error":"invalid_client"
>
> 截取自后端日志。

这个报错可以在 [Apple 文档](https://developer.apple.com/documentation/sign_in_with_apple/errorresponse)中找到。
如果收到类似的报错，请检查生成的 secret 有效期是否过长。

Google 的 Test OAuth Secret 资格非常好申请，但是申请 Production OAuth Secret 的逻辑非常奇妙。Google 要求 App 先正式上线才可以获得 Production Secret（ Google 以笔者负责的 App 的官网上有 TestFlight 链接而拒绝提供 Production Secret）。但是，没有 Production Secret 怎么上线？这就造成了一个奇妙的死锁。最后的解决方法是，先上架一个没有 Google OAuth 的版本，然后再去向 Google 申请，并且在下一个版本补上。

Github 和 Facebook 的申请流程没有遇到显著问题。

### 编码踩坑

笔者采用 Go 实现 OAuth 后端。

首先需要寻找一个封装了 OAuth 流程的库。

笔者在这里推荐 [goth](https://github.com/markbates/goth) 这个库来接入 OAuth。相比更加有名的 [golang/oauth2](https://github.com/golang/oauth2)，goth 提供了更高层的封装，开发时编码成本更低，而且有一个可以快速启动的 [examples](https://github.com/markbates/goth/tree/master/examples) 可以查看。

唯一可惜的是，goth twitter OAuth2 在笔者接入的时候是无法使用的。

同时，goth 依赖 Go Standard Library 中的 `*http.Request` 读取到 provider 字段才能工作。所以如果使用 gin 这类 http 框架需要做如下 hack 。

```go
// GET /callback/oauth/{provider}
routerGroup.GET("callback/oauth/:provider", customHandler)

func customHandler(c *gin.Context) {
    // c is *gin.Context
    // read provider from :provider in url
    provider := c.Param("provider")

    // make goth work.
    c.Request = c.Request.WithContext(context.WithValue(c.C.Request.Context(), "provider", provider))

    // ... goth logic
}
```

另一个需要注意的问题是，Apple OAuth 全流程都会使用 POST 发起请求。这也就意味着，还应该追加如下的路由。

```go
// Make apple happy!
// POST /callback/oauth/{provider}
routerGroup.POST("callback/oauth/:provider", customHandler)
```

同时，Apple 使用 POST 请求进行 OAuth 流程还带来一个问题。一般的 OAuth 流程的最后一步，会从客户的浏览器中，转跳到 OAuth Redirect Url，再由处理 Redirect Url 的后端，307 至 Callback Page 完成 OAuth 登录。

而根据 [MDN - 307 Temporary Redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307) 的解释，

> The method and the body of the original request are reused to perform the redirected request. In the cases where you want the method used to be changed to GET, use 303 See Other instead.

在实际情况中，Callback Page 一般不会实现通过 POST 请求访问。所以为了将 POST 请求覆盖为 GET 请求，下文提供两种方式。

1. 使用 303 状态码是最简单的方式。
2. 使用魔法，可以不直接转跳至 Callback Page 而是返回一个如下的 html 。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Redirect</title>
</head>
<body>
    <script>
        // fill {{.redirect_url}} with yours.
        // Or location.replace if you like.
        window.location.href = '{{.redirect_url}}';
    </script>
</body>
</html>
```

通过 `location.href` 转跳的页面，一定会通过 GET 请求访问，也就成功覆写了 POST 请求。

### OAuth in Native App

如果，需要在 Native App 中接入 OAuth 登录。我们需要一些前置的准备知识点。

#### 为什么不能在 Webview 中接入第三方登录（ Webview 的安全模型）

很多游戏、社交平台等 App，会在 Native App 中提供第三方登录的选项，点击之后，会调起一个应用内网页，用户在其中登录。

从运营的角度，集成第三方登录帮助用户更容易的注册账户，提高转化率。

但是从技术的角度，这个调起的应用内网页究竟是什么呢？

它，是 Webview 吗？或者，它可以用 Webview 来实现吗？

答案是否定的，我们不可以在 Webview 中接入登录相关的逻辑。

这篇 [Google 的博客](https://developers.googleblog.com/2021/06/upcoming-security-changes-to-googles-oauth-2.0-authorization-endpoint.html)已经很好的说明了原因。

> Embedded webview libraries are problematic because they allow a nefarious developer to intercept and alter communications between Google and its users by acting as a "man in the middle."

因为 App 本身可以在 Webview 中执行任意 Script，等同于恶意 App 可以截获用户所输入的密码。

同样因为安全性的问题，在 iOS 和 Android 中，系统浏览器都不会在 Webview 提供密码补全，并且同时会隔离 Webview 和正常浏览时的 Cookie 等信息。

同时，Google 在检测到用户在 Webview 中尝试使用 Google OAuth 的时候会直接拒绝登录。

综上，在 Webview 中让用户进行 OAuth 登录是一个不可行的做法。

若要让用户在 Native App 中进行 Web OAuth 的登录，需要使用系统提供的**安全的“Webview”**。这项技术，在 Android 上是 `Custom Chrome Tab`，在 iOS 上是 `SFSafariController`（或者高层封装 `ASWebAuthenticationSession`）。这两项技术并不是本文介绍的重点，需要如何使用请阁下自行查阅。

#### 复杂的转跳需求

终于，我们接入了**安全的“Webview”**。这时，一个听起来有些奇怪的需求摆到了眼前：Callback Page 需要在手机上有 Native App 的时候转跳到 Native App，在手机上没有Native App 的时候转跳到网页中。

这个需求通常在一个产品同时有 Web App 和 Native App 的版本时出现。或者更进阶一些，不少互联网产品会在用户使用网页版时先尝试转跳 Native App，如果手机上没有 Native App 会调起应用商店中自己 App 的安装界面。（本文不讨论产品伦理，仅作为举例）

那么这是如何实现的？

首先，Native App 可以注册 Custom Url Schema，而 Web 端只需要通过导航的方式打开 Custom Url Schema，系统就会调起对应 App 。

> 虽然现在 Android 和 iOS 都跟推荐使用 universal link，但是 custom url schema 相对更加成熟，并且上文提到的`ASWebAuthenticationSession`是依赖 custom url schema 工作的。
>
> 有关两者的比较，阁下可以参阅这篇 [Stack Overflow 回答](https://stackoverflow.com/questions/35522618/universal-links-on-ios-vs-deep-links-url-schemes)

在浏览器中，只需要如下代码就可以调起注册了对应 Custom Url Schema 为 `test-app://` 的 App。

```html
<!-- Use JavaScript -->
<script>
    window.location.href = 'test-app://open';
</script>

<!-- Use anchor element -->
<a id="abc" href="test-app://open"></a>
```

OK，我们成功从 Web 转跳回了 App。那么需求的另一半，如果 Native App 不存在就转跳到 Web App 该如何实现呢？

这里的重点是，切忌想办法判断 Native App 是否存在。假定 Native App 不存在才是解决方案。代码如下。

```js
location.href = "test-app://open"; // Part 1
  
setTimeout(() => {
  location.href = "https://www.example.com"
}, "2000") // Part 2
```

以上代码的原理是这样的。

首先执行到 `Part 1` 时，浏览器会尝试调起 Native App，如果成功调起了，就会转跳至 Native App 里。

如果 `Part 1` 中的 custom url schema 没有 Native App 能够响应，在 `SetTimeout` 结束之后，会转跳到 `https://www.example.com`。

最后需要注意的是，这种做法仅在 Android Chrome 和 Safari 浏览器中起作用。如果用户使用 Firefox 会直接转跳至 `Part 1` 中的 URL，`Part 2` 不会被执行。

### 结语

以上，笔者简单总结了在接入 OAuth 登录时遇到的困难，并介绍了对应的解决方案。

总的来说 OAuth 虽然说起来是一个简单的标准，但是真正实现起来却是各家都做的千奇百怪，最终让工程师要掉下大把大把的头发。

