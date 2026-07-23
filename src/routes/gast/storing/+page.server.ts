import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { createDb } from '$lib/server/db/client';
import { emergencyContact } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ platform }) => {
	const db = createDb(platform!.env.DB);
	const [contact] = await db.select().from(emergencyContact).where(eq(emergencyContact.id, 1)).limit(1);
	return { contact: contact ?? null };
};
