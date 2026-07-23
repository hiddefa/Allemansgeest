<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function fmt(d: string | Date) {
		return new Date(d).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
	}
</script>

<h1>Berichten</h1>
<p class="ag-muted">Contactformulier-inzendingen van de publieke landingspagina.</p>

{#each data.submissions as sub (sub.id)}
	<div class="ag-card">
		<div style="display: flex; justify-content: space-between; align-items: center;">
			<b>{sub.name} — {sub.email}</b>
			{#if sub.status === 'new'}
				<span class="ag-badge">nieuw</span>
			{/if}
		</div>
		<p style="white-space: pre-wrap; margin: 6px 0;">{sub.message}</p>
		<div style="display: flex; justify-content: space-between; align-items: center;">
			<span class="ag-muted">
				{fmt(sub.createdAt)}
				{#if sub.emailError}
					— e-mail niet verzonden ({sub.emailError})
				{/if}
			</span>
			{#if sub.status === 'new'}
				<form method="POST" action="?/markRead" use:enhance>
					<input type="hidden" name="id" value={sub.id} />
					<button class="ag-btn secondary" style="padding: 4px 10px;" type="submit">Markeer gelezen</button>
				</form>
			{/if}
		</div>
	</div>
{:else}
	<p class="ag-muted">Nog geen berichten.</p>
{/each}
