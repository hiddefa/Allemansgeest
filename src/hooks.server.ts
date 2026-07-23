import type { Handle } from '@sveltejs/kit';
import { createDb } from '$lib/server/db/client';
import { getAdminSession, getGuestSession } from '$lib/server/auth/session';
import { ADMIN_COOKIE, GUEST_COOKIE } from '$lib/server/auth/constants';

// Enige plek die de sessie-cookies leest en naar locals.admin / locals.guest vertaalt.
// Bewust twee losse cookies i.p.v. één account-tabel met een rol-kolom: zo kan de
// admin-guard de gast-cookie letterlijk nooit per ongeluk als admin interpreteren.
export const handle: Handle = async ({ event, resolve }) => {
	const db = createDb(event.platform!.env.DB);

	event.locals.admin = await getAdminSession(db, event.cookies.get(ADMIN_COOKIE));
	event.locals.guest = await getGuestSession(db, event.cookies.get(GUEST_COOKIE));

	return resolve(event);
};
