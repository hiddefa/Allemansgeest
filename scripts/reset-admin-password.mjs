#!/usr/bin/env node
// Wachtwoord vergeten (admin)? Draai dit ZELF in je eigen terminal:
//   npm run reset-admin-password
// Je nieuwe wachtwoord komt nergens in een gesprek met Claude terecht — dit script hasht
// het lokaal (dezelfde PBKDF2-SHA256, 100k iteraties, als src/lib/server/auth/password.ts)
// en zet het rechtstreeks in de productie-D1 via wrangler, met jouw eigen wrangler-login.
// Let op: je typt het nieuwe wachtwoord zichtbaar in deze terminal (geen masking) — dat
// is prima voor een lokale, eenmalige herstelactie, maar wis evt. de terminal-scrollback
// achteraf als je daar niet gerust op bent.
//
// Testen zonder de echte database te raken: voeg --dry-run toe.

import { randomBytes, pbkdf2Sync } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import readline from 'node:readline';

const ITERATIONS = 100_000; // moet gelijk blijven aan src/lib/server/auth/password.ts
const KEY_LENGTH_BYTES = 32;
const D1_DATABASE = 'allemansgeest-db';
const dryRun = process.argv.includes('--dry-run');

function hashPassword(password) {
	const salt = randomBytes(16);
	const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH_BYTES, 'sha256');
	return `${salt.toString('base64')}:${hash.toString('base64')}`;
}

function applyChange(email, passwordHash) {
	const sql = `UPDATE admin_users SET password_hash = '${passwordHash}' WHERE email = '${email.replace(/'/g, "''")}';`;

	if (dryRun) {
		console.log('\n--dry-run: onderstaand SQL-statement wordt NIET uitgevoerd.\n');
		console.log(sql);
		process.exit(0);
	}

	console.log(`\nWachtwoord voor ${email} wordt bijgewerkt in ${D1_DATABASE} (productie)...\n`);

	// SQL naar een tijdelijk bestand i.p.v. als --command-argument: spawnSync+shell:true met
	// een args-array mishandelt op Windows argumenten die spaties/quotes bevatten (de SQL
	// hierboven heeft beide) — dat gaf "You must provide either --command or --file". Een
	// bestandspad heeft dat probleem niet.
	const tmpDir = mkdtempSync(join(tmpdir(), 'ag-admin-reset-'));
	const sqlFile = join(tmpDir, 'reset.sql');
	writeFileSync(sqlFile, sql, 'utf8');

	let result;
	try {
		result = spawnSync(`npx wrangler d1 execute ${D1_DATABASE} --remote --file="${sqlFile}"`, {
			stdio: 'inherit',
			shell: true
		});
	} finally {
		rmSync(tmpDir, { recursive: true, force: true });
	}

	if (!result || result.status !== 0) {
		console.error(
			'\nAutomatisch uitvoeren is niet gelukt (zie foutmelding hierboven — vaak: eerst `npx wrangler login` nodig).'
		);
		console.error('Voer dit statement dan handmatig uit:\n');
		console.error(`  npx wrangler d1 execute ${D1_DATABASE} --remote --command "${sql.replace(/"/g, '\\"')}"`);
		process.exit(result?.status ?? 1);
	}

	console.log(`\nGelukt. Je kunt nu inloggen op /admin/login met e-mailadres ${email} en je nieuwe wachtwoord.`);
}

// Bewust geneste rl.question()-callbacks i.p.v. async/await: dat is het patroon dat
// betrouwbaar blijkt te werken op zowel een echte terminal als gepipete/non-TTY invoer
// (voor het testen van dit script) — een async/await-keten met tussenliggende awaits
// verloor hier af en toe de tweede/derde regel input.
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('E-mailadres van het admin-account (bv. hiddef@gmail.com): ', (rawEmail) => {
	const email = rawEmail.trim();
	if (!email) {
		console.error('E-mailadres mag niet leeg zijn.');
		rl.close();
		process.exit(1);
	}

	rl.question('Nieuw wachtwoord (min. 8 tekens, zichtbaar getypt): ', (password) => {
		if (password.length < 8) {
			console.error('Wachtwoord moet minstens 8 tekens zijn.');
			rl.close();
			process.exit(1);
		}

		rl.question('Herhaal nieuw wachtwoord: ', (confirm) => {
			rl.close();
			if (confirm !== password) {
				console.error('Wachtwoorden komen niet overeen — niets gewijzigd.');
				process.exit(1);
			}
			applyChange(email, hashPassword(password));
		});
	});
});
