// Public reviews of this business only. Gateway verifies the project's anon JWT.
// Google credentials stay in Edge Function secrets, never in responses or logs.
const origins = new Set(['https://imsfrane.com', 'https://www.imsfrane.com', 'https://imsfraneinfo.github.io']);
const maps = 'https://www.google.com/maps/search/?api=1&query=Imsfrane&query_place_id=ChIJGfO-zLRxow0RFtfhVkfxEmU';
const endpoint = 'https://mybusiness.googleapis.com/v4/accounts/108058329181927164033/locations/16049053450311098356/reviews?pageSize=50&orderBy=updateTime%20desc';
const scores = {ONE:1, TWO:2, THREE:3, FOUR:4, FIVE:5};
let cached = null;
let expires = 0;
let pending = null;
let retryAfter = 0;
async function refresh() {
  const client_id = Deno.env.get('GOOGLE_REVIEWS_CLIENT_ID');
  const client_secret = Deno.env.get('GOOGLE_REVIEWS_CLIENT_SECRET');
  const refresh_token = Deno.env.get('GOOGLE_REVIEWS_REFRESH_TOKEN');
  if (!client_id || !client_secret || !refresh_token) throw new Error('NOT_CONFIGURED');
  if (!client_id.startsWith('589711942553-')) throw new Error('WRONG_PROJECT');
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method:'POST', signal:AbortSignal.timeout(8000),
    body:new URLSearchParams({client_id, client_secret, refresh_token, grant_type:'refresh_token'})
  });
  if (!tokenResponse.ok) {
    const failure = await tokenResponse.json().catch(() => ({}));
    const kind = {invalid_client:'GOOGLE_INVALID_CLIENT',invalid_grant:'GOOGLE_INVALID_GRANT',unauthorized_client:'GOOGLE_UNAUTHORIZED_CLIENT'}[failure.error];
    throw new Error(kind || 'GOOGLE_AUTH_FAILED');
  }
  const token = await tokenResponse.json();
  if (!token.access_token) throw new Error('GOOGLE_AUTH_FAILED');
  const response = await fetch(endpoint, {
    headers:{Authorization:'Bearer ' + token.access_token}, signal:AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error('GOOGLE_REVIEWS_UNAVAILABLE');
  const data = await response.json();
  if (!Number.isInteger(data.totalReviewCount)) throw new Error('INVALID_RESPONSE');
  // Only a bounded, temporary performance cache; no database or git snapshots.
  cached = {
    rating:data.averageRating, userRatingCount:data.totalReviewCount, googleMapsURI:maps,
    reviews:(data.reviews || []).slice(0,50).map(r => ({
      authorAttribution:{displayName:r.reviewer?.displayName || 'Google Maps'},
      rating:scores[r.starRating] || 0, text:r.comment || '',
      publishTime:r.createTime, googleMapsURI:maps
    }))
  };
  expires = Date.now() + 15 * 60 * 1000;
  return cached;
}
Deno.serve(async req => {
  const origin = req.headers.get('origin') || '';
  const headers = {'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store',
    'Vary':'Origin', 'Access-Control-Allow-Headers':'authorization, apikey, content-type',
    'Access-Control-Allow-Methods':'GET, OPTIONS'};
  if (origins.has(origin)) headers['Access-Control-Allow-Origin'] = origin;
  const json = (data, status=200) => new Response(JSON.stringify(data), {status, headers});
  if (origin && !origins.has(origin)) return json({error:'ORIGIN_NOT_ALLOWED'},403);
  if (req.method === 'OPTIONS') return new Response(null,{status:204,headers});
  if (req.method !== 'GET') return json({error:'METHOD_NOT_ALLOWED'},405);
  // No caller-controlled URLs, account IDs, locations or write operations.
  try {
    if (cached && Date.now() < expires) return json(cached);
    cached = null;
    if (Date.now() < retryAfter) return json({error:'TEMPORARILY_UNAVAILABLE'},503);
    if (!pending) pending = refresh().finally(() => {pending = null;});
    return json(await pending);
  } catch (error) {
    retryAfter = Date.now() + 30000;
    const code = ['GOOGLE_INVALID_CLIENT','GOOGLE_INVALID_GRANT','GOOGLE_UNAUTHORIZED_CLIENT','NOT_CONFIGURED','WRONG_PROJECT','GOOGLE_AUTH_FAILED','GOOGLE_REVIEWS_UNAVAILABLE','INVALID_RESPONSE'].includes(error.message) ? error.message : 'TEMPORARILY_UNAVAILABLE';
    return json({error:code},503);
  }
});
