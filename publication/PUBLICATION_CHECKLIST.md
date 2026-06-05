# Publication Checklist

## Status

- [x] Consolidated local repo prepared.
- [x] Peixin, Siyi, and Yujun source documents imported.
- [x] Shared modules drafted.
- [x] Static public homepage prepared.
- [x] `robots.txt` added.
- [x] `vercel.json` noindex header added.
- [x] Local git repo initialized and committed.
- [ ] Public GitHub repo created.
- [ ] Local repo pushed to GitHub.
- [x] Vercel Production deployment created.
- [x] Stable public URL verified.

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

- [x] `curl -I -L https://course-ops-automation-requirements.vercel.app/` returns `200 OK`.
- [x] Response header contains `X-Robots-Tag: noindex, nofollow, noarchive`.
- [x] HTML contains `<meta name="robots" content="noindex,nofollow,noarchive">`.
- [x] `/robots.txt` returns `User-agent: *` and `Disallow: /`.
- [x] Page includes Peixin, Siyi, and Yujun sections.

## Current Limitation

The GitHub connector available in this session can write to existing repositories but does not expose a create-repository action, and `gh` is not installed locally. Create the public GitHub repo `Kevin-Yeh-egroup/course-ops-automation-requirements` before pushing this local repo.
