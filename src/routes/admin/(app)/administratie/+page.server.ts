import { fail } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db/client';
import { financeEntries } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ platform }) => {
	const db = createDb(platform!.env.DB);
	const all = await db.select().from(financeEntries).orderBy(desc(financeEntries.entryDate));

	const incomeCents = all.filter((e) => e.type === 'income').reduce((sum, e) => sum + e.amountCents, 0);
	const expenseCents = all.filter((e) => e.type === 'expense').reduce((sum, e) => sum + e.amountCents, 0);

	return {
		entries: all,
		incomeCents,
		expenseCents,
		balanceCents: incomeCents - expenseCents
	};
};

export const actions: Actions = {
	create: async ({ request, platform }) => {
		const data = await request.formData();
		const type = String(data.get('type') ?? '');
		const description = String(data.get('description') ?? '').trim();
		const category = String(data.get('category') ?? '').trim() || null;
		const entryDate = String(data.get('entryDate') ?? '');
		const amount = Number(String(data.get('amount') ?? '').replace(',', '.'));

		if (!['income', 'expense'].includes(type) || !description || !entryDate || !Number.isFinite(amount) || amount <= 0) {
			return fail(400, { error: 'Vul type, omschrijving, datum en een geldig bedrag in.' });
		}

		const db = createDb(platform!.env.DB);
		await db.insert(financeEntries).values({
			type: type as 'income' | 'expense',
			amountCents: Math.round(amount * 100),
			description,
			category,
			entryDate: new Date(entryDate)
		});
		return { success: true };
	},

	delete: async ({ request, platform }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { error: 'Ongeldige post.' });
		const db = createDb(platform!.env.DB);
		await db.delete(financeEntries).where(eq(financeEntries.id, id));
		return { success: true };
	}
};
