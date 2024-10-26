<script>
	// mdsvex doesn't support TypeScript in layout files.
	export let title;
</script>

<svelte:head>
	<!-- <title>{title ? `${title} - Playmate` : 'Playmate'}</title>
	<meta property="og:title" content={title ? `${title} - Playmate` : 'Playmate'} /> -->
</svelte:head>

<article class="max-w-none mx-auto p-4 lg:prose-xl rich-text"><slot /></article>
