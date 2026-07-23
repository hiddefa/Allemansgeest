import { fail } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db/client';
import { documents } from '$lib/server/db/schema';
import { buildDocumentKey, putDocument, deleteDocument } from '$lib/server/r2';

export const load: PageServerLoad = async ({ platform }) => {
	const db = createDb(platform!.env.DB);
	const all = await db.select().from(documents).orderBy(desc(documents.createdAt));
	return { documents: all };
};

export const actions: Actions = {
	upload: async ({ request, platform, locals }) => {
		const data = await request.formData();
		const file = data.get('file');
		if (!(file instanceof File) || file.size === 0) {
			return fail(400, { error: 'Kies een bestand om te uploaden.' });
		}

		const key = buildDocumentKey(file.name);
		await putDocument(platform!.env.BUCKET, key, file);

		const db = createDb(platform!.env.DB);
		await db.insert(documents).values({
			filename: file.name,
			r2Key: key,
			sizeBytes: file.size,
			contentType: file.type || 'application/octet-stream',
			uploadedByAdminId: locals.admin!.id,
			createdAt: new Date()
		});
		return { success: true };
	},

	delete: async ({ request, platform }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { error: 'Ongeldig document.' });

		const db = createDb(platform!.env.DB);
		const [doc] = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
		if (doc) {
			await deleteDocument(platform!.env.BUCKET, doc.r2Key);
			await db.delete(documents).where(eq(documents.id, id));
		}
		return { success: true };
	}
};
