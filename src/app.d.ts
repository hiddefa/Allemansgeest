// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { AdminSessionUser, GuestSessionUser } from '$lib/server/auth/session';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			admin: AdminSessionUser | null;
			guest: GuestSessionUser | null;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				DB: D1Database;
				BUCKET: R2Bucket;
				RESEND_API_KEY?: string;
				CONTACT_TO_EMAIL?: string;
				CONTACT_FROM_EMAIL?: string;
			};
		}
	}
}

export {};
