import type { Cookies } from '@sveltejs/kit';
import { ADMIN_COOKIE, GUEST_COOKIE } from './constants';

const COOKIE_OPTIONS = {
	path: '/',
	httpOnly: true,
	secure: true,
	sameSite: 'lax' as const,
	maxAge: 60 * 60 * 24 * 30 // 30 dagen
};

export function setAdminCookie(cookies: Cookies, token: string) {
	cookies.set(ADMIN_COOKIE, token, COOKIE_OPTIONS);
}

export function setGuestCookie(cookies: Cookies, token: string) {
	cookies.set(GUEST_COOKIE, token, COOKIE_OPTIONS);
}

export function clearAdminCookie(cookies: Cookies) {
	cookies.delete(ADMIN_COOKIE, { path: '/' });
}

export function clearGuestCookie(cookies: Cookies) {
	cookies.delete(GUEST_COOKIE, { path: '/' });
}
