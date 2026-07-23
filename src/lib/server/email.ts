type ContactMessage = { name: string; email: string; message: string };

// Resend via kale fetch() — geen Node-SDK-afhankelijkheden die problemen geven op de
// Workers-runtime. Best-effort: bij falen slaat de caller de submission alsnog op in
// D1 (contact_form_submissions) zodat er niets verloren gaat (zie routes/+page.server.ts).
export async function sendContactNotification(
	env: { RESEND_API_KEY?: string; CONTACT_TO_EMAIL?: string; CONTACT_FROM_EMAIL?: string },
	msg: ContactMessage
): Promise<void> {
	if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
		throw new Error('E-mail is nog niet geconfigureerd (RESEND_API_KEY/CONTACT_TO_EMAIL/CONTACT_FROM_EMAIL ontbreken).');
	}

	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from: env.CONTACT_FROM_EMAIL,
			to: env.CONTACT_TO_EMAIL,
			reply_to: msg.email,
			subject: `Nieuw contactformulier-bericht van ${msg.name}`,
			text: `Van: ${msg.name} <${msg.email}>\n\n${msg.message}`
		})
	});

	if (!res.ok) {
		throw new Error(`Resend gaf status ${res.status}`);
	}
}
