<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	function euro(cents: number) {
		return (cents / 100).toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' });
	}
	function fmt(d: string | Date) {
		return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
	}
</script>

<h1>Administratie</h1>

{#if form?.error}
	<p class="ag-error">{form.error}</p>
{/if}

<div class="ag-stats-grid">
	<div class="ag-metric"><span class="ag-muted">Inkomsten</span><b>{euro(data.incomeCents)}</b></div>
	<div class="ag-metric"><span class="ag-muted">Uitgaven</span><b>{euro(data.expenseCents)}</b></div>
	<div class="ag-metric"><span class="ag-muted">Saldo</span><b>{euro(data.balanceCents)}</b></div>
</div>

<h2>Nieuwe post</h2>
<form method="POST" action="?/create" use:enhance class="ag-card">
	<div class="ag-field">
		<label for="type">Type</label>
		<select id="type" name="type">
			<option value="income">Inkomsten</option>
			<option value="expense">Uitgaven</option>
		</select>
	</div>
	<div class="ag-field">
		<label for="description">Omschrijving</label>
		<input id="description" name="description" required />
	</div>
	<div class="ag-field">
		<label for="category">Categorie</label>
		<input id="category" name="category" placeholder="bv. Onderhoud, Gastenbijdrage" />
	</div>
	<div class="ag-field">
		<label for="amount">Bedrag (€)</label>
		<input id="amount" name="amount" type="number" step="0.01" min="0.01" required />
	</div>
	<div class="ag-field">
		<label for="entryDate">Datum</label>
		<input id="entryDate" name="entryDate" type="date" required />
	</div>
	<button class="ag-btn" type="submit">Toevoegen</button>
</form>

<h2>Boekingen</h2>
{#each data.entries as entry (entry.id)}
	<div class="ag-card row">
		<div>
			<span>{entry.description}</span>
			<div class="ag-muted">{entry.category ?? ''} {entry.category ? '—' : ''} {fmt(entry.entryDate)}</div>
		</div>
		<div style="display: flex; align-items: center; gap: 10px;">
			<span class="ag-muted">{entry.type === 'income' ? '+' : '−'} {euro(entry.amountCents)}</span>
			<form method="POST" action="?/delete" use:enhance>
				<input type="hidden" name="id" value={entry.id} />
				<button class="ag-btn danger" style="padding: 4px 10px;" type="submit">Verwijderen</button>
			</form>
		</div>
	</div>
{:else}
	<p class="ag-muted">Nog geen boekingen.</p>
{/each}
