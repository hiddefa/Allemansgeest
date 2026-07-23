import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db/client';
import { adminUsers } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/auth/password';

// Eenmalige bootstrap-route: alleen bruikbaar zolang er nog geen enkel admin-account
// bestaat. Er is bewust geen self-service registratie (P0-1) — dit is puur de
// allereerste-keer-installatiestap, niet een doorlopend open registratieformulier.
export const load: PageServerLoad = async ({ platform }) => {
	const db = createDb(platform!.env.DB);
	const existing = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
	if (existing.length > 0) {
		redirect(303, '/admin/login');
	}
};

export const actions: Actions = {
	default: async ({ request, platform }) => {
		const db = createDb(platform!.env.DB);
		const existing = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
		if (existing.length > 0) {
			return fail(400, { error: 'Er bestaat al een admin-account. Log in op /admin/login.' });
		}

		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const password = String(data.get('password') ?? '');

		if (!name || !email || password.length < 8) {
			return fail(400, {
				error: 'Vul naam en e-mailadres in; wachtwoord moet minstens 8 tekens zijn.'
			});
		}

		await db.insert(adminUsers).values({
			name,
			email,
			passwordHash: await hashPassword(password),
			createdAt: new Date()
		});

		redirect(303, '/admin/login');
	}
};
