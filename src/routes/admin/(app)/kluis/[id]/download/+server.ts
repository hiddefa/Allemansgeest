import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { createDb } from '$lib/server/db/client';
import { documents } from '$lib/server/db/schema';
import { getDocument } from '$lib/server/r2';

// Valt binnen admin/(app)/**, dus al gegated door de admin-guard (P0-3-patroon).
export const GET: RequestHandler = async ({ params, platform }) => {
	const id = Number(params.id);
	const db = createDb(platform!.env.DB);
	const [doc] = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
	if (!doc) error(404, 'Document niet gevonden');

	const object = await getDocument(platform!.env.BUCKET, doc.r2Key);
	if (!object) error(404, 'Bestand niet gevonden in opslag');

	return new Response(object.body, {
		headers: {
			'Content-Type': doc.contentType,
			'Content-Disposition': `attachment; filename="${doc.filename}"`
		}
	});
};
