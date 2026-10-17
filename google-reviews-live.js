/* Imsfrane Demo: display live Google Maps reviews without storing review data.
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
    const reviews = Array.isArray(place.reviews) ? place.reviews.slice(0, 5) : [];
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
    reviewList.replaceChildren(...cards);
    reviewList.hidden = false;
    diagnostic("SUCCESS: " + cards.length + " review cards rendered; " +
      "visible=" + (getComputedStyle(reviewList).display !== "none"));
  }
  if (!key || !placeId) {
    diagnostic(!key ? "API_KEY_MISSING_IN_DEMO_DEPLOYMENT" : "PLACE_ID_MISSING");
    return;
  }
  function loadReviews(){
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
