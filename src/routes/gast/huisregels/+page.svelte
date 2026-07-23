<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<h1>Huisregels & praktische info</h1>

{#each data.sections as section (section.id)}
	<div class="ag-card">
		<h3 style="margin: 0 0 4px;">{section.title}</h3>
		<p style="margin: 0; white-space: pre-wrap;">{section.bodyMarkdown}</p>
	</div>
{:else}
	<p class="ag-muted">Nog geen huisregels ingevuld.</p>
{/each}
