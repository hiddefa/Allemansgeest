// PBKDF2-SHA256 via Web Crypto SubtleCrypto — geen native bcrypt/argon2, die werken
// niet betrouwbaar op de Cloudflare Workers-runtime. 600k iteraties per OWASP-richtlijn.

const ITERATIONS = 600_000;
const KEY_LENGTH_BITS = 256;

function toBase64(bytes: Uint8Array): string {
	return btoa(String.fromCharCode(...bytes));
}

function fromBase64(value: string): Uint8Array {
	return Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
}

async function deriveHash(password: string, salt: Uint8Array): Promise<Uint8Array> {
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(password),
		'PBKDF2',
		false,
		['deriveBits']
	);
	const bits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', salt: salt as BufferSource, iterations: ITERATIONS, hash: 'SHA-256' },
		keyMaterial,
		KEY_LENGTH_BITS
	);
	return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const hash = await deriveHash(password, salt);
	return `${toBase64(salt)}:${toBase64(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
	const [saltB64, hashB64] = stored.split(':');
	if (!saltB64 || !hashB64) return false;
	const salt = fromBase64(saltB64);
	const expected = fromBase64(hashB64);
	const actual = await deriveHash(password, salt);
	if (actual.length !== expected.length) return false;
	// Constant-time vergelijking om timing-attacks te voorkomen.
	let diff = 0;
	for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
	return diff === 0;
}
