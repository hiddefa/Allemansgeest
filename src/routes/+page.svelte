<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Allemansgeest — vakantiehuisje in Harfsen</title>
</svelte:head>

<div class="ag-shell">
	<div class="ag-header">
		<span class="ag-title">Allemansgeest</span>
	</div>

	<div class="ag-main">
		<h1>Welkom bij Allemansgeest</h1>
		<p>
			Een vakantiehuisje in Harfsen, midden in het groen. Hier kom je tot rust — of je nu een week
			logeert of gewoon nieuwsgierig bent naar het verhaal achter dit huis.
		</p>

		<h2>Ben je te gast?</h2>
		{#if form?.loginError}
			<p class="ag-error">{form.loginError}</p>
		{/if}
		<form method="POST" action="?/guestLogin" use:enhance class="ag-card" style="max-width: 320px;">
			<div class="ag-field">
				<label for="guest-password">Gastwachtwoord</label>
				<input id="guest-password" name="password" type="password" required />
			</div>
			<button class="ag-btn" type="submit">Inloggen</button>
		</form>

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

		<p class="ag-muted" style="margin-top: 24px;">
			Ben je admin? <a href="/admin/login" style="color: var(--ag-forest);">Log hier in</a>.
		</p>
	</div>
</div>
