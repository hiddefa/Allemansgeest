<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let editingId = $state<number | null>(null);

	function fmt(d: string | Date) {
		return new Date(d).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
	}
</script>

<h1>Notities</h1>

{#if form?.error}
	<p class="ag-error">{form.error}</p>
{/if}

<form method="POST" action="?/create" use:enhance class="ag-card">
	<div class="ag-field">
		<label for="new-body">Nieuwe notitie</label>
		<textarea id="new-body" name="body" required placeholder="Idee, onderhoud-suggestie, ..."></textarea>
	</div>
	<button class="ag-btn" type="submit">Toevoegen</button>
</form>

{#each data.notes as note (note.id)}
	{#if editingId === note.id}
		<form
			method="POST"
			action="?/update"
			class="ag-card"
			use:enhance={() => async ({ update }) => {
				editingId = null;
				await update();
			}}
		>
			<input type="hidden" name="id" value={note.id} />
			<div class="ag-field">
				<textarea name="body" required>{note.body}</textarea>
			</div>
			<div style="display: flex; gap: 8px;">
				<button class="ag-btn" type="submit">Opslaan</button>
				<button class="ag-btn secondary" type="button" onclick={() => (editingId = null)}>Annuleren</button>
			</div>
		</form>
	{:else}
		<div class="ag-card">
			<p style="margin: 0 0 6px; white-space: pre-wrap;">{note.body}</p>
			<div style="display: flex; align-items: center; justify-content: space-between;">
				<span class="ag-muted">{fmt(note.updatedAt)}</span>
				<div style="display: flex; gap: 6px;">
					<button
						class="ag-btn secondary"
						style="padding: 4px 10px;"
						onclick={() => (editingId = note.id)}>Bewerken</button
					>
					<form method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="id" value={note.id} />
						<button class="ag-btn danger" style="padding: 4px 10px;" type="submit">Verwijderen</button>
					</form>
				</div>
			</div>
		</div>
	{/if}
{:else}
	<p class="ag-muted">Nog geen notities.</p>
{/each}
