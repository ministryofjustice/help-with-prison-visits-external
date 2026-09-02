# Agent Instructions

## Project Overview

This is the public-facing Express/Nunjucks service for Help with Prison Visits. It uses GOV.UK Frontend, MS SQL via Knex, i18n with English and Welsh locale files, and a multi-page eligibility/claim journey. Link to [README.md](README.md) for local setup, database notes, Docker Compose, security notes, and accessibility test usage.

## Commands

- Install and prepare hooks: `npm run setup`
- Build assets/application: `npm run build`
- Compile Sass only: `npm run css-build`
- Run locally with `.env`: `npm run start:dev`
- Start production-style process: `npm start`
- Lint: `npm run lint`; auto-fix with `npm run lint-fix`
- Unit test only: `npm run test-unit`
- Standard local test check: `npm run test` (lint plus unit tests)
- CI unit coverage: `npm run test:ci`
- Integration tests: `npm run test-integration`
- Cypress e2e: run the app first, then `npm run test-e2e` or `npm run test-e2e-ui`

Use Node `^24` and npm `^11` as declared in [package.json](package.json). Prefer the narrowest relevant command before running the full suite.

## Architecture Map

- [app/app.js](app/app.js) wires Express middleware, security headers, i18n, CSRF, static assets, views, and routes.
- [app/routes/routes.js](app/routes/routes.js) registers all route modules. Add journey pages there after creating a route module.
- [app/routes/apply](app/routes/apply) contains the first-time eligibility and claim flow; [app/routes/your-claims](app/routes/your-claims) contains existing-claim journeys.
- [app/services/domain](app/services/domain) holds business/domain validation objects that throw `ValidationError` when invalid.
- [app/services/data](app/services/data) contains Knex-backed persistence code. Keep database access in this layer.
- [app/services/validators](app/services/validators) contains reusable field and URL validation chains.
- [app/services/helpers](app/services/helpers) contains cross-cutting helpers such as reference encryption/decryption.
- [app/constants](app/constants) contains enum-style values used across routing, display, and persistence.
- [app/views](app/views) contains Nunjucks views and GOV.UK component macros; [app/locales](app/locales) contains `en.json` and `cy.json` translations.

## Implementation Conventions

- Follow the existing StandardJS/HMPPS ESLint style: no semicolons, CommonJS modules, and minimal formatting churn.
- For new pages, keep route orchestration in route modules, validation in validators/domain services, data access in data services, and view rendering in Nunjucks templates.
- Use existing GOV.UK Frontend macros and filters instead of hand-building equivalent HTML. Match nearby templates for `errorSummaryList`, `findError`, and inline error display patterns.
- Maintain Welsh support. When adding or changing user-facing text, update both locale files in [app/locales](app/locales) unless the surrounding pattern proves otherwise.
- Add hidden CSRF inputs to forms with `{% include "partials/csrf-hidden-input.html" %}`. Multipart upload routes handle CSRF differently, so check the existing upload route before changing that flow.
- Encrypt references and reference IDs before putting them in URLs, and decrypt them before querying. Reuse the helpers in [app/routes/helpers](app/routes/helpers) and [app/services/helpers](app/services/helpers).
- Keep upload constraints aligned with [app/services/upload.js](app/services/upload.js) and malware scanning behavior in [app/services/clam-av.js](app/services/clam-av.js).

## Environment And Config

- Environment variables and defaults live in [config.js](config.js); database profiles live in [knexfile.js](knexfile.js).
- Local development expects a `.env` consumed by Node's `--env-file=.env`; the README says to get real values from the Visits dev team.
- `APVS_EXT_APPLICATION_SECRET` has no safe default and must be supplied.
- Local file scanning can use Docker Compose ClamAV: `docker-compose up clamav`.
- Helm deployment notes are in [helm_deploy/README.md](helm_deploy/README.md); link there instead of copying chart/deploy instructions.

## Testing Guidance

- Unit tests live under [test/unit](test/unit) and use Jest. Mirror nearby test names and invalid-input patterns when changing validators or domain objects.
- Integration tests live under [test/integration](test/integration) and use `KNEX_CONFIG=testing`.
- Cypress e2e tests live under [test/cypress-e2e](test/cypress-e2e) with config in [cypress.config.js](cypress.config.js).
- Jest reporters and output paths are configured in [jest.config.mjs](jest.config.mjs). Do not edit generated files under `test_results/` for source changes.
