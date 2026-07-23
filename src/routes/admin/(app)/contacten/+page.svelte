<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let editingId = $state<number | null>(null);
</script>

<h1>Contactpersonen</h1>

{#if form?.error}
	<p class="ag-error">{form.error}</p>
{/if}

{#each data.contacts as contact (contact.id)}
	{#if editingId === contact.id}
		<form
			method="POST"
			action="?/update"
			class="ag-card"
			use:enhance={() => async ({ update }) => {
				editingId = null;
				await update();
			}}
		>
			<input type="hidden" name="id" value={contact.id} />
			<div class="ag-field">
				<label for="name-{contact.id}">Naam</label>
				<input id="name-{contact.id}" name="name" value={contact.name} required />
			</div>
			<div class="ag-field">
				<label for="role-{contact.id}">Rol</label>
				<input id="role-{contact.id}" name="role" value={contact.role} required />
			</div>
			<div class="ag-field">
				<label for="phone-{contact.id}">Telefoon</label>
				<input id="phone-{contact.id}" name="phone" value={contact.phone ?? ''} />
			</div>
			<div class="ag-field">
				<label for="email-{contact.id}">E-mail</label>
				<input id="email-{contact.id}" name="email" value={contact.email ?? ''} />
			</div>
			<div class="ag-field">
				<label for="notes-{contact.id}">Notities</label>
				<textarea id="notes-{contact.id}" name="notes">{contact.notes ?? ''}</textarea>
			</div>
			<div style="display: flex; gap: 8px;">
				<button class="ag-btn" type="submit">Opslaan</button>
				<button class="ag-btn secondary" type="button" onclick={() => (editingId = null)}>Annuleren</button>
			</div>
		</form>
	{:else}
		<div class="ag-card row">
			<div>
				<b>{contact.name}</b>
				<div class="ag-muted">
					{contact.role}{contact.phone ? ` — ${contact.phone}` : ''}{contact.email
						? ` — ${contact.email}`
						: ''}
				</div>
			</div>
			<div style="display: flex; gap: 6px;">
				<button class="ag-btn secondary" style="padding: 4px 10px;" onclick={() => (editingId = contact.id)}
					>Wijzigen</button
				>
				<form method="POST" action="?/delete" use:enhance>
					<input type="hidden" name="id" value={contact.id} />
					<button class="ag-btn danger" style="padding: 4px 10px;" type="submit">Verwijderen</button>
				</form>
			</div>
		</div>
	{/if}
{:else}
	<p class="ag-muted">Nog geen contactpersonen.</p>
{/each}

<h2>Nieuw contact</h2>
<form method="POST" action="?/create" use:enhance class="ag-card">
	<div class="ag-field">
		<label for="new-name">Naam</label>
		<input id="new-name" name="name" required />
	</div>
	<div class="ag-field">
		<label for="new-role">Rol</label>
		<input id="new-role" name="role" placeholder="bv. Loodgieter" required />
	</div>
	<div class="ag-field">
		<label for="new-phone">Telefoon</label>
		<input id="new-phone" name="phone" />
	</div>
	<div class="ag-field">
		<label for="new-email">E-mail</label>
		<input id="new-email" name="email" />
	</div>
	<div class="ag-field">
		<label for="new-notes">Notities</label>
		<textarea id="new-notes" name="notes"></textarea>
	</div>
	<button class="ag-btn" type="submit">Toevoegen</button>
</form>
