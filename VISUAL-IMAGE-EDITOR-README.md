# Imsfrane Visual Image Editor — Guide

1. Open `https://imsfrane.com/image-editor.html` after publishing this ZIP.
2. Select a page, then click the highlighted image in the actual page preview.
3. Drag the image, or adjust horizontal/vertical position, zoom and cover/contain. Switch PC/Mobile for previews.
4. Click **Télécharger les réglages JSON**. This downloads e.g. `fr-blog.json`.
5. In CloudCannon, find **Réglage des images / Image controls**, open the matching `image-settings/fr-blog.json` file, and replace its contents with the downloaded JSON (source editor or upload/replace, depending on your CloudCannon interface). Save and publish.
6. The published site then loads the same JSON file via `js/image-controls.js`.

**Important:** The preview is live and visual, but this static GitHub Pages editor cannot directly write to CloudCannon or GitHub. Changes are locally saved in your browser until exported. Do not mistake preview changes for published changes.

**Scope:** Images already marked with `data-image-control` and listed in `image-settings/*.json`. Other CSS-only and future generated images require additional integration. The editor requires the site to be served via HTTP(S), not `file://`.
