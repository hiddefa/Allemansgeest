import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db/client';
import { guestAccount, contactFormSubmissions } from '$lib/server/db/schema';
import { verifyPassword } from '$lib/server/auth/password';
import { createGuestSession } from '$lib/server/auth/session';
import { setGuestCookie } from '$lib/server/auth/cookies';
import { sendContactNotification } from '$lib/server/email';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.guest) redirect(303, '/gast');
};

export const actions: Actions = {
	// P0-14: gast logt in met het ene gedeelde account, komt op hetzelfde domein in het gastgedeelte.
	guestLogin: async ({ request, cookies, platform, locals }) => {
		const data = await request.formData();
		const password = String(data.get('password') ?? '');
		if (!password) return fail(400, { loginError: 'Vul het wachtwoord in.' });

		const db = createDb(platform!.env.DB);
		const [account] = await db.select().from(guestAccount).where(eq(guestAccount.id, 1)).limit(1);

		if (!account || !(await verifyPassword(password, account.passwordHash))) {
			return fail(400, { loginError: 'Onjuist wachtwoord.' });
		}

		const token = await createGuestSession(db);
		setGuestCookie(cookies, token);
		locals.guest = { id: account.id, currentStayId: account.currentStayId };

		redirect(303, '/gast');
	},

	// P0-13: altijd opslaan (D1), e-mail is best-effort.
	contact: async ({ request, platform }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const message = String(data.get('message') ?? '').trim();

		if (!name || !email || !message) {
			return fail(400, { contactError: 'Vul naam, e-mailadres en bericht in.' });
		}

		const db = createDb(platform!.env.DB);
		let emailError: string | null = null;
		try {
			await sendContactNotification(platform!.env, { name, email, message });
		} catch (e) {
			emailError = e instanceof Error ? e.message : 'onbekende fout';
		}

		await db.insert(contactFormSubmissions).values({
			name,
			email,
			message,
			createdAt: new Date(),
			status: 'new',
			emailError
		});

		return { contactSuccess: true };
	}
};
