import type { LayoutServerLoad } from './$types';
import { requireAdmin } from '$lib/server/auth/guards';

// Dekt élke route onder admin/(app)/** — kalender, kluis, administratie, contacten,
// notities, gastaccount, berichten — vóór elke render én elke form-action-POST.
// Zie src/lib/server/auth/guards.ts voor de drie afgedwongen acceptatiecriteria (P0-3).
export const load: LayoutServerLoad = async ({ locals }) => {
	const admin = requireAdmin(locals);
	return { admin };
};
