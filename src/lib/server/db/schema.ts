import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Enum-achtige kolommen gebruiken korte Engelse codes, nooit Nederlandse tekst,
// zodat een latere taalslag (P2-6) geen data-migratie vereist.

export const adminUsers = sqliteTable('admin_users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').notNull().unique(),
	name: text('name').notNull(),
	passwordHash: text('password_hash').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

// Singleton: er is precies één gedeeld gastaccount (P0-2). id is altijd 1.
export const guestAccount = sqliteTable('guest_account', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	passwordHash: text('password_hash').notNull(),
	currentStayId: integer('current_stay_id').references(() => stays.id),
	updatedByAdminId: integer('updated_by_admin_id').references(() => adminUsers.id),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// D1-backed sessies (niet KV): een admin-reset van het gastaccount moet
// bestaande gastsessies direct ongeldig maken, KV's eventual consistency is daar te traag voor.
export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(), // opaque random token
	type: text('type', { enum: ['admin', 'guest'] }).notNull(),
	subjectId: integer('subject_id').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

// Bezettingskalender (P0-3) — uitsluitend bereikbaar binnen admin-auth, zie hooks.server.ts + admin/(app)/+layout.server.ts.
export const stays = sqliteTable('stays', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	type: text('type', { enum: ['guest_stay', 'owner_use', 'maintenance_block', 'other'] }).notNull(),
	startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
	endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
	notes: text('notes'),
	createdByAdminId: integer('created_by_admin_id').references(() => adminUsers.id)
});

// Documentenkluis metadata (P0-4) — het bestand zelf staat in R2 onder r2Key.
export const documents = sqliteTable('documents', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	filename: text('filename').notNull(),
	r2Key: text('r2_key').notNull().unique(),
	sizeBytes: integer('size_bytes').notNull(),
	contentType: text('content_type').notNull(),
	uploadedByAdminId: integer('uploaded_by_admin_id').references(() => adminUsers.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

// Administratie (P0-5). Bedragen altijd in cents, nooit floats.
export const financeEntries = sqliteTable('finance_entries', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	type: text('type', { enum: ['income', 'expense'] }).notNull(),
	amountCents: integer('amount_cents').notNull(),
	description: text('description').notNull(),
	category: text('category'),
	entryDate: integer('entry_date', { mode: 'timestamp' }).notNull(),
	stayId: integer('stay_id').references(() => stays.id)
});

// Contactpersonen CRUD (P0-6).
export const contacts = sqliteTable('contacts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	role: text('role').notNull(),
	phone: text('phone'),
	email: text('email'),
	notes: text('notes')
});

// Notities CRUD, inline bewerken (P0-7).
export const notes = sqliteTable('notes', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	body: text('body').notNull(),
	createdByAdminId: integer('created_by_admin_id').references(() => adminUsers.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// Vaste checklist-template, geseed via migratie (P0-8).
export const checklistItems = sqliteTable('checklist_items', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	listType: text('list_type', { enum: ['checkin', 'checkout'] }).notNull(),
	label: text('label').notNull(),
	sortOrder: integer('sort_order').notNull(),
	active: integer('active', { mode: 'boolean' }).notNull().default(true)
});

// Per-verblijf voortgang op de checklist (P0-8) — blijft bewaard binnen hetzelfde verblijf.
export const checklistProgress = sqliteTable('checklist_progress', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	stayId: integer('stay_id')
		.notNull()
		.references(() => stays.id),
	checklistItemId: integer('checklist_item_id')
		.notNull()
		.references(() => checklistItems.id),
	checked: integer('checked', { mode: 'boolean' }).notNull().default(false),
	checkedAt: integer('checked_at', { mode: 'timestamp' })
});

// Huisregels/praktische info, admin-editable (P0-9).
export const houseRulesSections = sqliteTable('house_rules_sections', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	sectionKey: text('section_key').notNull().unique(),
	title: text('title').notNull(),
	bodyMarkdown: text('body_markdown').notNull(),
	sortOrder: integer('sort_order').notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// Storingscontact (P0-10). Singleton, id altijd 1.
export const emergencyContact = sqliteTable('emergency_contact', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	phone: text('phone').notNull(),
	note: text('note'),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// Meterstanden + handmatig ingevoerd bedrag (P0-11, D-07: geen tarief-berekening in de app).
// Gastscherm toont "nog niet compleet" zolang een van de eind-standen NULL is.
export const meterReadings = sqliteTable('meter_readings', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	stayId: integer('stay_id')
		.notNull()
		.unique()
		.references(() => stays.id),
	electricityStartKwh: integer('electricity_start_kwh'),
	electricityEndKwh: integer('electricity_end_kwh'),
	gasStartM3: integer('gas_start_m3'),
	gasEndM3: integer('gas_end_m3'),
	amountCents: integer('amount_cents'),
	amountEnteredAt: integer('amount_entered_at', { mode: 'timestamp' }),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// Publiek contactformulier (P0-13) — altijd opgeslagen, e-mail is best-effort (zie lib/server/email.ts).
export const contactFormSubmissions = sqliteTable('contact_form_submissions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email').notNull(),
	message: text('message').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	status: text('status', { enum: ['new', 'read'] }).notNull().default('new'),
	emailError: text('email_error')
});
