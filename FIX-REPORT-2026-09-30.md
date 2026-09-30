# Imsfrane.com — Fix report (2026-09-30)

## Applied fixes
- Social sharing metadata verified on all 38 FR/EN pages.
- Added dedicated 1200x630 JPEG social-preview images in `images/social/` for broader crawler compatibility.
- Added `og:image:secure_url`, `og:image:type`, `og:image:width`, `og:image:height`, `og:image:alt` and `twitter:image:alt`.
- Kept page-specific title, description, URL and image for each page.
- Added Open Graph/Twitter metadata to the root `/` page.
- Removed duplicate AdSense loader from every FR/EN page (one loader remains per page).
- Removed the conflicting root `meta refresh`; language redirect now has one JavaScript path plus visible fallback links.
- Normalized the Google Place ID typo (`O` vs `0`) to the ID already used by the site's structured data.
- Existing reduced-motion accessibility CSS was verified, so no duplicate rule was added.

## Validation
- 39 HTML entry pages audited (root + 38 FR/EN pages).
- Required title/description/Open Graph/Twitter metadata: no missing entries.
- Internal HTML/image/CSS/JS references: no missing local targets found.
- Remaining duplicate AdSense loaders: none (38 loaders for 38 FR/EN pages).

## Intentionally not changed
- Current visual design and page content.
- Existing prices, booking logic and Google review rating/count.
- Legacy CSS/JS/source helper files were not deleted automatically because deletion should only happen after confirming they are not part of the author's development workflow.
