<script lang="ts">
	import { enhance } from '$app/forms';
	import PasswordField from '$lib/components/PasswordField.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Allemansgeest — vakantiehuisje in Harfsen</title>
</svelte:head>

<div class="ag-shell">
	<div class="ag-header" style="position: relative;">
		<span class="ag-title">Allemansgeest</span>

		<!-- P0-14: gastenlogin op de landingspagina, hier als compacte knop rechtsboven i.p.v.
		     een groot inline formulier. <details> geeft een uitklapbaar paneel zonder JS nodig. -->
		<details class="ag-login-toggle" open={!!form?.loginError}>
			<summary class="ag-btn secondary" style="font-size: 13px; padding: 5px 12px;">Inloggen</summary>
			<div class="ag-login-panel">
				{#if form?.loginError}
					<p class="ag-error" style="margin: 0 0 8px;">{form.loginError}</p>
				{/if}
				<form method="POST" action="?/guestLogin" use:enhance>
					<PasswordField id="guest-password" name="password" label="Gastwachtwoord" />
					<button class="ag-btn" type="submit">Inloggen</button>
				</form>
			</div>
		</details>
	</div>

	<div class="ag-main">
		<h1>Welkom bij Allemansgeest</h1>
		<p>
			Een vakantiehuisje in Harfsen, midden in het groen. Hier kom je tot rust — of je nu een week
			logeert of gewoon nieuwsgierig bent naar het verhaal achter dit huis.
		</p>

		<h2>Contact</h2>
		<p class="ag-muted">Nieuwsgierig geworden? Stuur een bericht, we reageren zo snel mogelijk.</p>
		{#if form?.contactSuccess}
			<p class="ag-card">Bedankt voor je bericht! We nemen snel contact op.</p>
		{:else}
			{#if form?.contactError}
				<p class="ag-error">{form.contactError}</p>
			{/if}
			<form method="POST" action="?/contact" use:enhance class="ag-card" style="max-width: 420px;">
				<div class="ag-field">
					<label for="name">Naam</label>
					<input id="name" name="name" required />
				</div>
				<div class="ag-field">
					<label for="email">E-mailadres</label>
					<input id="email" name="email" type="email" required />
				</div>
				<div class="ag-field">
					<label for="message">Bericht</label>
					<textarea id="message" name="message" required></textarea>
				</div>
				<button class="ag-btn" type="submit">Versturen</button>
			</form>
		{/if}
	</div>
</div>
