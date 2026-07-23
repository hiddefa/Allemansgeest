<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		id,
		name,
		label,
		autocomplete = undefined,
		required = true,
		minlength = undefined
	}: {
		id: string;
		name: string;
		label: string;
		autocomplete?: HTMLInputAttributes['autocomplete'];
		required?: boolean;
		minlength?: number;
	} = $props();

	let visible = $state(false);
</script>

<div class="ag-field">
	<label for={id}>{label}</label>
	<div class="ag-password-wrap">
		<input {id} {name} type={visible ? 'text' : 'password'} {autocomplete} {required} {minlength} />
		<button
			type="button"
			class="ag-eye-toggle"
			onclick={() => (visible = !visible)}
			aria-label={visible ? 'Wachtwoord verbergen' : 'Wachtwoord tonen'}
			aria-pressed={visible}
		>
			{#if visible}
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path
						d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.5 5.3A10.4 10.4 0 0112 5c5 0 9 4 10 7a12.6 12.6 0 01-3.3 4.3M6.4 6.6C4.2 8 2.6 10 2 12c1 3 5 7 10 7 1.3 0 2.6-.3 3.7-.7"
						stroke="currentColor"
						stroke-width="1.7"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			{:else}
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path
						d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
						stroke="currentColor"
						stroke-width="1.7"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7" />
				</svg>
			{/if}
		</button>
	</div>
</div>
