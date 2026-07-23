<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	function fmt(d: string | Date) {
		return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
	}
</script>

<h1>Verbruik per verblijf</h1>
<p class="ag-muted">
	Vul meterstanden bij aankomst en vertrek in, en optioneel het bedrag dat je zelf voor dit
	verblijf berekent (D-07: de app rekent zelf niets uit).
</p>

{#if form?.error}
	<p class="ag-error">{form.error}</p>
{/if}

{#each data.stays as stay (stay.id)}
	<form method="POST" action="?/save" use:enhance class="ag-card">
		<b>{stay.title}</b>
		<span class="ag-muted" style="margin-bottom: 8px;">{fmt(stay.startDate)} – {fmt(stay.endDate)}</span>
		<input type="hidden" name="stayId" value={stay.id} />
		<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
			<div class="ag-field">
				<label for="elec-start-{stay.id}">Stroom start (kWh)</label>
				<input
					id="elec-start-{stay.id}"
					name="electricityStartKwh"
					type="number"
					value={stay.reading?.electricityStartKwh ?? ''}
				/>
			</div>
			<div class="ag-field">
				<label for="elec-end-{stay.id}">Stroom eind (kWh)</label>
				<input
					id="elec-end-{stay.id}"
					name="electricityEndKwh"
					type="number"
					value={stay.reading?.electricityEndKwh ?? ''}
				/>
			</div>
			<div class="ag-field">
				<label for="gas-start-{stay.id}">Gas start (m³)</label>
				<input id="gas-start-{stay.id}" name="gasStartM3" type="number" value={stay.reading?.gasStartM3 ?? ''} />
			</div>
			<div class="ag-field">
				<label for="gas-end-{stay.id}">Gas eind (m³)</label>
				<input id="gas-end-{stay.id}" name="gasEndM3" type="number" value={stay.reading?.gasEndM3 ?? ''} />
			</div>
		</div>
		<div class="ag-field">
			<label for="amount-{stay.id}">Bedrag voor dit verblijf (€, optioneel)</label>
			<input
				id="amount-{stay.id}"
				name="amount"
				type="number"
				step="0.01"
				value={stay.reading?.amountCents != null ? (stay.reading.amountCents / 100).toFixed(2) : ''}
			/>
		</div>
		<button class="ag-btn" type="submit">Opslaan</button>
	</form>
{:else}
	<p class="ag-muted">Nog geen verblijven — voeg eerst een verblijf toe in de bezettingskalender.</p>
{/each}
