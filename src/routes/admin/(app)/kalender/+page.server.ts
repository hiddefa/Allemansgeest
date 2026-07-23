import { fail } from '@sveltejs/kit';
import { eq, asc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db/client';
import { stays } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ platform }) => {
	const db = createDb(platform!.env.DB);
	const all = await db.select().from(stays).orderBy(asc(stays.startDate));
	return { stays: all };
};

function parseStayForm(data: FormData) {
	const title = String(data.get('title') ?? '').trim();
	const type = String(data.get('type') ?? '');
	const startDate = String(data.get('startDate') ?? '');
	const endDate = String(data.get('endDate') ?? '');
	const notes = String(data.get('notes') ?? '').trim() || null;

	if (!title || !startDate || !endDate) {
		return { error: 'Titel, startdatum en einddatum zijn verplicht.' } as const;
	}
	if (!['guest_stay', 'owner_use', 'maintenance_block', 'other'].includes(type)) {
		return { error: 'Ongeldig type.' } as const;
	}
	return {
		title,
		type: type as 'guest_stay' | 'owner_use' | 'maintenance_block' | 'other',
		startDate: new Date(startDate),
		endDate: new Date(endDate),
		notes
	} as const;
}

export const actions: Actions = {
	create: async ({ request, platform, locals }) => {
		const data = await request.formData();
		const parsed = parseStayForm(data);
		if ('error' in parsed) return fail(400, { error: parsed.error });

		const db = createDb(platform!.env.DB);
		await db.insert(stays).values({ ...parsed, createdByAdminId: locals.admin!.id });
		return { success: true };
	},

	update: async ({ request, platform }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { error: 'Ongeldig verblijf.' });

		const parsed = parseStayForm(data);
		if ('error' in parsed) return fail(400, { error: parsed.error });

		const db = createDb(platform!.env.DB);
		await db.update(stays).set(parsed).where(eq(stays.id, id));
		return { success: true };
	},

	delete: async ({ request, platform }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { error: 'Ongeldig verblijf.' });

		const db = createDb(platform!.env.DB);
		await db.delete(stays).where(eq(stays.id, id));
		return { success: true };
	}
};
