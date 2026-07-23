<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Admin inloggen — Allemansgeest</title>
</svelte:head>

<div class="ag-shell">
	<div class="ag-header">
		<span class="ag-title">Allemansgeest — admin</span>
	</div>
	<div class="ag-main" style="max-width: 360px;">
		<h1>Inloggen</h1>
		{#if form?.error}
			<p class="ag-error">{form.error}</p>
		{/if}
		<form method="POST" use:enhance>
			<div class="ag-field">
				<label for="email">E-mailadres</label>
				<input id="email" name="email" type="email" autocomplete="username" required />
			</div>
			<div class="ag-field">
				<label for="password">Wachtwoord</label>
				<input id="password" name="password" type="password" autocomplete="current-password" required />
			</div>
			<button class="ag-btn" type="submit">Inloggen</button>
		</form>
	</div>
</div>
