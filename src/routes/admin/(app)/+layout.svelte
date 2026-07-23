<script lang="ts">
	import { page } from '$app/state';

	let { children, data } = $props();

	const links = [
		{ href: '/admin', label: 'Overzicht' },
		{ href: '/admin/kalender', label: 'Bezettingskalender' },
		{ href: '/admin/kluis', label: 'Documentenkluis' },
		{ href: '/admin/administratie', label: 'Administratie' },
		{ href: '/admin/contacten', label: 'Contactpersonen' },
		{ href: '/admin/notities', label: 'Notities' },
		{ href: '/admin/gastaccount', label: 'Gastaccount' },
		{ href: '/admin/verbruik', label: 'Verbruik' },
		{ href: '/admin/huisregels', label: 'Huisregels' },
		{ href: '/admin/berichten', label: 'Berichten' }
	];
</script>

<div class="ag-shell">
	<div class="ag-header">
		<span class="ag-title">Allemansgeest — admin</span>
		<span class="ag-muted" style="margin-left: auto;">{data.admin.name}</span>
		<form method="POST" action="/admin/uitloggen">
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
