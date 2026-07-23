<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	function euro(cents: number) {
		return (cents / 100).toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' });
	}
</script>

<h1>Energieverbruik</h1>

{#if !data.reading}
	<p class="ag-muted">Er zijn nog geen meterstanden ingevoerd voor je verblijf.</p>
{:else if !data.complete}
	<p class="ag-card">Nog niet compleet — de eindstand is nog niet ingevoerd.</p>
{:else}
	<div class="ag-metric" style="margin-bottom: 8px;">
		<span class="ag-muted">Stroom</span>
		<b>{(data.reading.electricityEndKwh ?? 0) - (data.reading.electricityStartKwh ?? 0)} kWh</b>
	</div>
	<div class="ag-metric" style="margin-bottom: 8px;">
		<span class="ag-muted">Gas</span>
		<b>{(data.reading.gasEndM3 ?? 0) - (data.reading.gasStartM3 ?? 0)} m³</b>
	</div>
	<div class="ag-metric">
		<span class="ag-muted">Bedrag voor dit verblijf</span>
		<b>{data.reading.amountCents != null ? euro(data.reading.amountCents) : 'volgt nog'}</b>
	</div>
{/if}
