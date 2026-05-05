# AI Agent Instructions for Help With Prison Visits External

This is a Ministry of Justice GOV.UK service providing public-facing assistance with the cost of prison visits.

## Quick Start

```bash
npm run setup              # Install & verify security
npm run css-build         # Build SASS (required once or after changes)
npm run start:dev         # Start dev server with .env
npm run test              # Run lint + unit tests
npm run test-e2e-ui       # Open Cypress UI for e2e tests
```

**Critical setup**: You need a `.env` file (ask team — not in Git). Also: Node 24.x, NPM 11.x required; APVS_EXT_APPLICATION_SECRET must be set.

## Architecture: Unique Validation Pattern

This codebase uses **fail-fast validation in domain classes** — not in routes. This is non-standard but intentional:

```javascript
// In domain class (e.g., app/services/domain/about-child.js)
class AboutChild {
  constructor(firstName, lastName, day, month, year, relationship) {
    this.firstName = firstName.replace(/>|<|&lt|&gt/g, '').trim()  // Sanitize
    this.dob = dateFormatter.build(day, month, year)
    this.isValid()  // Throws ValidationError immediately if invalid
  }
}

// In route handler (e.g., app/routes/apply/eligibility/claim/expenses.js)
try {
  new AboutChild(req.body.firstName, ...)  // Constructor validates & throws
  // Continue to next step
} catch (error) {
  if (error instanceof ValidationError) {
    return res.status(400).render('form', { errors: error.validationErrors })
  }
  throw error
}
```

**Key insight**: Errors are objects with shape `{ fieldName: [messageString] }`. Routes use `errorSummaryList` and `findError` Nunjucks filters to render GOV.UK error summaries.

**When modifying forms**, always:
1. Update the domain class constructor with sanitization + validation logic
2. Create/update the route handler to catch `ValidationError`
3. Re-render the form with error object on validation failure
4. Add unit tests in `test/unit/services/domain/`

## File Organization

| Pattern | Location | Example |
|---------|----------|---------|
| Routes (functions, not Router) | `app/routes/**/*.js` — paths nested by URL structure | `/expenses` → `app/routes/apply/eligibility/claim/expenses.js` |
| Domain validation classes | `app/services/domain/*.js` — CamelCase | `AboutChild` in `about-child.js` |
| Data queries | `app/services/data/*.js` — named `get-*`, `insert-*`, `submit-*` | `insert-new-claim.js`, `get-claim-summary.js` |
| Constants/enums | `app/constants/*-enum.js` — 40+ files, each with metadata | `benefits-enum.js`, `claim-type-enum.js` |
| Validators | `app/services/validators/*.js` — fluent API | `FieldValidator` chains `.isRequired().isLessThanLength(100)` |
| Tests | `test/unit/services/domain/test-*.test.js` | `test-about-child.test.js` |
| Views | `app/views/*.html` + nested in `app/views/apply/**` | Nunjucks templates with GOV.UK components |

**Data layer** uses Knex queries with promises. Check `app/services/data/` for patterns — always use `await` or `.then()` for async operations.

## Session & Navigation

- Session data stored in `req.session` (cookie-session middleware)
- Redirecting to `/start` automatically clears session via `SessionHandler.clearSession()`
- CSRF token regenerated on every request (csrf-csrf package)
- Reference IDs encrypted in URLs using AES + fixed salt (see `app/services/helpers/reference-number-*`)

## Security Patterns

- **CSRF**: Use `{% include "partials/csrf-hidden-input.html" %}` in all forms
- **HTML sanitization**: HTML middleware strips unsafe chars (e.g., `<>` replaced with empty string in domain classes)
- **CSP nonce**: Available in `res.locals.cspNonce` for inline scripts
- **File uploads**: Skip CSRF validation intentionally (special handling in route)
- **ClamAV**: Scans uploads for malware (requires `docker-compose up clamav` locally)

## Common Pitfalls

| Issue | Cause | Fix |
|-------|-------|-----|
| CSS not showing | SASS not compiled | Run `npm run css-build` before `npm run start:dev` |
| App crashes | Missing APVS_EXT_APPLICATION_SECRET | Generate 32-char random string in .env |
| File upload fails | ClamAV not running | `docker-compose up clamav` in separate terminal |
| CSRF token errors | Using form without `csrf-hidden-input.html` include | Always add partial to POST forms |
| Tests fail with DB error | Integration tests need test DB access | Requires Kubernetes port-forward (ask team) |
| ESLint fails | Modified without auto-fix | Run `npm run lint-fix` |

## Testing Patterns

- **Unit tests**: Jest in `test/unit/` → run with `npm run test-unit`
- **Integration tests**: Mocha in `test/integration/` → requires test DB
- **E2E tests**: Cypress in `test/cypress-e2e/` → run with `npm run test-e2e-ui`
- **Accessibility**: Pa11y — manual command with reference data (see README for details)

When adding new domain classes, always add corresponding unit test in `test/unit/services/domain/test-*.test.js`.

## Localization

The app supports Welsh (and English) via i18n module. Localization strings in `app/locales/en.json` and `app/locales/cy.json`.

When adding new strings, add to both files in consistent structure. Views reference strings as: `{{ t('key.nested.path') }}`.

## Critical Files to Understand

- [app/app.js](app/app.js#L1) — Full middleware stack, error handlers, security headers
- [app/routes/routes.js](app/routes/routes.js#L1) — Route mounting (deeply nested by URL path)
- [app/services/domain/about-child.js](app/services/domain/about-child.js#L1) — Example domain class with validation
- [app/services/validators/field-validator.js](app/services/validators/field-validator.js#L1) — Fluent validator API
- [test/unit/services/domain/test-about-child.test.js](test/unit/services/domain/test-about-child.test.js#L1) — Test template pattern

## Database

MS SQL database via Knex. Queries in `app/services/data/`. Environment: `KNEX_CONFIG=testing` for test DB.

## Key Dependencies

- **Express 5.x** — web framework
- **Nunjucks** — templating with GOV.UK Frontend v6.1
- **Knex** — query builder for MS SQL
- **cookie-session** — session storage
- **csrf-csrf** — CSRF protection (double-submit cookie)
- **i18n** — localization
- **Jest** + **Cypress** + **Mocha** — testing
- **Helmet** — security headers

## When Stuck

1. Check if there's an enum for the value (40+ in `app/constants/`) — likely already defined
2. Look at `test/unit/services/domain/` for test examples mirroring your use case
3. Search `app/routes/` for similar form patterns
4. Ask team about `.env` setup or database access issues

---

**Last updated**: April 2026
