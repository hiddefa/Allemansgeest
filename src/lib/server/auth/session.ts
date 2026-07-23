import { eq, and } from 'drizzle-orm';
import type { Db } from '$lib/server/db/client';
import { sessions, adminUsers, guestAccount } from '$lib/server/db/schema';

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 dagen

export type AdminSessionUser = { id: number; email: string; name: string };
export type GuestSessionUser = { id: number; currentStayId: number | null };

function randomToken(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, '');
}

async function createSession(db: Db, type: 'admin' | 'guest', subjectId: number): Promise<string> {
	const id = randomToken();
	const now = new Date();
	await db.insert(sessions).values({
		id,
		type,
		subjectId,
		createdAt: now,
		expiresAt: new Date(now.getTime() + SESSION_TTL_MS)
	});
	return id;
}

export function createAdminSession(db: Db, adminId: number) {
	return createSession(db, 'admin', adminId);
}

export function createGuestSession(db: Db) {
	// Er is precies één gastaccount (singleton, id altijd 1).
	return createSession(db, 'guest', 1);
}

export async function revokeSession(db: Db, token: string | undefined) {
	if (!token) return;
	await db.delete(sessions).where(eq(sessions.id, token));
}

// Verwijdert alle actieve gastsessies — gebruikt bij het resetten van het gedeelde
// gastaccount (P0-2), zodat een oude gast na reset direct geen toegang meer heeft.
export async function revokeAllGuestSessions(db: Db) {
	await db.delete(sessions).where(eq(sessions.type, 'guest'));
}

async function loadSession(db: Db, token: string | undefined, type: 'admin' | 'guest') {
	if (!token) return null;
	const [row] = await db
		.select()
		.from(sessions)
		.where(and(eq(sessions.id, token), eq(sessions.type, type)))
		.limit(1);
	if (!row) return null;
	if (row.expiresAt.getTime() < Date.now()) {
		await db.delete(sessions).where(eq(sessions.id, token));
		return null;
	}
	return row;
}

export async function getAdminSession(
	db: Db,
	token: string | undefined
): Promise<AdminSessionUser | null> {
	const session = await loadSession(db, token, 'admin');
	if (!session) return null;
	const [admin] = await db
		.select({ id: adminUsers.id, email: adminUsers.email, name: adminUsers.name })
		.from(adminUsers)
		.where(eq(adminUsers.id, session.subjectId))
		.limit(1);
	return admin ?? null;
}

export async function getGuestSession(
	db: Db,
	token: string | undefined
): Promise<GuestSessionUser | null> {
	const session = await loadSession(db, token, 'guest');
	if (!session) return null;
	const [guest] = await db
		.select({ id: guestAccount.id, currentStayId: guestAccount.currentStayId })
		.from(guestAccount)
		.where(eq(guestAccount.id, session.subjectId))
		.limit(1);
	return guest ?? null;
}
