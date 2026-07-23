<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function progressLabel(items: { checked: boolean }[]) {
		const done = items.filter((i) => i.checked).length;
		return `${done}/${items.length} voltooid`;
	}
</script>

<h1>In-/uitchecken</h1>

{#if !data.stayId}
	<p class="ag-error">Er is nog geen verblijf aan je account gekoppeld — vraag Hidde/Flo dit te regelen.</p>
{:else}
	<h2>Inchecken — {progressLabel(data.checkin)}</h2>
	{#each data.checkin as item (item.id)}
		<form method="POST" action="?/toggle" use:enhance class="ag-card row">
			<label style="display: flex; align-items: center; gap: 8px; cursor: pointer; margin: 0;">
				<input
					type="checkbox"
					checked={item.checked}
					onchange={(e) => e.currentTarget.form?.requestSubmit()}
				/>
				{item.label}
			</label>
			<input type="hidden" name="itemId" value={item.id} />
			<input type="hidden" name="checked" value={!item.checked} />
		</form>
	{/each}

	<h2>Uitchecken — {progressLabel(data.checkout)}</h2>
	{#each data.checkout as item (item.id)}
		<form method="POST" action="?/toggle" use:enhance class="ag-card row">
			<label style="display: flex; align-items: center; gap: 8px; cursor: pointer; margin: 0;">
				<input
					type="checkbox"
					checked={item.checked}
					onchange={(e) => e.currentTarget.form?.requestSubmit()}
				/>
				{item.label}
			</label>
			<input type="hidden" name="itemId" value={item.id} />
			<input type="hidden" name="checked" value={!item.checked} />
		</form>
	{/each}
{/if}
