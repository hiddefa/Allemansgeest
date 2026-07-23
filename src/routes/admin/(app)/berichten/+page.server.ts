import { eq, desc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db/client';
import { contactFormSubmissions } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ platform }) => {
	const db = createDb(platform!.env.DB);
	const submissions = await db
		.select()
		.from(contactFormSubmissions)
		.orderBy(desc(contactFormSubmissions.createdAt));
	return { submissions };
};

export const actions: Actions = {
	markRead: async ({ request, platform }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!id) return;
		const db = createDb(platform!.env.DB);
		await db.update(contactFormSubmissions).set({ status: 'read' }).where(eq(contactFormSubmissions.id, id));
		return { success: true };
	}
};
