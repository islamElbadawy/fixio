Catalog Module — Review & Implemented Fixes

Date: 2026-05-30

Summary

This change set implements recommendations from a code review of the `catalog` module and surrounding infrastructure. The goal was to harden inputs, remove duplicate files, improve typing for JWT usage, and avoid unsafe query string interpolation.

Files changed

- src/modules/identity/presentaion/auth.controller.ts — removed (duplicate typo folder)
- src/modules/catalog/presentation/product-variant.controller.ts — added JSON parse error handling for `filters` query param (returns 400 Bad Request for invalid JSON).
- src/modules/catalog/infrastructure/repositories/product-variant.repository.ts — parameterized JSONB `@>` query to avoid raw string interpolation.
- src/modules/identity/application/commands/auth.service.ts — introduced a typed `AuthPayload` and `SignOptions` for `jwtService.signAsync` calls to reduce `any` usage.
- src/main.ts — removed duplicate commented import and fixed console log URL path to match `app.setGlobalPrefix('api')`.

Why these changes

- Prevent runtime 500 errors when clients send invalid JSON in query params and provide clearer 400 responses.
- Avoid SQL injection-like risks from string-interpolated JSON queries by using parameter binding.
- Improve code maintainability and type safety when generating JWTs.
- Remove duplicate/misspelled files that cause confusion (`presentaion`).
- Keep runtime diagnostics accurate.

Notes & Next steps

- Consider stricter typings for repository `create()` methods and seed generation patterns to match MikroORM `RequiredEntityData` where appropriate.
- Improve unit tests around `getVariantsBySpecs` and JWT flows.
- Replace `MikroORM.init(config as any)` with properly typed config where feasible.

If you want, I can also:
- convert the JSONB query to use the QueryBuilder's parameterized JSON handling more idiomatically, or
- add tests covering `ProductVariantController` and `ProductVariantRepository`.
