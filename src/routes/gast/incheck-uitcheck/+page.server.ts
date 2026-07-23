import { fail } from '@sveltejs/kit';
import { eq, and, asc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db/client';
import { checklistItems, checklistProgress } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ platform, locals }) => {
	const stayId = locals.guest!.currentStayId;
	const db = createDb(platform!.env.DB);
	const items = await db.select().from(checklistItems).where(eq(checklistItems.active, true)).orderBy(asc(checklistItems.sortOrder));

	let progress: { checklistItemId: number; checked: boolean }[] = [];
	if (stayId) {
		progress = await db
			.select({ checklistItemId: checklistProgress.checklistItemId, checked: checklistProgress.checked })
			.from(checklistProgress)
			.where(eq(checklistProgress.stayId, stayId));
	}

	const checkedIds = new Set(progress.filter((p) => p.checked).map((p) => p.checklistItemId));

	return {
		stayId,
		checkin: items.filter((i) => i.listType === 'checkin').map((i) => ({ ...i, checked: checkedIds.has(i.id) })),
		checkout: items.filter((i) => i.listType === 'checkout').map((i) => ({ ...i, checked: checkedIds.has(i.id) }))
	};
};

export const actions: Actions = {
	toggle: async ({ request, platform, locals }) => {
		const stayId = locals.guest!.currentStayId;
		if (!stayId) return fail(400, { error: 'Er is nog geen verblijf aan je account gekoppeld.' });

		const data = await request.formData();
		const itemId = Number(data.get('itemId'));
		const checked = data.get('checked') === 'true';
		if (!itemId) return fail(400, { error: 'Ongeldig item.' });

		const db = createDb(platform!.env.DB);
		const [existing] = await db
			.select({ id: checklistProgress.id })
			.from(checklistProgress)
			.where(and(eq(checklistProgress.stayId, stayId), eq(checklistProgress.checklistItemId, itemId)))
			.limit(1);

		if (existing) {
			await db
				.update(checklistProgress)
				.set({ checked, checkedAt: checked ? new Date() : null })
				.where(eq(checklistProgress.id, existing.id));
		} else {
			await db.insert(checklistProgress).values({
				stayId,
				checklistItemId: itemId,
				checked,
				checkedAt: checked ? new Date() : null
			});
		}
		return { success: true };
	}
};
