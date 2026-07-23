import { fail } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db/client';
import { stays, meterReadings } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ platform }) => {
	const db = createDb(platform!.env.DB);
	const allStays = await db.select().from(stays).orderBy(desc(stays.startDate));
	const allReadings = await db.select().from(meterReadings);
	const readingsByStay = new Map(allReadings.map((r) => [r.stayId, r]));

	return {
		stays: allStays.map((s) => ({ ...s, reading: readingsByStay.get(s.id) ?? null }))
	};
};

function num(data: FormData, key: string): number | null {
	const raw = data.get(key);
	if (raw === null || raw === '') return null;
	const n = Number(raw);
	return Number.isFinite(n) ? n : null;
}

export const actions: Actions = {
	save: async ({ request, platform }) => {
		const data = await request.formData();
		const stayId = Number(data.get('stayId'));
		if (!stayId) return fail(400, { error: 'Ongeldig verblijf.' });

		const electricityStartKwh = num(data, 'electricityStartKwh');
		const electricityEndKwh = num(data, 'electricityEndKwh');
		const gasStartM3 = num(data, 'gasStartM3');
		const gasEndM3 = num(data, 'gasEndM3');
		const amountRaw = String(data.get('amount') ?? '').trim();
		const amountCents = amountRaw ? Math.round(Number(amountRaw.replace(',', '.')) * 100) : null;

		const db = createDb(platform!.env.DB);
		const now = new Date();
		const [existing] = await db
			.select({ id: meterReadings.id })
			.from(meterReadings)
			.where(eq(meterReadings.stayId, stayId))
			.limit(1);

		const values = {
			electricityStartKwh,
			electricityEndKwh,
			gasStartM3,
			gasEndM3,
			amountCents,
			amountEnteredAt: amountCents !== null ? now : null,
			updatedAt: now
		};

		if (existing) {
			await db.update(meterReadings).set(values).where(eq(meterReadings.id, existing.id));
		} else {
			await db.insert(meterReadings).values({ stayId, ...values });
		}
		return { success: true };
	}
};
