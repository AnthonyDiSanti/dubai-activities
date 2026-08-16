# Minisite production deployment

Consult this note before publishing or rolling back the guide. Canonical application and cache requirements remain in `docs/architecture.md`; this file records operator-specific behavior that is easy to miss.

## Target

- Site: `https://dubai.anthonydisanti.com/`
- AWS profile/region: `personal` / `us-east-1`
- Stack: `minisite-dubai-anthonydisanti-com-36364597`
- Bucket: `minisite-dubai-anthonydisanti-com-36364-sitebucket-uydjwsn8kgq4`
- CloudFront: `EU943ZSJ1FOAO`

## Release sequence

1. Run `npm run check`, `npm run audit:photos`, and `npm run audit:attributions`; do not deploy a hand-edited `dist/`.
2. Because S3 versioning is off, sync the current bucket into a fresh temporary directory with the `personal` profile and retain it through live verification.
3. Run `minisite deploy --dry-run --profile personal dubai.anthonydisanti.com ./dist`. Review every planned deletion.
4. Run the same command without `--dry-run` while keeping `dist/` unchanged.
5. Wait for the returned invalidation ID against distribution `EU943ZSJ1FOAO`.
6. Compare the live root document byte-for-byte with `dist/index.html`, inspect MIME/cache headers, and smoke-test one chapter and one activity fragment.

## Gotchas

- The default AWS login session may expire while the static `personal` profile remains valid. Use the explicit profile rather than starting a needless interactive login.
- Minisite v0.1 uploads concurrently, deletes stale objects, then requests `/*`; the release is not atomic and the bucket has no native rollback.
- A real deploy can remain quiet for more than a minute after printing the AWS account. When the command runner yields a session ID, keep polling that same session until it returns an exit code; partial output is not completion, and retrying early can create redundant idempotent uploads and invalidations.
- Every object currently receives `public, max-age=0, must-revalidate, s-maxage=86400`. The architecture's immutable fingerprinted assets and shorter document cache are desired future behavior, not current behavior.
- Minisite deletes old fingerprinted bundles before the invalidation has propagated. The pre-release bucket snapshot is the practical rollback source until the deployer gains atomic release support.
- Never reuse a recorded rollback directory without checking its object count against current production; take a fresh snapshot before every release because an older directory may represent an earlier deployment.
- Public deployment does not establish third-party reuse permission. The project deliberately treats permission as non-blocking for this private guide, while `docs/photo-attributions.csv` and the deployed footer credits remain mandatory standards.
