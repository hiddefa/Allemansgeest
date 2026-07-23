import type { LayoutServerLoad } from './$types';
import { requireGuest } from '$lib/server/auth/guards';

// Dekt élke route onder gast/(app)/**. Geen gastsessie -> redirect naar '/'.
export const load: LayoutServerLoad = async ({ locals }) => {
	const guest = requireGuest(locals);
	return { guest };
};
