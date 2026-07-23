import { fail } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db/client';
import { guestAccount, stays } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/auth/password';
import { revokeAllGuestSessions } from '$lib/server/auth/session';

export const load: PageServerLoad = async ({ platform }) => {
	const db = createDb(platform!.env.DB);
	const [account] = await db.select().from(guestAccount).where(eq(guestAccount.id, 1)).limit(1);
	const allStays = await db.select().from(stays).orderBy(desc(stays.startDate));
	return { account: account ?? null, stays: allStays };
};

export const actions: Actions = {
	// P0-2: admin maakt/reset het ene gedeelde gastaccount en koppelt het aan het huidige verblijf.
	// Reset ongeldigt meteen alle bestaande gastsessies (zie session.ts).
	reset: async ({ request, platform, locals }) => {
		const data = await request.formData();
		const password = String(data.get('password') ?? '');
		const stayId = data.get('stayId') ? Number(data.get('stayId')) : null;

		if (password.length < 6) {
			return fail(400, { error: 'Wachtwoord moet minstens 6 tekens zijn.' });
		}

		const db = createDb(platform!.env.DB);
		const passwordHash = await hashPassword(password);
		const now = new Date();

		const [existing] = await db.select({ id: guestAccount.id }).from(guestAccount).where(eq(guestAccount.id, 1)).limit(1);
		if (existing) {
			await db
				.update(guestAccount)
				.set({ passwordHash, currentStayId: stayId, updatedByAdminId: locals.admin!.id, updatedAt: now })
				.where(eq(guestAccount.id, 1));
		} else {
			await db.insert(guestAccount).values({
				id: 1,
				passwordHash,
				currentStayId: stayId,
				updatedByAdminId: locals.admin!.id,
				updatedAt: now
			});
		}

		await revokeAllGuestSessions(db);
		return { success: true };
	}
};
