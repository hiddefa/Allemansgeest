<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();

	const links = [
		{ href: '/gast/incheck-uitcheck', label: 'In-/uitchecken' },
		{ href: '/gast/huisregels', label: 'Huisregels' },
		{ href: '/gast/storing', label: 'Storingscontact' },
		{ href: '/gast/verbruik', label: 'Verbruik' }
	];
</script>

<div class="ag-shell">
	<div class="ag-header">
		<span class="ag-title">Allemansgeest</span>
		<form method="POST" action="/gast/uitloggen" style="margin-left: auto;">
			<button class="ag-btn secondary" type="submit" style="font-size: 12px; padding: 4px 10px;"
				>Uitloggen</button
			>
		</form>
	</div>
	<nav class="ag-nav">
		{#each links as link (link.href)}
			<a href={link.href} class:active={page.url.pathname === link.href}>{link.label}</a>
		{/each}
	</nav>
	<div class="ag-main">
		{@render children()}
	</div>
</div>
