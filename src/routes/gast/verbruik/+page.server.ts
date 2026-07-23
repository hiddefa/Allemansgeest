import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { createDb } from '$lib/server/db/client';
import { meterReadings } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ platform, locals }) => {
	const stayId = locals.guest!.currentStayId;
	if (!stayId) return { reading: null, complete: false };

	const db = createDb(platform!.env.DB);
	const [reading] = await db.select().from(meterReadings).where(eq(meterReadings.stayId, stayId)).limit(1);

	// P0-11 acceptatiecriterium: zolang er geen eindstand is, tonen we "nog niet compleet"
	// i.p.v. een fout getal.
	const complete = !!reading && reading.electricityEndKwh !== null && reading.gasEndM3 !== null;

	return { reading: reading ?? null, complete };
};
