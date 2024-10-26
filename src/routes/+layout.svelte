<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<Header />
	<main class="p-4 mx-auto max-w-screen-lg">
		{@render children()}
	</main>
	<Footer />
</ParaglideJS>

