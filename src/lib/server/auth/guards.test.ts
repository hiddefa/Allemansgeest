import { describe, it, expect } from 'vitest';
import { redirect } from '@sveltejs/kit';
import { requireAdmin, requireGuest } from './guards';

const admin = { id: 1, email: 'hidde@example.com', name: 'Hidde' };
const guest = { id: 1, currentStayId: null };

// Deze tests implementeren de P0-3 acceptatiecriteria letterlijk (zie
// Docs_Allemansgeest/Allemansgeest App - Productspecificatie MVP.md). Runnen ze rood,
// dan is de never-do (bezettingskalender nooit bij gasten/publiek) technisch gebroken.
describe('requireAdmin — bezettingskalender toegangsscheiding', () => {
	it('anonieme bezoeker: geeft geen data, redirect naar /admin/login', () => {
		expect(() => requireAdmin({ admin: null, guest: null })).toThrowError(
			expect.objectContaining({ status: 303, location: '/admin/login' })
		);
	});

	it('gast-sessie: geeft geen data, 403 toegang geweigerd (geen redirect naar data)', () => {
		try {
			requireAdmin({ admin: null, guest });
			expect.unreachable('had moeten gooien');
		} catch (e) {
			expect((e as { status?: number }).status).toBe(403);
		}
	});

	it('admin-sessie: geeft het volledige overzicht (de admin-user zelf)', () => {
		expect(requireAdmin({ admin, guest: null })).toEqual(admin);
	});

	it('admin-sessie wint als beide cookies op de een of andere manier aanwezig zijn', () => {
		expect(requireAdmin({ admin, guest })).toEqual(admin);
	});
});

describe('requireGuest — gastgebied toegang', () => {
	it('geen gastsessie: redirect naar /', () => {
		expect(() => requireGuest({ admin: null, guest: null })).toThrowError(
			expect.objectContaining({ status: 303, location: '/' })
		);
	});

	it('gastsessie: geeft de gast terug', () => {
		expect(requireGuest({ admin: null, guest })).toEqual(guest);
	});
});

// Sanity-check dat @sveltejs/kit's redirect() daadwerkelijk het shape gooit die hierboven verwacht wordt.
describe('sanity: redirect() shape', () => {
	it('redirect(303, url) gooit een object met status en location', () => {
		try {
			redirect(303, '/x');
			expect.unreachable('had moeten gooien');
		} catch (e) {
			expect(e).toMatchObject({ status: 303, location: '/x' });
		}
	});
});
