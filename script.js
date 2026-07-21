(function () {
    "use strict";

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const header = document.querySelector(".site-header");
    const toTop = document.getElementById("toTop");

    const onScroll = () => {
        const y = window.scrollY;
        header.classList.toggle("is-scrolled", y > 20);
        if (toTop) toTop.classList.toggle("is-visible", y > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (toTop) {
        toTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    const toggle = document.querySelector(".nav__toggle");
    const menu = document.getElementById("nav-menu");

    const closeMenu = () => {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú de navegación");
    };

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            const open = menu.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(open));
            toggle.setAttribute(
                "aria-label",
                open ? "Cerrar menú de navegación" : "Abrir menú de navegación"
            );
        });

        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && menu.classList.contains("is-open")) {
                closeMenu();
                toggle.focus();
            }
        });

        document.addEventListener("click", (e) => {
            if (
                menu.classList.contains("is-open") &&
                !menu.contains(e.target) &&
                !toggle.contains(e.target)
            ) {
                closeMenu();
            }
        });
    }

    const revealEls = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && !prefersReducedMotion) {
        const io = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        entry.target.style.transitionDelay = `${(i % 4) * 80}ms`;
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
        );
        revealEls.forEach((el) => io.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add("is-visible"));
    }

    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll('.nav__menu a[href^="#"]');

    if ("IntersectionObserver" in window && sections.length) {
        const spy = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute("id");
                        navLinks.forEach((l) =>
                            l.classList.toggle(
                                "is-active",
                                l.getAttribute("href") === `#${id}`
                            )
                        );
                    }
                });
            },
            { threshold: 0.5 }
        );
        sections.forEach((s) => spy.observe(s));
    }

    const petalContainer = document.querySelector(".hero__petals");
    const petalColors = ["#e9b8b0", "#f6dcd8", "#c98a7a", "#efe3d3"];

    function spawnPetal() {
        if (!petalContainer || document.hidden) return;
        const petal = document.createElement("span");
        petal.className = "petal";
        const size = 8 + Math.random() * 12;
        petal.style.left = Math.random() * 100 + "%";
        petal.style.width = size + "px";
        petal.style.height = size + "px";
        petal.style.background =
            petalColors[Math.floor(Math.random() * petalColors.length)];
        petal.style.animationDuration = 6 + Math.random() * 6 + "s";
        petal.style.opacity = String(0.4 + Math.random() * 0.5);
        petalContainer.appendChild(petal);
        setTimeout(() => petal.remove(), 12000);
    }

    if (petalContainer && !prefersReducedMotion) {
        for (let i = 0; i < 5; i++) setTimeout(spawnPetal, i * 600);
        setInterval(spawnPetal, 1400);
    }

    const form = document.querySelector(".contact__form");
    const status = document.querySelector(".form__status");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = form.querySelector("#name");
            const email = form.querySelector("#email");

            const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

            if (!name.value.trim() || !emailOk) {
                status.textContent =
                    "Por favor, completa tu nombre y un correo válido.";
                status.style.color = "var(--sakura-deep)";
                return;
            }

            status.textContent = `¡Gracias, ${name.value.trim()}! Hemos recibido tu reserva 🌸`;
            status.style.color = "var(--matcha)";
            form.reset();
            const people = form.querySelector("#people");
            if (people) people.value = 2;
        });
    }

    const lightboxTriggers = document.querySelectorAll(".gallery__item, .card__art");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");
    let lastFocused = null;

    const openLightbox = (item) => {
        const img = item.querySelector("img");
        const caption =
            item.querySelector("figcaption") ||
            item.closest(".card")?.querySelector(".card__title");
        if (!img) return;
        lastFocused = item;
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt || "";
        lightboxCaption.textContent = caption ? caption.textContent : "";
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
        lightboxClose.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove("is-open");
        document.body.style.overflow = "";
        if (lastFocused) lastFocused.focus();
    };

    if (lightbox && lightboxTriggers.length) {
        lightboxTriggers.forEach((item) => {
            item.addEventListener("click", () => openLightbox(item));
            item.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(item);
                }
            });
        });

        lightboxClose.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
                closeLightbox();
            }
        });
    }
})();
