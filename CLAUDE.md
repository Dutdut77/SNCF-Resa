# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Résa-Pro** — internal reservation app for SNCF Infrapôle Paris-Est (INFPE). Lets staff reserve meeting rooms (`salles`) and vehicles (`véhicules`) per geographic sector (`secteur`). UI strings, toasts, and comments are in French — keep that convention when adding new ones.

## Commands

```bash
npm run dev          # dev server, uses .env (points at remote Supabase)
npm run dev-local    # dev server, uses .env.local (local Supabase at 127.0.0.1:54321)
npm run build        # production build
npm run preview      # preview the production build
npm run generate     # static generation
```

There are no tests, lint, or typecheck scripts configured — `nuxt prepare` runs via `postinstall`.

## Stack

- **Nuxt 4** with the `app/` directory layout (not the legacy root layout). All pages, components, composables, layouts, and middleware live under [app/](app/).
- **Supabase** via `@nuxtjs/supabase`. `redirect: false` and `types: false` in [nuxt.config.ts](nuxt.config.ts) — auth redirection is handled manually in middleware, and there are no generated DB types.
- **Tailwind v4** via the `@tailwindcss/vite` plugin (no `tailwind.config.js`). Theme tokens (`--color-sncf-primary`, `--font-traverse`) are declared in [app/assets/css/main.css](app/assets/css/main.css) using the `@theme` directive.
- **Icons** via `@nuxt/icon` with the `material-symbols` iconify set.
- **Nodemailer** for outbound mail through a single Nitro server route — [server/api/sendEmail.post.js](server/api/sendEmail.post.js). Reads `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` from env. `secure` is `true` only on port 465.

Composables auto-import is widened to `composables/**` (see [nuxt.config.ts](nuxt.config.ts)) so nested files like [app/composables/app/formatDate.js](app/composables/app/formatDate.js) are also globally available — no explicit imports needed.

## Architecture

### Auth + routing model

- [app/middleware/auth.global.js](app/middleware/auth.global.js) runs on every navigation and is the single source of truth for access control:
  1. If `to.meta.requiresAuth` and no Supabase session → redirect to `/login` with the original URL as `?redirect=`.
  2. If a session exists, fetches the row from `profiles` keyed on the auth user id and stores it in the global `userProfil` `useState`. **Other code reads `userProfil` directly — do not refetch the profile elsewhere.**
  3. If `to.meta.isAdmin` and `profile.secteur_admin` is null → redirect to `/forbidden`.
  4. Visiting `/` redirects to `/calendrier/{favorite_secteur or first secteur}`.
- [app/middleware/secteurExist.js](app/middleware/secteurExist.js) is a *named* middleware (kebab-case `secteur-exist`) attached only to [app/pages/calendrier/[id].vue](app/pages/calendrier/[id].vue) via `definePageMeta({ middleware: "secteur-exist" })`. It validates that `:id` matches a real sector and bounces to the first sector if not.

Pages opt into protection via `definePageMeta({ requiresAuth, isAdmin })` — both flags are custom and only meaningful because the global middleware reads them.

### Domain model

Supabase tables observed in queries (no migrations are committed in [supabase/migrations/](supabase/migrations/), so the live schema is authoritative):

- `profiles` — extends `auth.users`. Key columns: `id`, `nom`, `prenom`, `email`, `favorite_secteur`, `secteur_admin` (single sector id — admin role), `secteur_auth` (**comma-separated string** of sector ids — validator/"valideur" role; manipulated as `split(',').map(Number)` in [app/composables/auth.js](app/composables/auth.js)).
- `secteurs` — geographic units; everything (rooms, vehicles, reservations) is scoped by `id_secteur`.
- `salles`, `vehicules` (with FK `id_carburant` → `carburant`).
- `resa_salles`, `resa_vehicules` — reservation rows. Time columns `debut`/`fin` are stored as **JS millisecond timestamps** (queries use `Date.now()`, `.gte('fin', now)`, etc.). The `is_validated` column is an integer flag where `1` means approved; pending requests are inserted with `is_validated: 0` and an admin/validator flips it.

Three roles, all derived from the `profiles` row:
1. **User** — anyone with a session; can request reservations.
2. **Valideur** — `secteur_auth` contains a sector id; can validate within those sectors.
3. **Admin** — `secteur_admin` is set; gets access to `/administration` and triggers the `isAdmin` middleware branch.

### Composables = data layer

Each composable in [app/composables/](app/composables/) wraps one Supabase table (or a related concern like email/toast/loader) and exposes:
- One or more `useState` refs (these are **shared across the app** because Nuxt's `useState` is keyed and global — e.g. `allResaSecteurSalle` is read by both the calendar page and admin pages).
- `getAll*`, `add*`, `update*`, `delete*` functions that mutate the same `useState` and call `addToast` from [app/composables/toast.js](app/composables/toast.js) for user feedback.

When adding a new screen, follow this pattern rather than calling `useSupabaseClient()` directly inside a component — keeps reservation/state mutations consistent and toast-aware.

### Email flows

[app/composables/email.js](app/composables/email.js) builds HTML through a single `buildTemplate({ headerColor, headerTitle, headerIcon, bodyContent })` helper and `POST`s to `/api/sendEmail`. Header colors are semantic: blue `#0369a1` for new requests, green `#16a34a` for validation, red `#dc2626` for refusal/cancellation, amber `#d97706` for modification. Reuse `buildTemplate` and `formatDates` rather than hand-rolling HTML for new mail types.

Supabase auth template overrides (signup confirmation, password recovery) live in [supabase/templates/](supabase/templates/) and are configured via [supabase/config.toml](supabase/config.toml).

## Conventions

- Use `app/` paths consistently (Nuxt 4 layout) — the root has no `pages/`, `components/`, etc.
- New routes go under [app/pages/](app/pages/) with `definePageMeta({ requiresAuth, isAdmin })` set explicitly when access control matters.
- Components are auto-prefixed by directory: files in [app/components/app/](app/components/app/) become `<App*>` and files in [app/components/resa/](app/components/resa/) become `<Resa*>`. The global toast and loader are mounted once in [app/app.vue](app/app.vue) — don't re-mount them per page.
- Tailwind class `text-sncf-primary` / `bg-sncf-primary` come from the `@theme` block, not a config file.
