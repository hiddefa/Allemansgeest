<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<h1>Huisregels & praktische info</h1>
<p class="ag-muted">Deze tekst zien gasten op hun huisregels-pagina.</p>

{#if form?.error}
	<p class="ag-error">{form.error}</p>
{/if}

{#each data.sections as section (section.id)}
	<form method="POST" action="?/update" use:enhance class="ag-card">
		<input type="hidden" name="id" value={section.id} />
		<div class="ag-field">
			<label for="title-{section.id}">Titel</label>
			<input id="title-{section.id}" name="title" value={section.title} required />
		</div>
		<div class="ag-field">
			<label for="body-{section.id}">Tekst</label>
			<textarea id="body-{section.id}" name="bodyMarkdown" rows="4" required>{section.bodyMarkdown}</textarea
			>
		</div>
		<button class="ag-btn" type="submit">Opslaan</button>
	</form>
{/each}

<h2>Storingscontact</h2>
<form method="POST" action="?/updateEmergencyContact" use:enhance class="ag-card">
	<div class="ag-field">
		<label for="ec-name">Naam</label>
		<input id="ec-name" name="name" value={data.contact?.name ?? ''} required />
	</div>
	<div class="ag-field">
		<label for="ec-phone">Telefoonnummer</label>
		<input id="ec-phone" name="phone" value={data.contact?.phone ?? ''} required />
	</div>
	<div class="ag-field">
		<label for="ec-note">Toelichting</label>
		<textarea id="ec-note" name="note">{data.contact?.note ?? ''}</textarea>
	</div>
	<button class="ag-btn" type="submit">Opslaan</button>
</form>
