<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Eerste admin-account aanmaken — Allemansgeest</title>
</svelte:head>

<div class="ag-shell">
	<div class="ag-header">
		<span class="ag-title">Allemansgeest — installatie</span>
	</div>
	<div class="ag-main" style="max-width: 360px;">
		<h1>Eerste admin-account</h1>
		<p class="ag-muted">
			Deze pagina werkt alleen zolang er nog geen admin-account bestaat. Daarna is dit formulier
			uitgeschakeld en log je in via /admin/login.
		</p>
		{#if form?.error}
			<p class="ag-error">{form.error}</p>
		{/if}
		<form method="POST" use:enhance>
			<div class="ag-field">
				<label for="name">Naam</label>
				<input id="name" name="name" required />
			</div>
			<div class="ag-field">
				<label for="email">E-mailadres</label>
				<input id="email" name="email" type="email" autocomplete="username" required />
			</div>
			<div class="ag-field">
				<label for="password">Wachtwoord</label>
				<input
					id="password"
					name="password"
					type="password"
					autocomplete="new-password"
					minlength="8"
					required
				/>
			</div>
			<button class="ag-btn" type="submit">Account aanmaken</button>
		</form>
	</div>
</div>
