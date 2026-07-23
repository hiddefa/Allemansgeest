<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	function formatSize(bytes: number) {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}
</script>

<h1>Documentenkluis</h1>

{#if form?.error}
	<p class="ag-error">{form.error}</p>
{/if}

<form method="POST" action="?/upload" enctype="multipart/form-data" use:enhance class="ag-card">
	<div class="ag-field">
		<label for="file">Bestand uploaden</label>
		<input id="file" name="file" type="file" required />
	</div>
	<button class="ag-btn" type="submit">Uploaden</button>
</form>

{#each data.documents as doc (doc.id)}
	<div class="ag-card row">
		<a href="/admin/kluis/{doc.id}/download" style="color: var(--ag-bordeaux); text-decoration: none;">
			<b>{doc.filename}</b>
			<div class="ag-muted">{formatSize(doc.sizeBytes)}</div>
		</a>
		<form method="POST" action="?/delete" use:enhance>
			<input type="hidden" name="id" value={doc.id} />
			<button class="ag-btn danger" style="padding: 4px 10px;" type="submit">Verwijderen</button>
		</form>
	</div>
{:else}
	<p class="ag-muted">Nog geen documenten geüpload.</p>
{/each}
