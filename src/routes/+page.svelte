<script lang="ts">
	import { enhance } from '$app/forms';
	import PasswordField from '$lib/components/PasswordField.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	const amenities = [
		{
			title: '4 slaapkamers',
			desc: 'Ruimte voor het hele gezelschap, met rustige bedden en uitzicht op het bos.',
			accent: 'var(--ag-lime)'
		},
		{
			title: 'Open haard',
			desc: 'Voor koele avonden — hout ligt klaar in de schuur.',
			accent: 'var(--ag-green)'
		},
		{
			title: 'Tuin in het bos',
			desc: 'Een omheind erf met terras, direct grenzend aan het bos.',
			accent: 'var(--ag-forest)'
		},
		{
			title: 'Volledig ingerichte keuken',
			desc: 'Kook zoals thuis, met alles wat je nodig hebt.',
			accent: 'var(--ag-lime)'
		},
		{ title: 'Wifi', desc: 'Voor wie toch even bereikbaar moet zijn.', accent: 'var(--ag-green)' },
		{
			title: 'Fietsenstalling',
			desc: 'Ideaal startpunt om de Achterhoek te verkennen.',
			accent: 'var(--ag-forest)'
		}
	];
</script>

<svelte:head>
	<title>Allemansgeest — vakantiehuis in het bos, Harfsen</title>
</svelte:head>

<div class="ag-landing">
	<div class="ag-landing-header">
		<span class="ag-landing-wordmark">Allemansgeest</span>
		<div class="ag-landing-nav">
			<a href="#verhaal">Ons verhaal</a>
			<a href="#fotos">Foto's</a>
			<a href="#faciliteiten">Faciliteiten</a>
			<a href="#contact">Contact</a>

			<!-- P0-14: gastenlogin op de landingspagina, als compacte pill-knop.
			     <details> geeft een uitklapbaar paneel zonder JS nodig. -->
			<details class="ag-login-toggle pill" open={!!form?.loginError}>
				<summary>Inloggen</summary>
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
	</div>

	<div class="ag-hero">
		<img class="ag-hero-image" src="/images/interior-living-room.jpg" alt="Woonkamer met open haard bij Allemansgeest" />
		<div class="ag-hero-overlay"></div>
		<div class="ag-hero-content">
			<span class="ag-hero-eyebrow">Vakantiehuis in het bos · Harfsen, Gelderland</span>
			<h1>Thuiskomen tussen de dennen</h1>
			<p class="ag-hero-text">
				Allemansgeest is een ruim vakantiehuis verscholen in de bossen van Harfsen. Knappere open
				haard, een tuin vol vogels en niets dan stilte — voor wie even helemaal weg wil.
			</p>
			<div class="ag-hero-actions">
				<a class="ag-btn-pill" href="#contact">Bekijk beschikbaarheid</a>
				<a class="ag-btn-pill-outline" href="#verhaal">Ons verhaal</a>
			</div>
		</div>
	</div>

	<div id="verhaal" class="ag-story">
		<div>
			<span class="ag-story-eyebrow">Sinds de jaren '60</span>
			<h2>Een huis met geschiedenis, midden in het groen</h2>
			<p>
				Allemansgeest staat er al sinds de jaren zestig, weggedoken tussen berken en dennen aan de
				rand van Harfsen. De houten balken, de open haard en de erker met uitzicht op het bos zijn
				nog altijd hetzelfde — alleen de bank is inmiddels net wat zachter.
			</p>
			<p>
				Je deelt het huis niet met andere gasten: het is helemaal van jou, voor zolang je boekt.
				Overdag een wandeling door het bos, 's avonds de haard aan en de sterren boven de open
				plek in de tuin.
			</p>
		</div>
		<div>
			<img
				class="ag-story-img"
				src="/images/exterior-postcard.jpg"
				alt="Allemansgeest, Harfsen — historische foto van het huis"
			/>
			<span class="ag-story-caption">Allemansgeest, Harfsen — nog altijd hetzelfde huis in het bos</span>
		</div>
	</div>

	<div id="faciliteiten" class="ag-amenities">
		<div class="ag-amenities-inner">
			<h2>Alles voor een goed verblijf</h2>
			<div class="ag-amenities-grid">
				{#each amenities as item (item.title)}
					<div class="ag-amenity-card">
						<div class="ag-amenity-accent" style="background: {item.accent};"></div>
						<h3>{item.title}</h3>
						<p>{item.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div id="fotos" class="ag-gallery">
		<div class="ag-gallery-header">
			<h2>Een kijkje binnen</h2>
			<span>Echte foto's van het huis, geen decor</span>
		</div>
		<div class="ag-gallery-grid">
			<div class="ag-gallery-item ag-gallery-item--large">
				<img src="/images/interior-living-room.jpg" alt="Woonkamer met open haard" />
			</div>
			<div class="ag-gallery-item ag-gallery-item--wide">
				<img src="/images/interior-dining.jpg" alt="Eetkamer met lange tafel" />
			</div>
			<div class="ag-gallery-item">
				<img src="/images/interior-bedroom.jpg" alt="Slaapkamer met uitzicht op de tuin" />
			</div>
			<div class="ag-gallery-item">
				<img src="/images/interior-hallway.jpg" alt="Hal met houten kapstok" />
			</div>
		</div>
	</div>

	<div id="contact" class="ag-contact-cta">
		<div class="ag-contact-grid">
			<div class="ag-contact-intro">
				<h2>Klaar voor een weekend in het groen?</h2>
				<p>
					Stuur een bericht met je gewenste data en het aantal gasten. We reageren meestal binnen
					een dag met de beschikbaarheid.
				</p>
				<div class="ag-contact-location">Harfsen, Gelderland</div>
			</div>

			{#if form?.contactSuccess}
				<div class="ag-contact-form-card">
					<p class="ag-card" style="margin: 0;">Bedankt voor je bericht! We nemen snel contact op.</p>
				</div>
			{:else}
				<div class="ag-contact-form-card">
					{#if form?.contactError}
						<p class="ag-error" style="margin: 0 0 12px;">{form.contactError}</p>
					{/if}
					<form method="POST" action="?/contact" use:enhance>
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
							<textarea id="message" name="message" rows="3" required></textarea>
						</div>
						<button class="ag-btn full" type="submit">Versturen</button>
					</form>
				</div>
			{/if}
		</div>
	</div>

	<div class="ag-landing-footer">
		<span class="ag-landing-wordmark">Allemansgeest</span>
		<span class="ag-landing-footer-copyright">© 2026 Allemansgeest, Harfsen</span>
	</div>
</div>
