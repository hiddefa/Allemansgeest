import { fail } from '@sveltejs/kit';
import { eq, asc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db/client';
import { contacts } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ platform }) => {
	const db = createDb(platform!.env.DB);
	const all = await db.select().from(contacts).orderBy(asc(contacts.name));
	return { contacts: all };
};

function parseForm(data: FormData) {
	const name = String(data.get('name') ?? '').trim();
	const role = String(data.get('role') ?? '').trim();
	const phone = String(data.get('phone') ?? '').trim() || null;
	const email = String(data.get('email') ?? '').trim() || null;
	const notes = String(data.get('notes') ?? '').trim() || null;
	if (!name || !role) return { error: 'Naam en rol zijn verplicht.' } as const;
	return { name, role, phone, email, notes } as const;
}

export const actions: Actions = {
	create: async ({ request, platform }) => {
		const parsed = parseForm(await request.formData());
		if ('error' in parsed) return fail(400, { error: parsed.error });
		const db = createDb(platform!.env.DB);
		await db.insert(contacts).values(parsed);
		return { success: true };
	},
	update: async ({ request, platform }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { error: 'Ongeldig contact.' });
		const parsed = parseForm(data);
		if ('error' in parsed) return fail(400, { error: parsed.error });
		const db = createDb(platform!.env.DB);
		await db.update(contacts).set(parsed).where(eq(contacts.id, id));
		return { success: true };
	},
	delete: async ({ request, platform }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { error: 'Ongeldig contact.' });
		const db = createDb(platform!.env.DB);
		await db.delete(contacts).where(eq(contacts.id, id));
		return { success: true };
	}
};
