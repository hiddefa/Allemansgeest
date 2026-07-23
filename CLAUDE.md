# Allemansgeest — codebase-gids

Codebase voor de Allemansgeest-webapp. Voor de never-do (bezettingskalender nooit bij
gasten/publiek) en projectcontext: zie `../CLAUDE.md` (project-root). Voor de volledige
productspecificatie: zie `../Docs_Allemansgeest/Allemansgeest App - Productspecificatie MVP.md`.
Dit bestand dupliceert die spec niet — alleen codebase-specifieke conventies.

## Stack

SvelteKit + `@sveltejs/adapter-cloudflare` + Drizzle ORM (D1) + R2 (Workers-binding).
Wachtwoorden: Web Crypto PBKDF2-SHA256 (`src/lib/server/auth/password.ts`), geen
native bcrypt/argon2 — die werken niet betrouwbaar op de Workers-runtime.

## Harde regel: route-guard-conventie

Elke admin-pagina hoort onder `src/routes/admin/(app)/**`, elke gast-pagina onder
`src/routes/gast/(app)/**`. De `(app)`-route-groep heeft één `+layout.server.ts` die
`requireAdmin()` / `requireGuest()` uit `src/lib/server/auth/guards.ts` aanroept —
dat dekt automatisch élke nieuwe pagina eronder, vóór render én vóór elke form-action-POST.

**Nieuwe admin-route toevoegen? Zet hem onder `admin/(app)/`, nooit los onder `admin/`.**
Alleen `admin/login` en `admin/setup` (eenmalige bootstrap) horen bewust buiten die groep.

Dit patroon is de technische handhaving van de never-do (bezettingskalender nooit bij
gasten/publiek, zie P0-3-acceptatiecriteria in de PRD). Test: `src/lib/server/auth/guards.test.ts`
— draai bij elke wijziging aan `hooks.server.ts` of een `(app)`-guard met `npm run test`.

## Harde regel: mobiel-responsive

Elk scherm/component moet werken op een telefoonbreedte (~360-390px), zonder horizontaal
scrollen en zonder dichtgeslibde content (bv. cijfers/labels die te smal worden om te lezen).
Zie `../CLAUDE.md` — Always-do. Concreet:

- **Geen vaste `width`/multi-kolom-grids zonder breakpoint.** Gebruik `max-width` i.p.v. `width`
  voor containers (zie `.ag-shell`, `.ag-hero-content`, `.ag-story`, etc. in `tokens.css` — die
  krimpen vanzelf mee). Een `grid-template-columns` met meer dan 1 kolom (bv. `.ag-stats-grid`,
  `.ag-form-grid-2`, `.ag-gallery-grid`) heeft altijd een `@media (max-width: …)`-override die
  terugvalt naar 1 (of minder) kolommen — zie die klassen in `tokens.css` als voorbeeld/patroon.
- **One-off inline `style="display:grid; grid-template-columns: …"` in een `+page.svelte` is
  een rode vlag** — voeg in plaats daarvan een herbruikbare klasse toe aan `tokens.css` mét
  breakpoint, zoals `.ag-stats-grid`/`.ag-form-grid-2`. Dat is ook al de bestaande conventie
  voor de landingspagina (`.ag-landing-*`-klassen i.p.v. inline styles).
- **Test na elke UI-wijziging** op 375px breedte (bv. via de browser-tool: `resize_window` naar
  `mobile`, dan een `javascript_tool`-check op `document.documentElement.scrollWidth > innerWidth`
  om horizontale overflow te detecteren — screenshot werkt niet altijd headless, deze JS-check
  wel). Voor auth-gated schermen (admin/gast): niet het echte account gebruiken om in te loggen
  als je de wachtwoorden niet weet — maak een tijdelijk testaccount/sessie via D1, test, en
  verwijder die daarna weer (zie sessie van 2026-07-23 in `../LOG.md` voor het patroon).
- Afbeeldingen die aan de app worden toegevoegd (bv. huisfoto's): altijd comprimeren/resizen
  voor gebruik (bv. via `sharp`, tijdelijk geïnstalleerd met `--no-save`) — ruwe telefoonfoto's
  van meerdere MB's horen niet in `static/`, dat botst met mobiel-eerst/wisselend bereik.

## Kernbestanden

| Bestand | Rol |
|---|---|
| `src/hooks.server.ts` | Enige plek die sessie-cookies leest → `locals.admin` / `locals.guest` |
| `src/lib/server/auth/guards.ts` | `requireAdmin()` / `requireGuest()`, unit-getest |
| `src/lib/server/auth/session.ts` | D1-backed sessies (niet KV, i.v.m. directe consistency bij gastaccount-reset) |
| `src/lib/server/db/schema.ts` | Drizzle-schema, alle tabellen |
| `src/lib/server/r2.ts` | Documentenkluis-bestanden |
| `src/lib/server/email.ts` | Contactformulier-notificatie via Resend (best-effort) |
| `src/lib/styles/tokens.css` | Kleurenpalet/componentklassen uit de klikbare mockup (`.ag-card`, `.ag-metric`, …) |

## Datamodel-conventie

Enum-achtige kolommen (`type`, `list_type`, `status`) gebruiken korte Engelse codes,
nooit Nederlandse tekst — zo blokkeert niets een latere taalslag (P2-6). Bedragen altijd
als `*_cents INTEGER`, nooit floats.

## Ontwikkelen

```
npm install
npm run dev              # lokale dev-server (Cloudflare-bindings via wrangler.toml)
npm run test              # guard-tests (P0-3-acceptatiecriteria)
npm run check              # svelte-check
npm run db:generate        # Drizzle-migratie genereren na schema-wijziging
npm run db:migrate:local   # migratie toepassen op lokale D1
npm run db:migrate:remote  # migratie toepassen op productie-D1
```

Eerste admin-account: draai de app, open `/admin/setup` (werkt alleen zolang er nog
geen enkel admin-account bestaat — daarna redirect naar `/admin/login`).

Seed-data (checklist-items, huisregels-secties, storingscontact-placeholder):
`wrangler d1 execute allemansgeest-db --local --file=./drizzle/seed.sql` (en `--remote`
voor productie na de eerste deploy).

## Setup-status (bijgewerkt bij elke sessie die dit verandert)

- Lokaal scaffold + schema + auth/guards + alle P0-schermen: klaar.
- GitHub (`hiddefa/Allemansgeest`) + Cloudflare Pages/D1/R2 + eerste deploy: zie
  `../TASKS.md` T-02 voor actuele status — kan na deze sessie nog open staan.
