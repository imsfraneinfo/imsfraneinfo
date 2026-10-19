/* Imsfrane: live business reviews via a server-side credential boundary; Maps fallback.
 * Browser API key is injected on build via the GOOGLE_MAPS_BROWSER_KEY action secret.
 * Maps JS API keys are visible to browsers and MUST be HTTP-referrer and API restricted.
 */
(function () {
  "use strict";
  const section = document.querySelector(".hp-google-reviews[data-google-place-id]");
  if (!section) return;
  const lang = (document.documentElement.lang || "fr").slice(0, 2).toLowerCase();
  const words = {
    fr: {reviews:"avis sur Google", fallback:"Consulter les avis sur Google", source:"Avis Google Maps", stars:"étoiles sur 5"},
    en: {reviews:"Google reviews",fallback:"See reviews on Google",source:"Google Maps reviews",stars:"stars out of 5"},
    ar: {reviews:"تقييماً على Google",fallback:"شاهد التقييمات على Google",source:"تقييمات Google Maps",stars:"نجوم من 5"},
    es: {reviews:"reseñas de Google",fallback:"Ver reseñas en Google",source:"Reseñas de Google Maps",stars:"estrellas de 5"}
  };
  const tx = words[lang] || words.fr;
  const ratingNode = section.querySelector(".hp-google-rating-number");
  const starsNode = section.querySelector(".hp-google-stars");
  const countNode = section.querySelector(".hp-review-count");
  const reviewList = section.querySelector(".hp-live-review-list");
  const key = (window.IMSFRANE_GOOGLE_MAPS_KEY || "").trim();
  const placeId = section.getAttribute("data-google-place-id");
  if (countNode) countNode.textContent = tx.fallback;
  // Troubleshooting visible only when opened with ?reviews-debug=1. Never reveal key.
  const debug = new URLSearchParams(location.search).has("reviews-debug");
  let debugNode;
  function diagnostic(message) {
    if (!debug) return;
    if (!debugNode) {
      debugNode = document.createElement("p");
      debugNode.className = "hp-reviews-debug";
      debugNode.setAttribute("role", "status");
      debugNode.style.cssText = "grid-column:1/-1;font:600 12px/1.6 sans-serif;color:#325341;padding:10px 13px;border:1px solid #cddfd0;border-radius:8px;background:#f5faf5;margin:0";
      (section.querySelector(".hp-reviews-inner") || section).appendChild(debugNode);
    }
    debugNode.textContent = "Google Reviews Diagnostic: " + message;
  }
  function errorCode(error) {
    const e = String((error && error.message) || error || "");
    if (/BillingNotEnabled|billing/i.test(e)) return "BILLING_NOT_ENABLED";
    if (/RefererNotAllowed|referrer|referer/i.test(e)) return "WEBSITE_RESTRICTION";
    if (/ApiTargetBlocked|not.*allowed|api.?restriction/i.test(e)) return "API_KEY_RESTRICTION";
    if (/ApiNotActivated|not.?enabled/i.test(e)) return "API_NOT_ENABLED";
    if (/InvalidKey|ExpiredKey|invalid.?api.?key/i.test(e)) return "INVALID_API_KEY";
    if (/quota|RESOURCE_EXHAUSTED|OVER_QUERY_LIMIT/i.test(e)) return "QUOTA_EXCEEDED";
    return "GOOGLE_PLACE_REQUEST_FAILED";
  }

  function safeUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.href : null;
    } catch (e) { return null; }
  }
  function link(text, href, className) {
    const a = document.createElement("a");
    a.textContent = text;
    if (className) a.className = className;
    a.href = safeUrl(href) || section.querySelector(".hp-google-link").href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }
  function node(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = String(text);
    return el;
  }
  function carousel(cards) {
    const labels = {
      fr: {previous:"Avis précédent",next:"Avis suivant",pause:"Mettre en pause",play:"Reprendre le défilement",name:"Avis des visiteurs"},
      en: {previous:"Previous review",next:"Next review",pause:"Pause reviews",play:"Resume reviews",name:"Visitor reviews"},
      ar: {previous:"التقييم السابق",next:"التقييم التالي",pause:"إيقاف التمرير",play:"استئناف التمرير",name:"تقييمات الزوار"},
      es: {previous:"Reseña anterior",next:"Reseña siguiente",pause:"Pausar reseñas",play:"Reanudar reseñas",name:"Reseñas de visitantes"}
    }[lang] || {previous:"Previous review",next:"Next review",pause:"Pause reviews",play:"Resume reviews",name:"Visitor reviews"};
    const style = node("style");
    style.textContent = `.hp-home .hp-reviews-inner.hp-reviews-unified{grid-template-columns:61px 215px minmax(0,1fr);gap:6px 22px;padding:14px 0;align-items:center}
.hp-home .hp-reviews-unified .hp-google-mark{grid-column:1;grid-row:1;width:61px;height:61px}
.hp-home .hp-reviews-unified .hp-google-rating{grid-column:2;grid-row:1}
.hp-home .hp-reviews-unified .hp-google-copy{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);padding:0;border:0}
.hp-home .hp-reviews-unified .hp-google-link{grid-column:1/3;grid-row:2;justify-self:start;margin:0;background:transparent;color:#23553d!important;padding:0;min-height:44px;font-size:12px;white-space:normal;text-align:start}
.hp-home .hp-reviews-unified .hp-live-review-list.hp-review-carousel{display:block!important;grid-column:3;grid-row:1/3;width:100%;min-width:0;min-height:0;margin:0;padding:0 0 0 28px;border-inline-start:1px solid #e5eadd;box-sizing:border-box}
.hp-review-track{display:grid;align-items:start}
.hp-home .hp-review-track>.hp-live-review-card{grid-area:1/1;visibility:hidden;pointer-events:none;min-width:0;height:104px;box-sizing:border-box;padding:0;border:0;background:transparent;border-radius:0;box-shadow:none;overflow:hidden}
.hp-home .hp-review-track>.hp-live-review-card.is-current{visibility:visible;pointer-events:auto}
.hp-home .hp-review-carousel .hp-live-review-header{align-items:center;gap:4px 12px}
.hp-home .hp-review-carousel .hp-live-review-author{font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:75%}
.hp-home .hp-review-carousel .hp-live-review-text{font-size:14px;line-height:1.65;-webkit-line-clamp:2;margin:0;color:#405e4e}
.hp-home .hp-review-carousel .hp-live-review-stars{color:#956b12;font-size:14px;line-height:1.4;margin:6px 0}
.hp-home .hp-review-carousel .hp-live-review-credit{display:none}
.hp-review-controls{display:flex;justify-content:flex-end;align-items:center;gap:4px;margin-top:0;direction:ltr}
.hp-review-controls button{display:inline-grid;place-items:center;min-width:44px;height:44px;border:0;border-radius:50%;background:transparent;color:#214d37;font:500 24px/1 Arial,sans-serif;cursor:pointer}
.hp-review-controls button:hover{background:#f1f5ed}.hp-review-controls button:focus-visible{outline:2px solid #9e832b;outline-offset:1px}
.hp-review-controls .hp-review-pause{font-size:12px}.hp-review-counter{min-width:42px;text-align:center;color:#637768;font:600 11px/1.5 Arial,sans-serif;font-variant-numeric:tabular-nums}
html[lang="ar"] .hp-home .hp-reviews-unified .hp-live-review-list{padding:0 28px 0 0}
@media(max-width:760px){.hp-home .hp-reviews-inner.hp-reviews-unified{grid-template-columns:52px minmax(0,1fr);gap:10px;padding:14px 0}
.hp-home .hp-reviews-unified .hp-google-mark{width:52px;height:52px}
.hp-home .hp-reviews-unified .hp-live-review-list.hp-review-carousel{grid-column:1/-1;grid-row:2;padding:10px 0 0;border-inline-start:0;border-top:1px solid #e5eadd}
.hp-home .hp-reviews-unified .hp-google-link{grid-column:1/-1;grid-row:3;justify-self:start;max-width:calc(100% - 180px);font-size:11px;margin-top:-54px;z-index:1;line-height:1.5;gap:6px}
.hp-home .hp-review-carousel .hp-live-review-text{font-size:13px}
.hp-home .hp-review-track>.hp-live-review-card{height:100px}
.hp-review-controls{gap:0}}
@media(max-width:370px){.hp-home .hp-reviews-unified .hp-google-link{max-width:calc(100% - 170px);font-size:10px}.hp-review-counter{min-width:32px}}
`;
    style.textContent += `.hp-home .hp-google-reviews + .hp-activities{padding-top:14px}
.hp-home .hp-google-reviews + .hp-activities .hp-section-row{margin-bottom:20px}
.hp-home .hp-google-reviews + .hp-activities .hp-heading h2{margin-top:4px;margin-bottom:8px}
.hp-home .hp-review-carousel .hp-live-review-author{font-weight:800}
.hp-home .hp-review-carousel .hp-live-review-stars{letter-spacing:2px}
.hp-home .hp-review-carousel .hp-review-controls{border-top:1px solid #edf0e9}
@media(max-width:760px){.hp-home .hp-google-reviews + .hp-activities{padding-top:10px}.hp-home .hp-google-reviews + .hp-activities .hp-section-row{margin-bottom:16px}}`;
    document.head.appendChild(style);
    const inner = section.querySelector(".hp-reviews-inner");
    if (inner) {
      inner.classList.add("hp-reviews-unified");
      inner.appendChild(reviewList);
    }
    reviewList.classList.add("hp-review-carousel");
    reviewList.setAttribute("role", "region");
    reviewList.setAttribute("aria-roledescription", "carousel");
    reviewList.setAttribute("aria-label", labels.name);
    const track = node("div", "hp-review-track");
    track.setAttribute("aria-live", "off");
    track.append(...cards);
    reviewList.replaceChildren(track);
    let index = 0, timer = null, paused = false, hovering = false, focused = false, inView = true;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const controls = node("div", "hp-review-controls");
    const previous = node("button", "", "‹"), next = node("button", "", "›");
    const pause = node("button", "hp-review-pause", "Ⅱ");
    const counter = node("span", "hp-review-counter");
    for (const b of [previous,next,pause]) b.type = "button";
    previous.setAttribute("aria-label", labels.previous);
    next.setAttribute("aria-label", labels.next);
    function select(n) {
      index = (n + cards.length) % cards.length;
      cards.forEach((card,i) => {
        const active = i === index;
        card.classList.toggle("is-current", active);
        card.setAttribute("aria-hidden", String(!active));
        card.inert = !active;
      });
      counter.textContent = (index + 1) + " / " + cards.length;
    }
    function schedule() {
      clearInterval(timer); timer = null;
      pause.textContent = paused ? "▶" : "Ⅱ";
      pause.setAttribute("aria-label", paused ? labels.play : labels.pause);
      if(cards.length > 1 && !paused && !hovering && !focused && inView && !document.hidden && !motion.matches)
        timer = setInterval(() => select(index + 1), 7000);
    }
    previous.addEventListener("click", () => {select(index - 1);schedule()});
    next.addEventListener("click", () => {select(index + 1);schedule()});
    pause.addEventListener("click", () => {paused = !paused;schedule()});
    controls.append(previous,counter,next,pause);
    if(cards.length > 1) reviewList.appendChild(controls);
    reviewList.addEventListener("mouseenter", () => {hovering = true;schedule()});
    reviewList.addEventListener("mouseleave", () => {hovering = false;schedule()});
    reviewList.addEventListener("focusin", () => {focused = true;schedule()});
    reviewList.addEventListener("focusout", e => {if(!reviewList.contains(e.relatedTarget)){focused = false;schedule()}});
    document.addEventListener("visibilitychange", schedule);
    if(motion.addEventListener) motion.addEventListener("change", schedule);
    if("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {inView = entries[0].isIntersecting;schedule()}, {threshold:0.1});
      observer.observe(reviewList);
    }
    select(0); schedule();
  }
  function show(place) {
    diagnostic("SUCCESS: Google returned rating and reviews.");
    const rating = Number(place.rating);
    const count = Number(place.userRatingCount);
    const maps = safeUrl(place.googleMapsURI);
    if (maps) {
      section.querySelectorAll(".hp-google-link,.hp-reviews > a").forEach(a => a.href = maps);
    }
    if (Number.isFinite(rating) && rating > 0 && rating <= 5 && ratingNode && starsNode) {
      ratingNode.replaceChildren(document.createTextNode(
        rating.toLocaleString(lang === "ar" ? "en-US" : lang, {minimumFractionDigits:1,maximumFractionDigits:1})
      ), node("small", "", "/5"));
      ratingNode.hidden = false;
      const filled = Math.max(0, Math.min(5, Math.round(rating)));
      starsNode.textContent = "★".repeat(filled) + "☆".repeat(5 - filled);
      starsNode.setAttribute("aria-label", rating + " " + tx.stars);
      starsNode.hidden = false;
    }
    if (Number.isInteger(count) && count >= 0 && countNode) {
      countNode.textContent = count.toLocaleString(lang) + " " + tx.reviews;
    }
    const reviews = Array.isArray(place.reviews) ? place.reviews.slice(0, 50) : [];
    diagnostic("SUCCESS: rating=" + (Number.isFinite(rating) ? rating : "none") +
      "; total=" + (Number.isFinite(count) ? count : "none") +
      "; reviewsReturned=" + reviews.length +
      "; reviewContainer=" + Boolean(reviewList));
    if (!reviewList || !reviews.length) return;
    const cards = [];
    for (const r of reviews) {
      if (!r || (!r.text && !r.rating)) continue;
      const card = node("article", "hp-live-review-card");
      const header = node("div", "hp-live-review-header");
      const author = r.authorAttribution || {};
      const authorName = author.displayName || "Google Maps";
      const authorUri = safeUrl(author.uri);
      if (authorUri) header.appendChild(link(authorName, authorUri, "hp-live-review-author"));
      else header.appendChild(node("strong", "hp-live-review-author", authorName));
      if (r.publishTime) {
        const d = new Date(r.publishTime);
        if (!isNaN(d.getTime())) {
          const time = node("time", "hp-live-review-date", new Intl.DateTimeFormat(lang, {year:"numeric",month:"short"}).format(d));
          time.dateTime = d.toISOString();
          header.appendChild(time);
        }
      }
      card.appendChild(header);
      const score = Math.max(0, Math.min(5, Math.round(Number(r.rating) || 0)));
      card.appendChild(node("div", "hp-live-review-stars", "★".repeat(score) + "☆".repeat(5-score)));
      if (r.text) card.appendChild(node("p", "hp-live-review-text", r.text));
      card.appendChild(link(tx.source + " ↗", r.googleMapsURI || maps || section.querySelector(".hp-google-link").href, "hp-live-review-credit"));
      cards.push(card);
    }
    if (!cards.length) {
      diagnostic("SUCCESS: reviewsReturned=" + reviews.length + " but all are empty.");
      return;
    }
    carousel(cards);
    reviewList.hidden = false;
    diagnostic("SUCCESS: " + cards.length + " review cards rendered; " +
      "visible=" + (getComputedStyle(reviewList).display !== "none"));
  }
  if (!placeId) {
    diagnostic(!key ? "API_KEY_MISSING_IN_DEMO_DEPLOYMENT" : "PLACE_ID_MISSING");
    return;
  }
  async function loadReviews(){
    try {
      const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cmNyZm95d29rdXV3enducXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MDAxNDUsImV4cCI6MjEwNzM3NjE0NX0.PyabGDs6Qi48GtOyZuaJH7pC_Q9qgx7_YoybOG9PfGU";
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      let response;
      try {
        response = await fetch("https://ktrcrfoywokuuwzwnqsu.supabase.co/functions/v1/google-business-reviews", {
          headers:{Authorization:"Bearer " + publicAnonKey, apikey:publicAnonKey},
          signal:controller.signal, credentials:"omit"
        });
      } finally { clearTimeout(timeout); }
      if (!response.ok) throw new Error("REVIEWS_SOURCE_PENDING");
      const place = await response.json();
      if (!Array.isArray(place.reviews) || !Number.isInteger(place.userRatingCount)) throw new Error("INVALID_REVIEWS_RESPONSE");
      show(place);
      return;
    } catch (_) {
      diagnostic("BUSINESS_PROFILE_PENDING: using Google Maps fallback.");
    }
    if (key) loadMapsReviews();
  }
  function loadMapsReviews(){
  diagnostic("LOADING_GOOGLE_MAPS");
  let completed = false;
  if (debug) setTimeout(function () {
    if (!completed) diagnostic("GOOGLE_MAPS_TIMEOUT: Check Billing status and open browser console.");
  }, 18000);
  window.gm_authFailure = function () {
    completed = true;
    diagnostic("GOOGLE_MAPS_AUTH_FAILED: Check Billing, key restrictions and enabled APIs.");
  };
  const callback = "imsfraneReviewsInit";
  window[callback] = async function () {
    try {
      const {Place} = await google.maps.importLibrary("places");
      const place = new Place({id: placeId});
      await place.fetchFields({fields:["displayName","rating","userRatingCount","reviews","googleMapsURI"]});
      show(place);
      completed = true;
    } catch (e) {
      completed = true;
      diagnostic(errorCode(e));
      console.warn("Google Maps live reviews unavailable; official listing link remains available.");
    } finally {
      try { delete window[callback]; } catch (e) {}
    }
  };
  const loader = document.createElement("script");
  loader.async = true;
  loader.src = "https://maps.googleapis.com/maps/api/js?key=" +
    encodeURIComponent(key) + "&v=weekly&libraries=places&loading=async&callback=" + callback +
    "&language=" + encodeURIComponent(lang);
  loader.onerror = function () {
    completed = true;
    diagnostic("GOOGLE_MAPS_SCRIPT_BLOCKED: Check connectivity or browser blockers.");
    try { delete window[callback]; } catch (e) {}
  };
  document.head.appendChild(loader);
  }
  // Load the live review integration when its section is visible, after
  // the initial page load. The public Google listing link always works.
  function observeReviews(){
    if(!('IntersectionObserver' in window)){loadReviews();return}
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();loadReviews()}
    },{rootMargin:'0px',threshold:0.05});
    observer.observe(section);
  }
  let watching=false;
  function begin(){if(watching)return;watching=true;observeReviews()}
  // Live reviews are requested when a visitor starts exploring the page.
  // This avoids loading an entire map engine for an unattended first view.
  window.addEventListener('scroll',begin,{once:true,passive:true});
  window.addEventListener('pointerdown',begin,{once:true,passive:true});
  window.addEventListener('keydown',begin,{once:true});
  if(window.scrollY>0)begin();
})();
