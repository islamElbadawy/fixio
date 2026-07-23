# Security & Architecture Review — Fixio

TL;DR
Rotate secrets, remove credentials from VCS, add config validation, secure refresh tokens in HttpOnly cookies, add helmet/rate-limiting, sanitize JSONB queries, and add object-level authorization checks.

## Summary of Findings

### [CRITICAL]
- Hardcoded / committed secrets in repository
	- `.env` contains secrets and should NOT be committed. Rotate all exposed secrets immediately and remove the file from VCS.
	- Root `mikro-orm.config.ts` contains default DB username/password (`openpg` / `openpgpwd`). Remove these defaults.
- Insecure fallback secrets in `src/config/app.config.ts` (dev defaults like `dev_secret` / `dev_refresh_secret`). Enforce required secrets in production and fail-fast if missing.

### [WARN]
- Refresh token transported in request body (JWT refresh strategy reads `refreshToken` from request body). This is prone to CSRF and replay risks.
- Unrestricted CORS and missing security middleware (`helmet`, rate-limiting). `main.ts` uses `app.enableCors()` without restrictions and exposes Swagger unconditionally.
- No rate limiting or brute-force protection on auth endpoints (`/auth/login`).
- Seeds and commented code contain plaintext credentials — remove or sanitize.
- JSONB `specs` query accepts arbitrary JSON from query string without whitelisting and lacks pagination/limits.
- Possible missing object-level authorization (BOLA): controllers enforce roles, but handlers must verify ownership/tenant checks.

### [INFO]
- Good: DTO validation via `class-validator` and global `ValidationPipe` with `whitelist` and `forbidNonWhitelisted` enabled.
- Good: Passwords and refresh tokens are hashed before storage (bcrypt).
- Use of MikroORM with parameterized queries and GIN index for JSONB is performant when used carefully.

## Remediation & Implementation Tasks (actionable)

1. [CRITICAL] Rotate and remove secrets from VCS
	 - Remove `.env` from repo and add to `.gitignore`.
	 - Commit a `.env.example` with placeholders only.
	 - Rotate JWT secrets and DB passwords used in the committed `.env` immediately.

2. [CRITICAL] Enforce runtime config validation
	 - Add Joi validation schema to `ConfigModule.forRoot` in `src/app.module.ts` and fail-fast for missing/weak secrets.
	 - Example validation snippet:

```ts
import * as Joi from 'joi';

ConfigModule.forRoot({
	isGlobal: true,
	load: [appConfig, dbConfig, jwtConfig],
	envFilePath: '.env',
	validationSchema: Joi.object({
		NODE_ENV: Joi.string().valid('development','production','test').default('development'),
		JWT_ACCESS_SECRET: Joi.string().min(32).required(),
		JWT_REFRESH_SECRET: Joi.string().min(32).required(),
		DB_HOST: Joi.string().required(),
		DB_PORT: Joi.number().required(),
		DB_USERNAME: Joi.string().required(),
		DB_PASSWORD: Joi.string().when('NODE_ENV', { is: 'production', then: Joi.string().min(8).required(), otherwise: Joi.string().allow('') }),
		FRONTEND_ORIGIN: Joi.string().uri().required(),
	}),
});
```

3. [CRITICAL] Remove hardcoded DB credentials
	 - Edit `mikro-orm.config.ts` (root) to use `process.env` only and throw when missing in production.

4. [WARN] Harden `main.ts` and environment-specific behavior
	 - Add `helmet`, restrict CORS to `FRONTEND_ORIGIN`, add `express-rate-limit`, enable secure cookies support, and only enable Swagger in non-production.

Example additions to `src/main.ts`:

```ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

if (process.env.NODE_ENV === 'production') {
	app.use(helmet());
	app.enableCors({ origin: process.env.FRONTEND_ORIGIN, credentials: true });
	app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
} else {
	app.enableCors();
}

if (process.env.NODE_ENV !== 'development') {
	// skip Swagger in production
} else {
	SwaggerModule.setup('api/docs', app, document);
}
```

5. [WARN] Move refresh tokens to secure cookies
	 - On login, set `refreshToken` as an HttpOnly, Secure, SameSite cookie and remove `refreshToken` from response bodies where possible.
	 - Update `JwtRefreshStrategy` to extract token from cookies rather than request body.

Cookie extractor example for the strategy:

```ts
const cookieExtractor = (req: Request) => req?.cookies?.refreshToken;

super({
	jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
	secretOrKey: config.get<string>('jwt.refreshSecret')!,
	passReqToCallback: true,
});
```

Set cookie in `AuthController`/`AuthService` after login:

```ts
res.cookie('refreshToken', tokens.refreshToken, {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'strict',
	maxAge: ms(refreshExpiresIn),
});
```

6. [WARN] Add brute-force protection
	 - Add IP-based and account-based rate limiting on `POST /auth/login`.
	 - Implement failed-attempt counters in DB or a fast cache (Redis) to temporarily lock accounts after N failed attempts.

7. [WARN] Sanitize JSONB `specs` queries and add pagination
	 - Whitelist allowed spec keys (e.g., `compatibility`, `brand`, `year`) and reject unexpected keys.
	 - Enforce a maximum payload size and add pagination params `limit` and `offset` with a safe max (e.g., 100).

Repository refactor example (`product-variant.repository.ts`):

```ts
async findBySpecs(filters: Record<string, unknown>, limit = 50, offset = 0) {
	const safeFilters = sanitizeFilters(filters, ['compatibility','brand','year']);
	const em = this.repo.getEntityManager();
	return await em
		.createQueryBuilder(ProductVariantEntity, 'v')
		.where({ isDeleted: false, isActive: true })
		.andWhere('v.specs @> ?::jsonb', [JSON.stringify(safeFilters)])
		.limit(Math.min(limit, 100))
		.offset(Math.max(0, offset))
		.getResultList();
}
```

8. [WARN] Enforce object-level authorization (BOLA)
	 - Ensure command and query handlers accept the current user context and validate access to the target entity before performing mutations or returning sensitive information.
	 - Example: when updating or deleting resources, check `entity.ownerId === currentUser.id` or that the role permits the operation for the target tenant.

9. [INFO] Seeds and plaintext passwords
	 - Remove or sanitize seeds with plaintext passwords. Use environment-only secrets or interactive seeding tools to create local accounts.

10. [INFO] Logging, error handling and monitoring
	 - Add a global exception filter that returns standardized error responses and hides stack traces in production.
	 - Integrate structured logging and an APM or error tracking service for runtime visibility.

## Concrete Quick-Fixes (copyable)

1) Fail-fast config validation (add to `src/app.module.ts` imports)

```ts
import * as Joi from 'joi';
// use the ConfigModule.forRoot snippet shown above
```

2) Secure cookies for refresh tokens (login flow)

- In `AuthController` after successful `login` call:

```ts
// pseudo-code
const tokens = await this.authService.login(dto);
res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV==='production', sameSite: 'strict', maxAge: computeMs(tokens.expiresIn) });
return { accessToken: tokens.accessToken, expiresIn: tokens.expiresIn };
```

3) Replace refresh-token-from-body extractor

- Update `JwtRefreshStrategy` to use cookie extractor (example above).

4) Add helmet + rate-limit + conditional Swagger in `src/main.ts` (example above).

## Verification Checklist
- [ ] `.env` removed from git history or rotated; `.env.example` added
- [ ] App fails to start in production if required secrets missing
- [ ] Swagger disabled in production
- [ ] Login sets HttpOnly refresh cookie; refresh endpoint reads cookie
- [ ] Rate-limiter active on auth endpoints
- [ ] `findBySpecs` enforces limit + whitelisted keys
- [ ] Command handlers validate object-level authorization

## Next steps (recommended order)
1. Remove committed secrets and rotate them immediately.
2. Add Joi-based `ConfigModule` validation and fail-fast behavior.
3. Harden `main.ts` (helmet, rate-limiting, restrict CORS) and disable Swagger in prod.
4. Convert refresh-token flow to secure cookies and update strategies/controllers.
5. Implement rate-limiting & account lockout for authentication.
6. Sanitize specs queries and enforce pagination.
7. Audit and patch command/query handlers for BOLA checks.

---

*Generated by repository scan on 2026-06-06.*
