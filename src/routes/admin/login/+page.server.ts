import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db/client';
import { adminUsers } from '$lib/server/db/schema';
import { verifyPassword } from '$lib/server/auth/password';
import { createAdminSession } from '$lib/server/auth/session';
import { setAdminCookie } from '$lib/server/auth/cookies';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.admin) redirect(303, '/admin');
};

export const actions: Actions = {
	default: async ({ request, cookies, platform, locals }) => {
		const data = await request.formData();
		const email = String(data.get('email') ?? '').trim();
		const password = String(data.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { error: 'Vul e-mailadres en wachtwoord in.' });
		}

		const db = createDb(platform!.env.DB);
		const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);

		if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
			return fail(400, { error: 'Onjuist e-mailadres of wachtwoord.' });
		}

		const token = await createAdminSession(db, admin.id);
		setAdminCookie(cookies, token);
		locals.admin = { id: admin.id, email: admin.email, name: admin.name };

		redirect(303, '/admin');
	}
};
