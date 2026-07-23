<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<h1>Storingscontact</h1>

{#if data.contact}
	<div class="ag-card">
		<b>{data.contact.name}</b>
		<span class="ag-muted">{data.contact.phone}</span>
		{#if data.contact.note}
			<p style="margin: 6px 0 0;">{data.contact.note}</p>
		{/if}
	</div>
{:else}
	<p class="ag-muted">Nog geen storingscontact ingesteld.</p>
{/if}
