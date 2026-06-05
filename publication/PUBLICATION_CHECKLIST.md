# Publication Checklist

## Status

- [x] Consolidated local repo prepared.
- [x] Peixin, Siyi, and Yujun source documents imported.
- [x] Shared modules drafted.
- [x] Static public homepage prepared.
- [x] `robots.txt` added.
- [x] `vercel.json` noindex header added.
- [ ] Public GitHub repo created.
- [ ] Local repo pushed to GitHub.
- [ ] Vercel Production deployment created.
- [ ] Stable public URL verified.

## Intended Profile

`public-with-noindex review`

This is link-accessible if deployed publicly. `noindex` is a search-indexing hint, not privacy protection.

## Approval Gates

Ask Kevin before:

- removing noindex;
- sending the URL externally;
- auto-writing Google Sheet, Calendar, InfoCenter, Line, or Email;
- deleting or archiving old repos;
- turning the workflow into a recurring automation.

## Verification

Before treating the public URL as done:

- `curl -I -L <url>` returns `200 OK`.
- Response header contains `X-Robots-Tag: noindex, nofollow, noarchive`.
- HTML contains `<meta name="robots" content="noindex,nofollow,noarchive">`.
- `/robots.txt` returns `User-agent: *` and `Disallow: /`.
- Page includes Peixin, Siyi, and Yujun sections.

