import { asc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { createDb } from '$lib/server/db/client';
import { houseRulesSections } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ platform }) => {
	const db = createDb(platform!.env.DB);
	const sections = await db.select().from(houseRulesSections).orderBy(asc(houseRulesSections.sortOrder));
	return { sections };
};
