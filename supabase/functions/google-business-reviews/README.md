# Google business reviews

Deploy with JWT verification enabled. The public site uses the existing project's legacy anon JWT only for gateway compatibility; this is a public read-only feed, not an authenticated member endpoint. It exposes one fixed business and cannot accept arbitrary Google URLs or perform writes. Google tokens never reach the browser. No member tables are accessed.

In Supabase > Edge Functions > Secrets set:
- GOOGLE_REVIEWS_CLIENT_ID (approved Google project 589711942553)
- GOOGLE_REVIEWS_CLIENT_SECRET
- GOOGLE_REVIEWS_REFRESH_TOKEN (business.manage scope, same OAuth client)

Never commit credentials or review snapshots. Function response caches in memory for at most 15 minutes per active instance; failures retry after 30 seconds. Only the latest 50 reviews are fetched, with no rating filter. Existing Google Maps summary/link is the fallback while not configured. CORS limits browser reads to the official site and existing demo origin; it is not authentication or global rate limiting.

For continuous operation, resolve Google OAuth Testing mode before production: external apps in Testing issue refresh tokens that normally expire after 7 days for this scope. Follow Google's publishing/verification requirements, then authorize again and replace the refresh token. Do not assume the Playground test token is permanent.

After adding secrets: confirm HTTP 200, correct average/count and real texts, then verify carousel controls on /fr/, /en/, /ar/, /es/. No real-credential end-to-end test is possible before secret setup.
