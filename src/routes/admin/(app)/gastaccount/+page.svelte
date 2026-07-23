<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	function fmt(d: string | Date) {
		return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
	}
</script>

<h1>Gastaccount</h1>
<p class="ag-muted">
	Er is één gedeeld gastaccount. Stel hier een nieuw wachtwoord in en koppel het aan het huidige
	verblijf voordat je de inloggegevens doorgeeft aan de volgende gast — dit ongeldigt meteen alle
	eerdere gast-sessies.
</p>

{#if form?.error}
	<p class="ag-error">{form.error}</p>
{/if}
{#if form?.success}
	<p class="ag-card">Gastaccount bijgewerkt. Bestaande sessies zijn verlopen.</p>
{/if}

{#if data.account}
	<div class="ag-card">
		<span class="ag-muted"
			>Laatst bijgewerkt: {fmt(data.account.updatedAt)} — huidig gekoppeld verblijf: {data.stays.find(
				(s) => s.id === data.account?.currentStayId
			)?.title ?? 'geen'}</span
		>
	</div>
{/if}

<form method="POST" action="?/reset" use:enhance class="ag-card">
	<div class="ag-field">
		<label for="password">Nieuw wachtwoord</label>
		<input id="password" name="password" type="text" minlength="6" required />
	</div>
	<div class="ag-field">
		<label for="stayId">Koppel aan verblijf</label>
		<select id="stayId" name="stayId">
			<option value="">Geen</option>
			{#each data.stays as stay (stay.id)}
				<option value={stay.id}>{stay.title} ({fmt(stay.startDate)} – {fmt(stay.endDate)})</option>
			{/each}
		</select>
	</div>
	<button class="ag-btn" type="submit">Gastaccount instellen / resetten</button>
</form>
