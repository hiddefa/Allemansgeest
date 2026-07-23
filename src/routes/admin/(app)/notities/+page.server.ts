import { fail } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db/client';
import { notes } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ platform }) => {
	const db = createDb(platform!.env.DB);
	const all = await db.select().from(notes).orderBy(desc(notes.createdAt));
	return { notes: all };
};

export const actions: Actions = {
	create: async ({ request, platform, locals }) => {
		const data = await request.formData();
		const body = String(data.get('body') ?? '').trim();
		if (!body) return fail(400, { error: 'Notitie mag niet leeg zijn.' });

		const db = createDb(platform!.env.DB);
		const now = new Date();
		await db.insert(notes).values({
			body,
			createdByAdminId: locals.admin!.id,
			createdAt: now,
			updatedAt: now
		});
		return { success: true };
	},

	update: async ({ request, platform }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const body = String(data.get('body') ?? '').trim();
		if (!id || !body) return fail(400, { error: 'Notitie mag niet leeg zijn.' });

		const db = createDb(platform!.env.DB);
		await db.update(notes).set({ body, updatedAt: new Date() }).where(eq(notes.id, id));
		return { success: true };
	},

	delete: async ({ request, platform }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { error: 'Ongeldige notitie.' });

		const db = createDb(platform!.env.DB);
		await db.delete(notes).where(eq(notes.id, id));
		return { success: true };
	}
};
