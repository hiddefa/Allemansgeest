import { fail } from '@sveltejs/kit';
import { eq, asc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db/client';
import { houseRulesSections, emergencyContact } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ platform }) => {
	const db = createDb(platform!.env.DB);
	const sections = await db.select().from(houseRulesSections).orderBy(asc(houseRulesSections.sortOrder));
	const [contact] = await db.select().from(emergencyContact).where(eq(emergencyContact.id, 1)).limit(1);
	return { sections, contact: contact ?? null };
};

export const actions: Actions = {
	update: async ({ request, platform }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const title = String(data.get('title') ?? '').trim();
		const bodyMarkdown = String(data.get('bodyMarkdown') ?? '').trim();
		if (!id || !title || !bodyMarkdown) return fail(400, { error: 'Titel en tekst zijn verplicht.' });

		const db = createDb(platform!.env.DB);
		await db
			.update(houseRulesSections)
			.set({ title, bodyMarkdown, updatedAt: new Date() })
			.where(eq(houseRulesSections.id, id));
		return { success: true };
	},

	updateEmergencyContact: async ({ request, platform }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const phone = String(data.get('phone') ?? '').trim();
		const note = String(data.get('note') ?? '').trim() || null;
		if (!name || !phone) return fail(400, { error: 'Naam en telefoonnummer zijn verplicht.' });

		const db = createDb(platform!.env.DB);
		const now = new Date();
		const [existing] = await db
			.select({ id: emergencyContact.id })
			.from(emergencyContact)
			.where(eq(emergencyContact.id, 1))
			.limit(1);
		if (existing) {
			await db.update(emergencyContact).set({ name, phone, note, updatedAt: now }).where(eq(emergencyContact.id, 1));
		} else {
			await db.insert(emergencyContact).values({ id: 1, name, phone, note, updatedAt: now });
		}
		return { success: true };
	}
};
