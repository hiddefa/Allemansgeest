import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createDb } from '$lib/server/db/client';
import { revokeSession } from '$lib/server/auth/session';
import { clearGuestCookie } from '$lib/server/auth/cookies';
import { GUEST_COOKIE } from '$lib/server/auth/constants';

export const POST: RequestHandler = async ({ cookies, platform }) => {
	const db = createDb(platform!.env.DB);
	await revokeSession(db, cookies.get(GUEST_COOKIE));
	clearGuestCookie(cookies);
	redirect(303, '/');
};
