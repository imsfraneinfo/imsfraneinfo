# Imsfrane Admin setup

The admin UI is available at https://imsfrane.com/admin/ after deployment.

Important: GitHub requires OAuth authentication for Decap CMS. Do not put a GitHub personal access token or OAuth client secret in this repository.

Recommended setup options:
1. Decap Turbo hosted GitHub authentication (simplest; requires creating a Turbo site and then replacing the backend block in admin/config.yml with the provided turbo_site_id).
2. GitHub OAuth proxy (Netlify authentication or your own OAuth proxy), while keeping the GitHub backend.

Current backend is intentionally configured for GitHub and contains no secret. The admin interface files can be deployed safely, but login will not complete until authentication is configured.
