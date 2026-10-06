# SharePoint -> Public Metrics Projection

## Verified source boundary

The corporate Microsoft 365 connection contains the private QSLC master SSOT in the authorized SharePoint workspace. That workbook remains a private authoritative source and is **not** a browser data source.

## Required flow

`Private SharePoint SSOT -> server-side sanitization/projection -> validated public JSON -> public UI`

The public application may read only the validated `PublicMetricsSnapshot` contract. It must never fetch a private workbook, Graph drive item, finance table, payroll record, evidence vault, or owner-only dataset directly.

## Allowed public fields

Root: `generatedAt`, `sourceStatus`, `freshness`, `synthetic`, `metrics`.

Metric: `id`, `label`, `value`, `unit`, `status`.

## Failure behavior

- Missing projection: show `unavailable`.
- Stale projection: label `stale`.
- Demo projection: label `synthetic`.
- Forbidden or malformed key: reject the projection.
- There is no private-data fallback in the public application.

## Retention wording

Seven-year immutable retention is not represented as verified by the public product until the backing Microsoft/retention configuration has independent evidence. Until then, retention is described as **configurable**.
