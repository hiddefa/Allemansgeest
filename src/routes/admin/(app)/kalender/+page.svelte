<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const typeLabels: Record<string, string> = {
		guest_stay: 'Gastverblijf',
		owner_use: 'Eigen gebruik',
		maintenance_block: 'Onderhoud',
		other: 'Overig'
	};

	let editingId = $state<number | null>(null);

	function fmt(d: string | Date) {
		return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
	}
</script>

<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
	<h1 style="margin: 0;">Bezettingskalender</h1>
	<span class="ag-badge">alleen admins</span>
</div>

{#if form?.error}
	<p class="ag-error">{form.error}</p>
{/if}

{#each data.stays as stay (stay.id)}
	{#if editingId === stay.id}
		<form
			method="POST"
			action="?/update"
			class="ag-card"
			use:enhance={() => async ({ update }) => {
				editingId = null;
				await update();
			}}
		>
			<input type="hidden" name="id" value={stay.id} />
			<div class="ag-field">
				<label for="title-{stay.id}">Titel</label>
				<input id="title-{stay.id}" name="title" value={stay.title} required />
			</div>
			<div class="ag-field">
				<label for="type-{stay.id}">Type</label>
				<select id="type-{stay.id}" name="type" value={stay.type}>
					{#each Object.entries(typeLabels) as [value, label] (value)}
						<option {value}>{label}</option>
					{/each}
				</select>
			</div>
			<div class="ag-field">
				<label for="start-{stay.id}">Startdatum</label>
				<input
					id="start-{stay.id}"
					name="startDate"
					type="date"
					value={new Date(stay.startDate).toISOString().slice(0, 10)}
					required
				/>
			</div>
			<div class="ag-field">
				<label for="end-{stay.id}">Einddatum</label>
				<input
					id="end-{stay.id}"
					name="endDate"
					type="date"
					value={new Date(stay.endDate).toISOString().slice(0, 10)}
					required
				/>
			</div>
			<div class="ag-field">
				<label for="notes-{stay.id}">Notities</label>
				<textarea id="notes-{stay.id}" name="notes">{stay.notes ?? ''}</textarea>
			</div>
			<div style="display: flex; gap: 8px;">
				<button class="ag-btn" type="submit">Opslaan</button>
				<button class="ag-btn secondary" type="button" onclick={() => (editingId = null)}>Annuleren</button>
			</div>
		</form>
	{:else}
		<div class="ag-card row">
			<div>
				<b>{stay.title}</b>
				<div class="ag-muted">{typeLabels[stay.type]} — {fmt(stay.startDate)} – {fmt(stay.endDate)}</div>
			</div>
			<div style="display: flex; gap: 6px;">
				<button class="ag-btn secondary" style="padding: 4px 10px;" onclick={() => (editingId = stay.id)}
					>Wijzigen</button
				>
				<form
					method="POST"
					action="?/delete"
					use:enhance
				>
					<input type="hidden" name="id" value={stay.id} />
					<button class="ag-btn danger" style="padding: 4px 10px;" type="submit">Verwijderen</button>
				</form>
			</div>
		</div>
	{/if}
{:else}
	<p class="ag-muted">Nog geen verblijven ingepland.</p>
{/each}

<h2>Nieuw verblijf</h2>
<form method="POST" action="?/create" use:enhance class="ag-card">
	<div class="ag-field">
		<label for="new-title">Titel</label>
		<input id="new-title" name="title" placeholder="bv. Familie Jansen" required />
	</div>
	<div class="ag-field">
		<label for="new-type">Type</label>
		<select id="new-type" name="type">
			{#each Object.entries(typeLabels) as [value, label] (value)}
				<option {value}>{label}</option>
			{/each}
		</select>
	</div>
	<div class="ag-field">
		<label for="new-start">Startdatum</label>
		<input id="new-start" name="startDate" type="date" required />
	</div>
	<div class="ag-field">
		<label for="new-end">Einddatum</label>
		<input id="new-end" name="endDate" type="date" required />
	</div>
	<div class="ag-field">
		<label for="new-notes">Notities</label>
		<textarea id="new-notes" name="notes"></textarea>
	</div>
	<button class="ag-btn" type="submit">Toevoegen</button>
</form>
