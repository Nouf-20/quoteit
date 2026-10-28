# QuoteIt — Cloudflare deployment

The Laravel application is also deployed as a Cloudflare Worker (TypeScript) with a D1
database and Workers Static Assets. The UI, routes, validation messages and seed data
match the Laravel app; the original Laravel source is untouched.

- **Live URL:** https://quoteit.noufcode.workers.dev
- **Worker:** `quoteit`
- **D1 database:** `quoteit-db` (`7243cbec-b4ef-4479-b7fb-f730e5bbb94d`, region EEUR)
- **Secret:** `SESSION_SECRET` (HMAC key for session + flash cookies)

## Demo account

Demo credentials are provided separately by the project owner.

## Layout

```
cloudflare/
├── wrangler.jsonc        # Worker config (D1 binding DB, assets in ./public)
├── schema.sql            # D1 schema (users, quotes, quote_likes)
├── seed.sql              # Seed data exported from database/database.sqlite
├── src/index.ts          # Router, sessions, CSRF, D1 queries
├── src/templates.ts      # HTML port of the Blade views
├── public/               # Static assets (CSS build, robots.txt)
└── tools/gen_seed.mjs    # Regenerates seed.sql from the Laravel SQLite DB
```

## How it works

- Sessions are stateless: an HMAC-signed `quoteit_session` cookie holds `{uid, csrf, exp}`.
  Flash messages and validation errors live in a short-lived signed `quoteit_flash` cookie.
- Passwords use PBKDF2-SHA256 (10 000 iterations) because bcrypt is impractical on the
  Workers free plan; the seeded hashes were generated with the same format
  `pbkdf2$10000$<salt>$<hash>` (base64url).
- Every POST is protected by a per-session CSRF token; `_method=PUT|DELETE` is honoured
  the same way Laravel does it.
- Media queries, Tailwind classes and markup are copied from the Blade templates, so the
  design is identical.

## Commands

```sh
cd cloudflare

# Local development (uses .dev.vars for SESSION_SECRET)
npx wrangler dev

# Database
npx wrangler d1 execute quoteit-db --remote --file=./schema.sql --yes
npx wrangler d1 execute quoteit-db --remote --file=./seed.sql --yes

# Regenerate seed data from ../database/database.sqlite
node tools/gen_seed.mjs

# Secret + deploy
npx wrangler secret put SESSION_SECRET
npx wrangler deploy
```

## Routes

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/` | Quote list + composer (when logged in) |
| GET/POST | `/login` | Log in |
| GET/POST | `/signup` | Create account |
| POST | `/logout` | Log out |
| POST | `/quotes` | Publish a quote |
| GET | `/quotes/{id}/edit` | Owner only |
| PUT | `/quotes/{id}` | Owner only (via `_method`) |
| DELETE | `/quotes/{id}` | Owner only (via `_method`) |
| POST | `/quotes/{id}/like` | Toggle like |
