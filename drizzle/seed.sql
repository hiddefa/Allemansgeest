-- Startdata voor de MVP. Draaien met:
--   wrangler d1 execute allemansgeest-db --local --file=./drizzle/seed.sql
--   wrangler d1 execute allemansgeest-db --remote --file=./drizzle/seed.sql
-- Idempotent: gebruikt INSERT OR IGNORE / section_key-unique zodat opnieuw draaien geen duplicaten geeft.
-- Het eerste admin-account maak je NIET hier aan, maar via /admin/setup (eenmalige bootstrap-route).

INSERT OR IGNORE INTO checklist_items (id, list_type, label, sort_order, active) VALUES
	(1, 'checkin', 'Sleutel uit de sleutelkluis gehaald', 1, 1),
	(2, 'checkin', 'Meterstanden (stroom + gas) genoteerd bij aankomst', 2, 1),
	(3, 'checkin', 'Huisregels doorgenomen', 3, 1),
	(4, 'checkin', 'Wifi-code getest', 4, 1),
	(5, 'checkout', 'Huis opgeruimd en afval gescheiden', 1, 1),
	(6, 'checkout', 'Meterstanden (stroom + gas) genoteerd bij vertrek', 2, 1),
	(7, 'checkout', 'Ramen en deuren gesloten', 3, 1),
	(8, 'checkout', 'Sleutel terug in de sleutelkluis', 4, 1);

INSERT OR IGNORE INTO house_rules_sections (id, section_key, title, body_markdown, sort_order, updated_at) VALUES
	(1, 'wifi', 'Wifi', 'Netwerknaam en wachtwoord: vraag Hidde/Flo — nog in te vullen.', 1, unixepoch()),
	(2, 'thermostaat', 'Thermostaat', 'Instructies voor de verwarming — nog in te vullen.', 2, unixepoch()),
	(3, 'afval', 'Afvalscheiding', 'Waar welke afvalbak staat en ophaaldagen — nog in te vullen.', 3, unixepoch()),
	(4, 'voorzieningen', 'Voorzieningen in de buurt', 'Dichtstbijzijnde supermarkt, huisarts en EHBO — nog in te vullen.', 4, unixepoch());

INSERT OR IGNORE INTO emergency_contact (id, name, phone, note, updated_at) VALUES
	(1, 'Hidde & Florentine', 'nog in te vullen', 'Bel dit nummer bij een storing of noodgeval.', unixepoch());
