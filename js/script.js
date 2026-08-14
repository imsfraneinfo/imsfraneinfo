/* =========================================================
   IMSFRANE CATHÉDRALE
   GLOBAL SCRIPT.JS
   ENGLISH + FRENCH
   ========================================================= */

"use strict";

/* =========================
   SETTINGS
   ========================= */

const SLIDER_INTERVAL_TIME = 5000;

/* =========================
   ELEMENTS
   ========================= */

const body = document.body;
const htmlElement = document.documentElement;
const menuButton = document.getElementById("menuButton");
const navigationClose = document.getElementById("navigationClose");
const mainNavigation = document.getElementById("mainNavigation");
const siteOverlay = document.getElementById("siteOverlay");
const languageButtons = document.querySelectorAll(".language-button");
const dropdowns = document.querySelectorAll(".navigation-dropdown");
const dropdownButtons = document.querySelectorAll(".dropdown-toggle");
const backToTopButton = document.getElementById("backToTop");
const currentYearElement = document.getElementById("currentYear");
const heroSlider = document.querySelector(".hero-slider");
const heroSlides = document.querySelectorAll(".hero-slider .slide");
const heroDotsContainer = document.querySelector(".hero-slider .slider-dots");
const previousSlideButton = document.querySelector(".hero-slider .slider-btn.prev");
const nextSlideButton = document.querySelector(".hero-slider .slider-btn.next");

/* =========================
   LANGUAGE
   ========================= */

function getPageLanguage() {
    return (htmlElement.getAttribute("lang") || body.getAttribute("data-lang") || "en").toLowerCase().startsWith("fr") ? "fr" : "en";
}

function initializePageLanguage() {
    const language = getPageLanguage();
    body.setAttribute("data-lang", language);
    htmlElement.setAttribute("lang", language);
    htmlElement.setAttribute("dir", "ltr");

    languageButtons.forEach((link) => {
        const linkLanguage = (link.getAttribute("lang") || "").toLowerCase();
        const isActive = linkLanguage === language;
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    });

    updateTranslatedLabels(language);
}

function updateTranslatedLabels(language) {
    if (menuButton) menuButton.setAttribute("aria-label", language === "fr" ? "Ouvrir le menu de navigation" : "Open navigation menu");
    if (navigationClose) navigationClose.setAttribute("aria-label", language === "fr" ? "Fermer le menu de navigation" : "Close navigation menu");
    if (backToTopButton) backToTopButton.setAttribute("aria-label", language === "fr" ? "Retour en haut" : "Back to top");
    if (previousSlideButton) previousSlideButton.setAttribute("aria-label", language === "fr" ? "Image précédente" : "Previous image");
    if (nextSlideButton) nextSlideButton.setAttribute("aria-label", language === "fr" ? "Image suivante" : "Next image");
}

/* =========================
   MENU
   ========================= */

function openMenu() {
    if (!mainNavigation || !siteOverlay || !menuButton) {
        return;
    }

    mainNavigation.inert = false;
    mainNavigation.removeAttribute("inert");
    mainNavigation.classList.add("active");
    siteOverlay.classList.add("active");
    body.classList.add("menu-open");

    menuButton.setAttribute("aria-expanded", "true");

    if (navigationClose) {
        navigationClose.focus();
    }
}

function closeMenu(restoreFocus = true) {
    if (!mainNavigation || !siteOverlay || !menuButton) {
        return;
    }

    mainNavigation.classList.remove("active");
    siteOverlay.classList.remove("active");
    body.classList.remove("menu-open");
    mainNavigation.inert = true;
    mainNavigation.setAttribute("inert", "");

    menuButton.setAttribute("aria-expanded", "false");

    if (restoreFocus && document.activeElement !== menuButton) {
        menuButton.focus({ preventScroll: true });
    }
}

function toggleMenu() {
    if (!mainNavigation) {
        return;
    }

    if (mainNavigation.classList.contains("active")) {
        closeMenu();
    } else {
        openMenu();
    }
}

if (menuButton) {
    menuButton.addEventListener("click", toggleMenu);
}

if (navigationClose) {
    navigationClose.addEventListener("click", closeMenu);
}

if (siteOverlay) {
    siteOverlay.addEventListener("click", closeMenu);
}

if (mainNavigation) {
    const navigationLinks = mainNavigation.querySelectorAll("a");

    navigationLinks.forEach((link) => {
        link.addEventListener("click", () => closeMenu(false));
    });
}

/* =========================
   DROPDOWN
   ========================= */

function closeAllDropdowns(exception = null) {
    dropdowns.forEach((dropdown) => {
        if (dropdown === exception) {
            return;
        }

        dropdown.classList.remove("open");

        const button = dropdown.querySelector(".dropdown-toggle");

        if (button) {
            button.setAttribute("aria-expanded", "false");
        }
    });
}

dropdownButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const parentDropdown = button.closest(".navigation-dropdown");

        if (!parentDropdown) {
            return;
        }

        const isOpen = parentDropdown.classList.contains("open");

        closeAllDropdowns(parentDropdown);

        parentDropdown.classList.toggle("open", !isOpen);
        button.setAttribute("aria-expanded", String(!isOpen));
    });
});

/* =========================
   ESCAPE
   ========================= */

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
        closeAllDropdowns();
    }
});

/* =========================
   HERO SLIDER
   ========================= */

let currentSlideIndex = 0;
let heroSliderInterval = null;

let touchStartX = 0;
let touchEndX = 0;

function createHeroDots() {
    if (!heroDotsContainer || heroSlides.length === 0) {
        return;
    }

    heroDotsContainer.innerHTML = "";

    heroSlides.forEach((slide, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "dot";
        dot.setAttribute("aria-label", `${getPageLanguage() === "fr" ? "Image" : "Image"} ${index + 1}`);

        if (index === 0) {
            dot.classList.add("active");
            dot.setAttribute("aria-current", "true");
        }

        dot.addEventListener("click", () => {
            showSlide(index);
            restartHeroSlider();
        });

        heroDotsContainer.appendChild(dot);
    });
}

function getHeroDots() {
    return document.querySelectorAll(".hero-slider .dot");
}

function showSlide(index) {
    if (heroSlides.length === 0) {
        return;
    }

    if (index < 0) {
        index = heroSlides.length - 1;
    }

    if (index >= heroSlides.length) {
        index = 0;
    }

    heroSlides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === index;

        slide.classList.toggle("active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
    });

    const heroDots = getHeroDots();

    heroDots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === index;

        dot.classList.toggle("active", isActive);

        if (isActive) {
            dot.setAttribute("aria-current", "true");
        } else {
            dot.removeAttribute("aria-current");
        }
    });

    currentSlideIndex = index;
}

function changeSlide(direction) {
    showSlide(currentSlideIndex + direction);
    restartHeroSlider();
}

function startHeroSlider() {
    if (heroSlides.length <= 1) {
        return;
    }

    stopHeroSlider();

    heroSliderInterval = window.setInterval(() => {
        showSlide(currentSlideIndex + 1);
    }, SLIDER_INTERVAL_TIME);
}

function stopHeroSlider() {
    if (heroSliderInterval !== null) {
        window.clearInterval(heroSliderInterval);
        heroSliderInterval = null;
    }
}

function restartHeroSlider() {
    stopHeroSlider();
    startHeroSlider();
}

if (previousSlideButton) {
    previousSlideButton.addEventListener("click", () => {
        changeSlide(-1);
    });
}

if (nextSlideButton) {
    nextSlideButton.addEventListener("click", () => {
        changeSlide(1);
    });
}

if (heroSlider) {
    heroSlider.addEventListener("mouseenter", stopHeroSlider);
    heroSlider.addEventListener("mouseleave", startHeroSlider);

    heroSlider.addEventListener(
        "touchstart",
        (event) => {
            touchStartX = event.changedTouches[0].screenX;
        },
        {
            passive: true
        }
    );

    heroSlider.addEventListener(
        "touchend",
        (event) => {
            touchEndX = event.changedTouches[0].screenX;
            handleSliderSwipe();
        },
        {
            passive: true
        }
    );
}

function handleSliderSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    const minimumSwipeDistance = 50;

    if (Math.abs(swipeDistance) < minimumSwipeDistance) {
        return;
    }

    if (swipeDistance > 0) {
        changeSlide(-1);
    } else {
        changeSlide(1);
    }
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        stopHeroSlider();
    } else {
        startHeroSlider();
    }
});

/* =========================
   BACK TO TOP
   ========================= */

function updateBackToTopButton() {
    if (!backToTopButton) {
        return;
    }

    backToTopButton.classList.toggle(
        "show",
        window.scrollY > 350
    );
}

if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

let backToTopFramePending = false;
window.addEventListener(
    "scroll",
    () => {
        if (backToTopFramePending) return;
        backToTopFramePending = true;
        window.requestAnimationFrame(() => {
            updateBackToTopButton();
            backToTopFramePending = false;
        });
    },
    { passive: true }
);

/* =========================
   CURRENT YEAR
   ========================= */

function updateCurrentYear() {
    if (!currentYearElement) {
        return;
    }

    currentYearElement.textContent = String(
        new Date().getFullYear()
    );
}

/* =========================
   SMOOTH LINKS
   ========================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const targetElement = document.querySelector(targetId);

        if (!targetElement) {
            return;
        }

        event.preventDefault();

        targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

/* =========================
   ACTIVE MENU LINK
   ========================= */

function setActiveNavigationLink() {
    const currentPath = body.dataset.navActive || window.location.pathname.split("/").pop() || "index.html";

    const navigationLinks = document.querySelectorAll(
        ".navigation-list a"
    );

    navigationLinks.forEach((link) => {
        const href = link.getAttribute("href");

        if (!href) {
            return;
        }

        const linkPath = href.split("/").pop();

        link.classList.toggle(
            "active",
            linkPath === currentPath
        );
    });
}

/* =========================
   INITIALIZATION
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
    initializePageLanguage();

    updateCurrentYear();
    updateBackToTopButton();
    setActiveNavigationLink();

    createHeroDots();

    if (heroSlides.length > 0) {
        showSlide(0);
        startHeroSlider();
    }
});

/* Page-specific modules extracted from HTML files. */


/* ===== PAGE: BLOG ===== */
(() => {
    if (!document.body.classList.contains("page-blog")) return;
    try {
        document.addEventListener("DOMContentLoaded", function () {
                    const articleButtons = document.querySelectorAll(
                        "[data-article]"
                    );
        
                    const articleModals = document.querySelectorAll(
                        ".article-modal"
                    );
        
                    function closeAllArticles() {
                        articleModals.forEach(function (modal) {
                            modal.classList.remove("open");
                        });
        
                        document.body.style.overflow = "";
                    }
        
                    articleButtons.forEach(function (button) {
                        button.addEventListener("click", function () {
                            const articleId = button.getAttribute(
                                "data-article"
                            );
        
                            const modal = document.getElementById(
                                articleId
                            );
        
                            if (!modal) {
                                return;
                            }
        
                            modal.classList.add("open");
                            document.body.style.overflow = "hidden";
                        });
                    });
        
                    articleModals.forEach(function (modal) {
                        const closeButton = modal.querySelector(
                            ".article-modal-close"
                        );
        
                        if (closeButton) {
                            closeButton.addEventListener(
                                "click",
                                closeAllArticles
                            );
                        }
        
                        modal.addEventListener("click", function (event) {
                            if (event.target === modal) {
                                closeAllArticles();
                            }
                        });
                    });
        
                    document.addEventListener("keydown", function (event) {
                        if (event.key === "Escape") {
                            closeAllArticles();
                        }
                    });
                });
    } catch (error) {
        console.error("Imsfrane blog module error:", error);
    }
})();


/* ===== PAGE: BOOKING ===== */
(() => {
    if (!document.body.classList.contains("page-booking")) return;
    document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("bookingForm");
        if (!form) return;
        const activity = document.getElementById("bookingActivity");
        const routeField = document.getElementById("raftingRouteField");
        const route = document.getElementById("raftingRoute");
        const campingTentField = document.getElementById("campingTentField");
        const campingTent = document.getElementById("campingTent");
        const date = document.getElementById("bookingDate");
        const secondDate = document.getElementById("secondDate");
        const people = document.getElementById("bookingPeople");
        const transport = document.getElementById("transportNeeded");
        const summaryActivity = document.getElementById("summaryActivity");
        const summaryRoute = document.getElementById("summaryRoute");
        const summaryDate = document.getElementById("summaryDate");
        const summaryPeople = document.getElementById("summaryPeople");
        const summaryTransport = document.getElementById("summaryTransport");
        const estimatedPrice = document.getElementById("estimatedPrice");
        const formMessage = document.getElementById("bookingMessage");
        const lang = getPageLanguage();
        const today = new Date().toISOString().split("T")[0];
        if (date) date.min = today;
        if (secondDate) secondDate.min = today;

        const perPerson = {"vtt-1h":50,"vtt-2h":100,"vtt-day":150,quad:250,programme3:1150};
        const rafting = {"12":400,"30":800,"50-sidi":2500,"50-dam":3000};
        const groupPrice = {"hiking-summit":300,"hiking-circuit":200};
        const campingPrice = {"1":60,"2":120,"3":150,"4":200};

        const label = (select) => {
            if (!select || !select.value) return "—";
            const option = select.options[select.selectedIndex];
            return option?.getAttribute(lang === "fr" ? "data-label-fr" : "data-label-en") || option?.textContent.trim() || "—";
        };
        const formatDate = (value) => value ? new Date(value + "T00:00:00").toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {day:"2-digit",month:"long",year:"numeric"}) : "—";
        const calculate = () => {
            const count = Math.max(1, Number(people?.value) || 1);
            let total = 0;
            if (activity?.value === "rafting" && route?.value) total = (rafting[route.value] || 0) * count;
            else if (activity?.value === "camping" && campingTent?.value) total = campingPrice[campingTent.value] || 0;
            else if (perPerson[activity?.value]) total = perPerson[activity.value] * count;
            else if (groupPrice[activity?.value]) total = groupPrice[activity.value];
            if (!estimatedPrice) return;
            if (total) estimatedPrice.textContent = total.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB") + " DH";
            else if (activity?.value === "camping") estimatedPrice.textContent = lang === "fr" ? "Choisissez la capacité de la tente" : "Select the tent size";
            else estimatedPrice.textContent = lang === "fr" ? "Tarif sur demande" : "Quote on request";
        };
        const update = () => {
            if (routeField) routeField.hidden = activity?.value !== "rafting";
            if (campingTentField) campingTentField.hidden = activity?.value !== "camping";
            if (route && activity?.value !== "rafting") route.value = "";
            if (campingTent && activity?.value !== "camping") campingTent.value = "";
            if (summaryActivity) summaryActivity.textContent = label(activity);
            if (summaryRoute) summaryRoute.textContent = activity?.value === "rafting" ? label(route) : "—";
            if (summaryDate) summaryDate.textContent = formatDate(date?.value);
            if (summaryPeople) summaryPeople.textContent = String(Math.max(1, Number(people?.value) || 1));
            if (summaryTransport) summaryTransport.textContent = label(transport);
            calculate();
        };
        [activity, route, campingTent, date, secondDate, people, transport].forEach(el => el?.addEventListener("change", update));
        people?.addEventListener("input", update);
        form.addEventListener("reset", () => setTimeout(update, 0));
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!form.reportValidity()) return;
            const value = id => (document.getElementById(id)?.value || "").trim();
            const children = value("bookingChildren") || "0";
            const lines = lang === "fr" ? [
                "Bonjour Imsfrane Cathédrale,", "", "Je souhaite envoyer une demande de réservation :",
                `Nom : ${value("customerName")}`, `Téléphone / WhatsApp : ${value("customerPhone")}`,
                `E-mail : ${value("customerEmail") || "Non renseigné"}`, `Pays : ${value("customerCountry") || "Non renseigné"}`,
                `Activité : ${label(activity)}`, `Parcours rafting : ${activity?.value === "rafting" ? label(route) : "Non applicable"}`, `Tente : ${activity?.value === "camping" ? label(campingTent) : "Non applicable"}`,
                `Date souhaitée : ${formatDate(date?.value)}`, `Date alternative : ${formatDate(secondDate?.value)}`,
                `Adultes : ${value("bookingPeople") || "1"}`, `Enfants : ${children}`, `Point de rendez-vous : ${value("meetingPoint") || "À confirmer"}`,
                `Transport : ${label(transport)}`, `Langue préférée : ${label(document.getElementById("preferredLanguage"))}`,
                `Notes : ${value("bookingNotes") || "Aucune"}`, `Estimation affichée : ${estimatedPrice?.textContent || "À confirmer"}`, "", "Merci de confirmer la disponibilité et le tarif final."
            ] : [
                "Hello Imsfrane Cathédrale,", "", "I would like to send a booking request:",
                `Name: ${value("customerName")}`, `Phone / WhatsApp: ${value("customerPhone")}`,
                `Email: ${value("customerEmail") || "Not provided"}`, `Country: ${value("customerCountry") || "Not provided"}`,
                `Activity: ${label(activity)}`, `Rafting route: ${activity?.value === "rafting" ? label(route) : "Not applicable"}`, `Tent: ${activity?.value === "camping" ? label(campingTent) : "Not applicable"}`,
                `Preferred date: ${formatDate(date?.value)}`, `Alternative date: ${formatDate(secondDate?.value)}`,
                `Adults: ${value("bookingPeople") || "1"}`, `Children: ${children}`, `Meeting point: ${value("meetingPoint") || "To be confirmed"}`,
                `Transport: ${label(transport)}`, `Preferred language: ${label(document.getElementById("preferredLanguage"))}`,
                `Notes: ${value("bookingNotes") || "None"}`, `Displayed estimate: ${estimatedPrice?.textContent || "To be confirmed"}`, "", "Please confirm availability and the final price."
            ];
            if (formMessage) formMessage.textContent = lang === "fr" ? "Ouverture de WhatsApp…" : "Opening WhatsApp…";
            window.open("https://wa.me/212667772551?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener,noreferrer");
        });
        update();
    });
})();

/* ===== PAGE: CONTACT ===== */
(() => {
    if (!document.body.classList.contains("page-contact")) return;
    document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("contactForm");
        if (!form) return;
        const lang = getPageLanguage();
        const date = document.getElementById("contactDate");
        const status = document.getElementById("contactFormMessage");
        const emailButton = document.getElementById("sendEmail");
        if (date) date.min = new Date().toISOString().split("T")[0];
        const value = id => (document.getElementById(id)?.value || "").trim();
        const subjectSelect = document.getElementById("contactSubject");
        const subjectLabel = () => {
            if (!subjectSelect?.value) return "";
            const option = subjectSelect.options[subjectSelect.selectedIndex];
            return option?.getAttribute(lang === "fr" ? "data-label-fr" : "data-label-en") || option?.textContent.trim() || "";
        };
        const formatDate = v => v ? new Date(v + "T00:00:00").toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {day:"2-digit",month:"long",year:"numeric"}) : (lang === "fr" ? "Non renseignée" : "Not provided");
        const build = () => lang === "fr" ? [
            "Bonjour Imsfrane Cathédrale,", "", `Sujet : ${subjectLabel()}`, `Nom : ${value("contactName")}`,
            `Téléphone / WhatsApp : ${value("contactPhone")}`, `E-mail : ${value("contactEmail") || "Non renseigné"}`,
            `Pays : ${value("contactCountry") || "Non renseigné"}`, `Date souhaitée : ${formatDate(value("contactDate"))}`,
            `Nombre de personnes : ${value("contactPeople") || "1"}`, "", value("contactMessage")
        ] : [
            "Hello Imsfrane Cathédrale,", "", `Subject: ${subjectLabel()}`, `Name: ${value("contactName")}`,
            `Phone / WhatsApp: ${value("contactPhone")}`, `Email: ${value("contactEmail") || "Not provided"}`,
            `Country: ${value("contactCountry") || "Not provided"}`, `Preferred date: ${formatDate(value("contactDate"))}`,
            `Number of people: ${value("contactPeople") || "1"}`, "", value("contactMessage")
        ];
        form.addEventListener("submit", event => {
            event.preventDefault();
            if (!form.reportValidity()) return;
            if (status) status.textContent = lang === "fr" ? "Ouverture de WhatsApp…" : "Opening WhatsApp…";
            window.open("https://wa.me/212667772551?text=" + encodeURIComponent(build().join("\n")), "_blank", "noopener,noreferrer");
        });
        emailButton?.addEventListener("click", () => {
            if (!form.reportValidity()) return;
            const subject = subjectLabel() || (lang === "fr" ? "Demande depuis le site" : "Website enquiry");
            window.location.href = "mailto:imsfraneinfo@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(build().join("\n"));
        });
        document.querySelectorAll(".contact-faq-item").forEach(item => {
            const button = item.querySelector("button");
            const answer = item.querySelector(".contact-faq-answer");
            if (!button || !answer) return;
            button.addEventListener("click", () => {
                const open = item.classList.toggle("open");
                button.setAttribute("aria-expanded", String(open));
                answer.hidden = !open;
            });
            button.setAttribute("aria-expanded", "false");
            answer.hidden = true;
        });
    });
})();

/* ===== PAGE: HEBERGEMENT ===== */
(() => {
    if (!document.body.classList.contains("page-hebergement")) return;
    try {
        document.addEventListener("DOMContentLoaded", function () {
                    const faqItems =
                        document.querySelectorAll(
                            ".accommodation-faq-item"
                        );
        
                    faqItems.forEach(function (item) {
                        const question =
                            item.querySelector(
                                ".accommodation-faq-question"
                            );
        
                        if (!question) {
                            return;
                        }
        
                        question.addEventListener(
                            "click",
                            function () {
                                const isOpen =
                                    item.classList.contains("open");
        
                                faqItems.forEach(
                                    function (otherItem) {
                                        otherItem.classList.remove("open");
        
                                        const otherQuestion =
                                            otherItem.querySelector(
                                                ".accommodation-faq-question"
                                            );
        
                                        if (otherQuestion) {
                                            otherQuestion.setAttribute(
                                                "aria-expanded",
                                                "false"
                                            );
                                        }
                                    }
                                );
        
                                if (!isOpen) {
                                    item.classList.add("open");
        
                                    question.setAttribute(
                                        "aria-expanded",
                                        "true"
                                    );
                                }
                            }
                        );
                    });
                });
    } catch (error) {
        console.error("Imsfrane hebergement module error:", error);
    }
})();


/* ===== PAGE: MEMORIES ===== */
(() => {
    if (!document.body.classList.contains("page-memories")) return;
    try {
        document.addEventListener("DOMContentLoaded", function () {
                    /* =================================================
                       IMAGE LIST
                       ================================================= */
        
                    const numberedImages = [];
        
                    for (let number = 1; number <= 112; number += 1) {
                        numberedImages.push(number + ".jpeg");
                    }
        
                    const namedImages = [
                        "24.webp",
                        "23.webp",
                        "25.webp",
                        "22.webp",
                        "19.webp",
                        "4x4.webp",
        
                        "raft2.webp",
                        "raft3.webp",
        
                        "vtt.webp",
                        "quad.webp",
        
                        "bab2.webp",
                        "bab3.webp",
                        "babmsfrane.webp",
                        "IMG_3580.webp",
        
                        "IMG_4728.webp",
                        "IMG_4826.webp",
                        "IMG_4832.webp",
                        "IMG_4850.webp",
                        "IMG_5128.jpg",
                        "IMG_5131.webp",
                        "IMG_5134.webp",
                        "IMG_7364.webp",
                        "IMG_7422.webp",
                        "IMG_7430.webp",
                        "IMG_7431.webp",
                        "IMG_7433.webp",
                        "IMG_7716.webp",
                        "IMG_7717.webp",
                        "IMG_7733.webp",
        
                        "benilouidan.webp",
        
                        "camping-1.webp",
                        "camping-2.webp",
                        "camping-3.webp",
                        "camping-4.jpg",
        
                        "blog-msfrane.webp",
                        "blog-cascades.webp",
                        "blog-gorges.webp",
                        "blog-tilouguite.webp",
                        "blog-oued-ahansal.webp",
        
                        "guide.webp",
                        "house.jpg",
                        "logo.webp"
                    ];
        
                    const imageNames = [
                        ...new Set([
                            ...numberedImages,
                            ...namedImages
                        ])
                    ].filter(function (name) {
                        return name !== "logo.webp";
                    });
        
                    /* =================================================
                       ELEMENTS
                       ================================================= */
        
                    const galleryGrid =
                        document.getElementById("memoriesGalleryGrid");
        
                    const loadMoreButton =
                        document.getElementById("loadMorePhotos");
        
                    const displayedPhotoCount =
                        document.getElementById("displayedPhotoCount");
        
                    const availablePhotoCount =
                        document.getElementById("availablePhotoCount");
        
                    const memoriesEmpty =
                        document.getElementById("memoriesEmpty");
        
                    const lightbox =
                        document.getElementById("memoriesLightbox");
        
                    const lightboxImage =
                        document.getElementById("lightboxImage");
        
                    const lightboxCaption =
                        document.getElementById("lightboxCaption");
        
                    const lightboxCurrent =
                        document.getElementById("lightboxCurrent");
        
                    const lightboxTotal =
                        document.getElementById("lightboxTotal");
        
                    const lightboxClose =
                        document.getElementById("lightboxClose");
        
                    const lightboxPrev =
                        document.getElementById("lightboxPrev");
        
                    const lightboxNext =
                        document.getElementById("lightboxNext");
        
                    /* =================================================
                       SETTINGS
                       ================================================= */
        
                    const batchSize = 20;
        
                    let nextImageIndex = 0;
                    let currentLightboxIndex = 0;
                    let availableImages = [];
                    let renderedImages = [];
                    let loadingBatch = false;
        
                    let touchStartX = 0;
                    let touchEndX = 0;
        
                    /* =================================================
                       HELPERS
                       ================================================= */
        
                    function createAltText(fileName) {
                        const cleanName = fileName
                            .replace(/\.[^/.]+$/, "")
                            .replace(/[-_]/g, " ");
        
                        return "Imsfrane Cathédrale photo — " + cleanName;
                    }
        
                    function updateCounters() {
                        displayedPhotoCount.textContent =
                            renderedImages.length;
        
                        availablePhotoCount.textContent =
                            availableImages.length;
        
                        lightboxTotal.textContent =
                            renderedImages.length;
                    }
        
                    function testImage(fileName) {
                        return new Promise(function (resolve) {
                            const image = new Image();
        
                            image.onload = function () {
                                resolve({
                                    fileName: fileName,
                                    src: "../images/" + fileName,
                                    alt: createAltText(fileName)
                                });
                            };
        
                            image.onerror = function () {
                                resolve(null);
                            };
        
                            image.src = "../images/" + fileName;
                        });
                    }
        
                    function createGalleryItem(imageData, galleryIndex) {
                        const figure =
                            document.createElement("figure");
        
                        figure.className = "memory-item";
                        figure.tabIndex = 0;
                        figure.setAttribute(
                            "role",
                            "button"
                        );
        
                        figure.setAttribute(
                            "aria-label",
                            "Open photo " + (galleryIndex + 1)
                        );
        
                        const image =
                            document.createElement("img");
        
                        image.src = imageData.src;
                        image.alt = imageData.alt;
                        image.loading = "lazy";
                        image.decoding = "async";
        
                        figure.appendChild(image);
        
                        figure.addEventListener(
                            "click",
                            function () {
                                openLightbox(galleryIndex);
                            }
                        );
        
                        figure.addEventListener(
                            "keydown",
                            function (event) {
                                if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                ) {
                                    event.preventDefault();
                                    openLightbox(galleryIndex);
                                }
                            }
                        );
        
                        return figure;
                    }
        
                    /* =================================================
                       LOAD IMAGES
                       ================================================= */
        
                    async function loadNextBatch() {
                        if (loadingBatch) {
                            return;
                        }
        
                        loadingBatch = true;
                        loadMoreButton.disabled = true;
        
                        let addedInThisBatch = 0;
        
                        while (
                            nextImageIndex < imageNames.length &&
                            addedInThisBatch < batchSize
                        ) {
                            const fileName =
                                imageNames[nextImageIndex];
        
                            nextImageIndex += 1;
        
                            const imageData =
                                await testImage(fileName);
        
                            if (!imageData) {
                                continue;
                            }
        
                            availableImages.push(imageData);
        
                            const galleryIndex =
                                renderedImages.length;
        
                            renderedImages.push(imageData);
        
                            galleryGrid.appendChild(
                                createGalleryItem(
                                    imageData,
                                    galleryIndex
                                )
                            );
        
                            addedInThisBatch += 1;
                        }
        
                        updateCounters();
        
                        if (
                            nextImageIndex >= imageNames.length
                        ) {
                            loadMoreButton.classList.add("hidden");
                        } else {
                            loadMoreButton.classList.remove("hidden");
                        }
        
                        if (
                            renderedImages.length === 0 &&
                            nextImageIndex >= imageNames.length
                        ) {
                            memoriesEmpty.classList.add("show");
                        } else {
                            memoriesEmpty.classList.remove("show");
                        }
        
                        loadingBatch = false;
                        loadMoreButton.disabled = false;
                    }
        
                    loadMoreButton.addEventListener(
                        "click",
                        loadNextBatch
                    );
        
                    /* =================================================
                       LIGHTBOX
                       ================================================= */
        
                    function updateLightbox() {
                        if (!renderedImages.length) {
                            return;
                        }
        
                        const imageData =
                            renderedImages[currentLightboxIndex];
        
                        lightboxImage.src = imageData.src;
                        lightboxImage.alt = imageData.alt;
        
                        lightboxCaption.textContent =
                            imageData.fileName;
        
                        lightboxCurrent.textContent =
                            currentLightboxIndex + 1;
        
                        lightboxTotal.textContent =
                            renderedImages.length;
                    }
        
                    function openLightbox(index) {
                        currentLightboxIndex = index;
        
                        updateLightbox();
        
                        lightbox.classList.add("open");
                        document.body.style.overflow = "hidden";
        
                        lightboxClose.focus();
                    }
        
                    function closeLightbox() {
                        lightbox.classList.remove("open");
                        document.body.style.overflow = "";
                    }
        
                    function changeLightbox(direction) {
                        if (!renderedImages.length) {
                            return;
                        }
        
                        currentLightboxIndex += direction;
        
                        if (currentLightboxIndex < 0) {
                            currentLightboxIndex =
                                renderedImages.length - 1;
                        }
        
                        if (
                            currentLightboxIndex >=
                            renderedImages.length
                        ) {
                            currentLightboxIndex = 0;
                        }
        
                        updateLightbox();
                    }
        
                    lightboxClose.addEventListener(
                        "click",
                        closeLightbox
                    );
        
                    lightboxPrev.addEventListener(
                        "click",
                        function () {
                            changeLightbox(-1);
                        }
                    );
        
                    lightboxNext.addEventListener(
                        "click",
                        function () {
                            changeLightbox(1);
                        }
                    );
        
                    lightbox.addEventListener(
                        "click",
                        function (event) {
                            if (
                                event.target === lightbox ||
                                event.target.classList.contains(
                                    "memories-lightbox-stage"
                                )
                            ) {
                                closeLightbox();
                            }
                        }
                    );
        
                    document.addEventListener(
                        "keydown",
                        function (event) {
                            if (
                                !lightbox.classList.contains("open")
                            ) {
                                return;
                            }
        
                            if (event.key === "Escape") {
                                closeLightbox();
                            }
        
                            if (event.key === "ArrowLeft") {
                                changeLightbox(-1);
                            }
        
                            if (event.key === "ArrowRight") {
                                changeLightbox(1);
                            }
                        }
                    );
        
                    /* =================================================
                       SWIPE
                       ================================================= */
        
                    lightbox.addEventListener(
                        "touchstart",
                        function (event) {
                            touchStartX =
                                event.changedTouches[0].screenX;
                        },
                        {
                            passive: true
                        }
                    );
        
                    lightbox.addEventListener(
                        "touchend",
                        function (event) {
                            touchEndX =
                                event.changedTouches[0].screenX;
        
                            const swipeDistance =
                                touchEndX - touchStartX;
        
                            if (
                                Math.abs(swipeDistance) < 45
                            ) {
                                return;
                            }
        
                            if (swipeDistance > 0) {
                                changeLightbox(-1);
                            } else {
                                changeLightbox(1);
                            }
                        },
                        {
                            passive: true
                        }
                    );
        
                    /* =================================================
                       INITIAL LOAD
                       ================================================= */
        
                    loadNextBatch();
                });
    } catch (error) {
        console.error("Imsfrane memories module error:", error);
    }
})();


/* ===== PAGE: QUAD ===== */
(() => {
    if (!document.body.classList.contains("page-quad")) return;
    try {
        document.addEventListener("DOMContentLoaded", function () {
                    const faqItems =
                        document.querySelectorAll(".quad-faq-item");
        
                    faqItems.forEach(function (item) {
                        const question =
                            item.querySelector(".quad-faq-question");
        
                        if (!question) {
                            return;
                        }
        
                        question.addEventListener(
                            "click",
                            function () {
                                const isOpen =
                                    item.classList.contains("open");
        
                                faqItems.forEach(function (otherItem) {
                                    otherItem.classList.remove("open");
        
                                    const otherQuestion =
                                        otherItem.querySelector(
                                            ".quad-faq-question"
                                        );
        
                                    if (otherQuestion) {
                                        otherQuestion.setAttribute(
                                            "aria-expanded",
                                            "false"
                                        );
                                    }
                                });
        
                                if (!isOpen) {
                                    item.classList.add("open");
        
                                    question.setAttribute(
                                        "aria-expanded",
                                        "true"
                                    );
                                }
                            }
                        );
                    });
                });
    } catch (error) {
        console.error("Imsfrane quad module error:", error);
    }
})();


/* ===== PAGE: RAFTING ===== */
(() => {
    if (!document.body.classList.contains("page-rafting")) return;
    try {
        document.addEventListener("DOMContentLoaded", function () {
                    /* =================================================
                       LANGUAGE FALLBACK
                       ================================================= */
        
                    const languageButtons =
                        document.querySelectorAll(".language-button");
        
                    function changeLanguage(language) {
                        document.body.dataset.lang = language;
                        document.documentElement.lang = language;
        
                        languageButtons.forEach(function (button) {
                            const isActive =
                                button.dataset.language === language;
        
                            button.classList.toggle("active", isActive);
        
                            button.setAttribute(
                                "aria-pressed",
                                String(isActive)
                            );
                        });
        
                        localStorage.setItem(
                            "imsfrane-language",
                            language
                        );
                    }
        
                    const savedLanguage =
                        localStorage.getItem("imsfrane-language");
        
                    if (savedLanguage === "fr" || savedLanguage === "en") {
                        changeLanguage(savedLanguage);
                    }
        
                    languageButtons.forEach(function (button) {
                        button.addEventListener("click", function () {
                            changeLanguage(button.dataset.language);
                        });
                    });
        
                    /* =================================================
                       FAQ
                       ================================================= */
        
                    const faqItems =
                        document.querySelectorAll(".rafting-faq-item");
        
                    faqItems.forEach(function (item) {
                        const question =
                            item.querySelector(".rafting-faq-question");
        
                        if (!question) {
                            return;
                        }
        
                        question.addEventListener("click", function () {
                            const isOpen =
                                item.classList.contains("open");
        
                            faqItems.forEach(function (otherItem) {
                                otherItem.classList.remove("open");
        
                                const otherQuestion =
                                    otherItem.querySelector(
                                        ".rafting-faq-question"
                                    );
        
                                if (otherQuestion) {
                                    otherQuestion.setAttribute(
                                        "aria-expanded",
                                        "false"
                                    );
                                }
                            });
        
                            if (!isOpen) {
                                item.classList.add("open");
        
                                question.setAttribute(
                                    "aria-expanded",
                                    "true"
                                );
                            }
                        });
                    });
        
                    /* =================================================
                       HERO SLIDER
                       ================================================= */
        
                    const hero =
                        document.querySelector(".rafting-hero");
        
                    if (!hero) {
                        return;
                    }
        
                    const slides =
                        hero.querySelectorAll(".slide");
        
                    const previousButton =
                        hero.querySelector(".slider-btn.prev");
        
                    const nextButton =
                        hero.querySelector(".slider-btn.next");
        
                    const dotsContainer =
                        hero.querySelector(".slider-dots");
        
                    if (!slides.length || !dotsContainer) {
                        return;
                    }
        
                    let currentSlide = 0;
                    let sliderTimer = null;
        
                    if (!dotsContainer.children.length) {
                        slides.forEach(function (_, index) {
                            const dot =
                                document.createElement("button");
        
                            dot.type = "button";
        
                            dot.className =
                                index === 0
                                    ? "dot active"
                                    : "dot";
        
                            dot.setAttribute(
                                "aria-label",
                                "Open image " + (index + 1)
                            );
        
                            dot.addEventListener("click", function () {
                                showSlide(index);
                                restartSlider();
                            });
        
                            dotsContainer.appendChild(dot);
                        });
                    }
        
                    const dots =
                        dotsContainer.querySelectorAll(".dot");
        
                    function showSlide(index) {
                        slides[currentSlide].classList.remove("active");
        
                        if (dots[currentSlide]) {
                            dots[currentSlide].classList.remove("active");
                        }
        
                        currentSlide =
                            (index + slides.length) % slides.length;
        
                        slides[currentSlide].classList.add("active");
        
                        if (dots[currentSlide]) {
                            dots[currentSlide].classList.add("active");
                        }
                    }
        
                    function nextSlide() {
                        showSlide(currentSlide + 1);
                    }
        
                    function previousSlide() {
                        showSlide(currentSlide - 1);
                    }
        
                    function restartSlider() {
                        window.clearInterval(sliderTimer);
        
                        sliderTimer =
                            window.setInterval(nextSlide, 5000);
                    }
        
                    if (previousButton) {
                        previousButton.addEventListener(
                            "click",
                            function () {
                                previousSlide();
                                restartSlider();
                            }
                        );
                    }
        
                    if (nextButton) {
                        nextButton.addEventListener(
                            "click",
                            function () {
                                nextSlide();
                                restartSlider();
                            }
                        );
                    }
        
                    restartSlider();
                });
    } catch (error) {
        console.error("Imsfrane rafting module error:", error);
    }
})();


/* ===== PAGE: RANDONNEE ===== */
(() => {
    if (!document.body.classList.contains("page-randonnee")) return;
    try {
        document.addEventListener("DOMContentLoaded", function () {
                    const faqItems =
                        document.querySelectorAll(".hiking-faq-item");
        
                    faqItems.forEach(function (item) {
                        const question =
                            item.querySelector(".hiking-faq-question");
        
                        if (!question) {
                            return;
                        }
        
                        question.addEventListener("click", function () {
                            const isOpen =
                                item.classList.contains("open");
        
                            faqItems.forEach(function (otherItem) {
                                otherItem.classList.remove("open");
        
                                const otherQuestion =
                                    otherItem.querySelector(
                                        ".hiking-faq-question"
                                    );
        
                                if (otherQuestion) {
                                    otherQuestion.setAttribute(
                                        "aria-expanded",
                                        "false"
                                    );
                                }
                            });
        
                            if (!isOpen) {
                                item.classList.add("open");
        
                                question.setAttribute(
                                    "aria-expanded",
                                    "true"
                                );
                            }
                        });
                    });
                });
    } catch (error) {
        console.error("Imsfrane randonnee module error:", error);
    }
})();


/* ===== PAGE: VTT ===== */
(() => {
    if (!document.body.classList.contains("page-vtt")) return;
    try {
        document.addEventListener("DOMContentLoaded", function () {
                    /* =================================================
                       FAQ
                       ================================================= */
        
                    const faqItems =
                        document.querySelectorAll(".vtt-faq-item");
        
                    faqItems.forEach(function (item) {
                        const question =
                            item.querySelector(".vtt-faq-question");
        
                        if (!question) {
                            return;
                        }
        
                        question.addEventListener("click", function () {
                            const isOpen =
                                item.classList.contains("open");
        
                            faqItems.forEach(function (otherItem) {
                                otherItem.classList.remove("open");
        
                                const otherQuestion =
                                    otherItem.querySelector(
                                        ".vtt-faq-question"
                                    );
        
                                if (otherQuestion) {
                                    otherQuestion.setAttribute(
                                        "aria-expanded",
                                        "false"
                                    );
                                }
                            });
        
                            if (!isOpen) {
                                item.classList.add("open");
        
                                question.setAttribute(
                                    "aria-expanded",
                                    "true"
                                );
                            }
                        });
                    });
        
                    /* =================================================
                       HERO SLIDER FALLBACK
                       كيخدم إلا ماكانش slider فـ script.js
                       ================================================= */
        
                    const hero =
                        document.querySelector(".vtt-hero");
        
                    if (!hero) {
                        return;
                    }
        
                    const slides =
                        hero.querySelectorAll(".slide");
        
                    const previousButton =
                        hero.querySelector(".slider-btn.prev");
        
                    const nextButton =
                        hero.querySelector(".slider-btn.next");
        
                    const dotsContainer =
                        hero.querySelector(".slider-dots");
        
                    let currentSlide = 0;
                    let sliderTimer = null;
        
                    if (!slides.length) {
                        return;
                    }
        
                    slides.forEach(function (_, index) {
                        const dot =
                            document.createElement("button");
        
                        dot.type = "button";
                        dot.className =
                            index === 0 ? "dot active" : "dot";
        
                        dot.setAttribute(
                            "aria-label",
                            "Open image " + (index + 1)
                        );
        
                        dot.addEventListener("click", function () {
                            showSlide(index);
                            restartSlider();
                        });
        
                        dotsContainer.appendChild(dot);
                    });
        
                    const dots =
                        dotsContainer.querySelectorAll(".dot");
        
                    function showSlide(index) {
                        slides[currentSlide].classList.remove("active");
                        dots[currentSlide].classList.remove("active");
        
                        currentSlide =
                            (index + slides.length) % slides.length;
        
                        slides[currentSlide].classList.add("active");
                        dots[currentSlide].classList.add("active");
                    }
        
                    function nextSlide() {
                        showSlide(currentSlide + 1);
                    }
        
                    function previousSlide() {
                        showSlide(currentSlide - 1);
                    }
        
                    function restartSlider() {
                        window.clearInterval(sliderTimer);
        
                        sliderTimer =
                            window.setInterval(nextSlide, 5000);
                    }
        
                    if (previousButton) {
                        previousButton.addEventListener(
                            "click",
                            function () {
                                previousSlide();
                                restartSlider();
                            }
                        );
                    }
        
                    if (nextButton) {
                        nextButton.addEventListener(
                            "click",
                            function () {
                                nextSlide();
                                restartSlider();
                            }
                        );
                    }
        
                    restartSlider();
                });
    } catch (error) {
        console.error("Imsfrane vtt module error:", error);
    }
})();

/* =========================================================
   FORCE THE OFFICIAL FACEBOOK PAGE URL
   Replaces any legacy Facebook/share URL left in cached or old pages.
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
    const officialFacebookUrl = "https://www.facebook.com/Imsfranecathedrale";

    document.querySelectorAll('a[href*="facebook.com"]').forEach(function (link) {
        link.setAttribute("href", officialFacebookUrl);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
    });
});
