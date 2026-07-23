<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/tokens.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Allemansgeest</title>
	<!-- Newsreader: alleen gebruikt door de publieke landingspagina (.ag-landing h1/h2),
	     hier globaal geladen zodat er geen dubbele <link>-tags per route nodig zijn. -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{@render children()}
