import { error, redirect } from '@sveltejs/kit';
import type { AdminSessionUser, GuestSessionUser } from './session';

export type GuardLocals = {
	admin: AdminSessionUser | null;
	guest: GuestSessionUser | null;
};

// Implementeert de drie P0-3 acceptatiecriteria letterlijk. Pure functie op `locals`
// zodat dit direct met gemockte locals unit-getest kan worden (geen DB/HTTP nodig).
// Gebruikt door src/routes/admin/(app)/+layout.server.ts — de enige plek die de
// never-do (bezettingskalender nooit bij gasten/publiek) kan laten lekken bij regressie.
export function requireAdmin(locals: GuardLocals): AdminSessionUser {
	if (locals.admin) return locals.admin; // criterium 3: admin -> volledig overzicht
	if (locals.guest) error(403, 'Toegang geweigerd'); // criterium 1: gast -> access-denied, geen data
	redirect(303, '/admin/login'); // criterium 2: anoniem -> naar login, geen data
}

// Gebruikt door src/routes/gast/(app)/+layout.server.ts.
export function requireGuest(locals: GuardLocals): GuestSessionUser {
	if (locals.guest) return locals.guest;
	redirect(303, '/');
}
