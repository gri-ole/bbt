"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";

// Simple EN / DE translations (дублируем поведение как на legacy-странице)
const TRANSLATIONS = {
  en: {
    title: "A new BusyBuddy.Toys is on the way",
    description: "We’re crafting a better home for our Montessori wooden toys. Until it’s ready, you can shop our bestsellers on Etsy or send us a message for a custom gift.",
    progressLabel: "Build progress",
    shopOnEtsy: "Shop now",
    instagram: "Follow us",
    contactTitle: "Contact us",
    contactSubtitle: "Need help choosing a toy, looking for a gift, or want something personalized? Send us a message - we’ll get back to you soon.",
    contactName: "Name",
    contactEmail: "Email",
    contactMessage: "Message",
    contactSend: "Send message",
    contactSent: "Thanks! We’ll get back to you soon.",
    contactAria: "Contact form",
    contactPlaceholder: "Tell us the child’s age and what you have in mind…",
    themeToggleToLight: "Switch to light theme",
    themeToggleToDark: "Switch to dark theme",
    visitEtsyAria: "Visit our Etsy shop",
    instagramAria: "Follow us on Instagram",
    languageToggleAria: "Change language",
  },
  de: {
    title: "BusyBuddy.Toys wird gerade neu aufgebaut",
    description:
      "Wir gestalten ein schöneres Zuhause für unsere Montessori-Holzspielzeuge. Bis dahin kannst du unsere Bestseller auf Etsy kaufen oder uns für ein personalisiertes Geschenk schreiben.",
    progressLabel: "Baufortschritt",
    shopOnEtsy: "Jetzt einkaufen",
    instagram: "Folge uns",
    contactTitle: "Kontakt",
    contactSubtitle: "Du brauchst Hilfe bei der Auswahl, suchst ein Geschenk oder möchtest etwas personalisieren? Schreib uns - wir antworten schnell.",
    contactName: "Name",
    contactEmail: "Email",
    contactMessage: "Nachricht",
    contactSend: "Nachricht senden",
    contactSent: "Danke! Wir melden uns bald.",
    contactAria: "Kontaktformular",
    contactPlaceholder: "Sag uns das Alter des Kindes und was du dir vorstellst...",
    themeToggleToLight: "Zum hellen Design wechseln",
    themeToggleToDark: "Zum dunklen Design wechseln",
    visitEtsyAria: "Besuche unseren Etsy-Shop",
    instagramAria: "Folge uns auf Instagram",
    languageToggleAria: "Sprache ändern",
  },
};

const START_DATE = new Date("2026-02-20T00:00:00");
const END_DATE = new Date("2026-05-01T23:59:59");

function isNightTime() {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 17 || hour < 9;
}

function getProgress() {
  const now = new Date();
  const total = END_DATE.getTime() - START_DATE.getTime();
  const elapsed = now.getTime() - START_DATE.getTime();
  if (total <= 0) return 100;
  const raw = (elapsed / total) * 100;
  return Math.max(0, Math.min(100, raw));
}

export default function LandingClient() {
  const [isDark, setIsDark] = useState(isNightTime());
  const [language, setLanguage] = useState("en");
  const [progress, setProgress] = useState(() => getProgress());
  const [displayProgress, setDisplayProgress] = useState(0);
  const [sent, setSent] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const etsyRef = useRef(null);
  const fullCardRef = useRef(null);
  const mainPanelRef = useRef(null);
  const formPanelRef = useRef(null);
  const formShellRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const progressRef = useRef(null);
  const progressFillRef = useRef(null);
  const instagramRef = useRef(null);
  const socialRef = useRef(null);
  const cardContentRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const scrollIndicatorInnerRef = useRef(null);
  const popupRef = useRef(null);
  const popupOverlayRef = useRef(null);
  const formRef = useRef(null);
  const submitButtonRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      const value = getProgress();
      setProgress(value);
      setDisplayProgress(Math.round(value));
    };
    tick();
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, []);


  // Initial loading animation for progress bar (respect prefers-reduced-motion)
  useEffect(() => {
    const el = progressFillRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = Math.round(getProgress());
    if (prefersReduced) {
      // Без анимации: сразу ставим актуальное значение
      el.style.width = `${target}%`;
      setDisplayProgress(target);
      return;
    }
    gsap.fromTo(
      el,
      { width: '0%' },
      { width: `${target}%`, duration: 1.2, ease: 'power2.out' }
    );
    const counter = { value: 0 };
    gsap.to(counter, {
      value: target,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayProgress(Math.round(counter.value));
      },
    });
  }, []);

  useEffect(() => {
    const check = () => setIsDark(isNightTime());
    check();
    const id = setInterval(check, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // GSAP day/night toggle animation for the card and toggle button
  useEffect(() => {
    const card = fullCardRef.current;
    const toggleBtn = document.querySelector(".theme-toggle");
    if (!card) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // небольшое покачивание и лёгкое "дышание" карточки при смене темы
    gsap.fromTo(
      card,
      {
        scale: 0.97,
        rotationX: isDark ? -6 : 6,
        rotationY: isDark ? 4 : -4,
        y: isDark ? -6 : 6,
      },
      {
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }
    );

    if (toggleBtn) {
      gsap.fromTo(
        toggleBtn,
        { rotation: isDark ? -90 : 90, scale: 0.85 },
        { rotation: 0, scale: 1, duration: 0.45, ease: "back.out(1.6)" }
      );
    }
  }, [isDark]);

  const logoPath = isDark ? "/media/bw_transperrent-02.png" : "/media/bw_transperrent-01.png";
  const roundedProgress = Math.round(progress);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const renderFlyWords = (text) => {
    const words = String(text || "").split(" ").filter(Boolean);
    return words.map((w, idx) => (
      <span key={`${idx}-${w}`} className="fly-word" data-word-idx={idx} aria-hidden="true">
        {w}
        {idx < words.length - 1 ? " " : ""}
      </span>
    ));
  };

  // GSAP scroll transition animation (content swap inside the same card)
  // При смене языка пересоздаём, чтобы работать с актуальными span-ами,
  // но сам матричный эффект вынесен в отдельный эффект ниже.
  useEffect(() => {
    const fullCard = fullCardRef.current;
    const mainPanel = mainPanelRef.current;
    const formPanel = formPanelRef.current;
    const formShell = formShellRef.current;
    const titleEl = titleRef.current;
    const descEl = descRef.current;
    const progressEl = progressRef.current;
    const socialEl = socialRef.current;
    const etsyEl = etsyRef.current;
    const instagramEl = instagramRef.current;
    const scrollIndicatorEl = scrollIndicatorRef.current;
    const scrollIndicatorInnerEl = scrollIndicatorInnerRef.current;

    if (
      !fullCard ||
      !mainPanel ||
      !formPanel ||
      !formShell ||
      !titleEl ||
      !descEl ||
      !progressEl ||
      !socialEl
    )
      return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 3D setup
    gsap.set([titleEl, descEl, progressEl, socialEl, etsyEl, instagramEl], {
      transformPerspective: 900,
      transformOrigin: "50% 50%",
    });

    const titleWords = Array.from(titleEl.querySelectorAll(".fly-word"));
    const descWords = Array.from(descEl.querySelectorAll(".fly-word"));

    const rand01 = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    let vw = window.innerWidth || 1200;
    let vh = window.innerHeight || 800;

    const makeScatter = (nodes, baseX, baseY) =>
      nodes.map((_, i) => {
        const r1 = rand01(100 + i * 13.1);
        const r2 = rand01(200 + i * 17.7);
        const r3 = rand01(300 + i * 19.9);
        const r4 = rand01(400 + i * 23.3);
        const r5 = rand01(500 + i * 29.7);
        const r6 = rand01(600 + i * 31.9);
        const r7 = rand01(700 + i * 37.1);

        // Push words far beyond the card - across the whole viewport
        const dirX = (r1 * 2 - 1) * baseX * (0.85 + i / Math.max(6, nodes.length));
        const dirY = (r2 * 2 - 1) * baseY * (0.85 + i / Math.max(6, nodes.length));
        const z = (r3 * 2 - 1) * 700;
        const rx = (r4 * 2 - 1) * 75;
        const ry = (r5 * 2 - 1) * 75;
        const rot = (r6 * 2 - 1) * 40;
        const scale = 1.0 + r7 * 2.0; // grows up to ~3.0

        return { x: dirX, y: dirY, z, rx, ry, rot, scale };
      });

    let titleScatter = makeScatter(titleWords, vw * 0.95, vh * 0.75);
    let descScatter = makeScatter(descWords, vw * 0.85, vh * 0.65);

    const rebuildScatter = () => {
      vw = window.innerWidth || vw;
      vh = window.innerHeight || vh;
      titleScatter = makeScatter(titleWords, vw * 0.95, vh * 0.75);
      descScatter = makeScatter(descWords, vw * 0.85, vh * 0.65);
    };
    window.addEventListener("resize", rebuildScatter, { passive: true });

    const cardContent = cardContentRef.current;
    if (!cardContent) return;

    // We'll animate the card height by animating card-content height between
    // the main panel height and the contact form height. This keeps top/bottom
    // paddings symmetric and avoids empty space.
    let mainH = 0;
    let formH = 0;

    const measureHeights = () => {
      // temporarily let content size naturally for accurate measurements
      const prev = cardContent.style.height;
      cardContent.style.height = "auto";

      // main panel is in-flow; form shell sizes to its content even though the panel is absolute
      mainH = Math.ceil(mainPanel.getBoundingClientRect().height);
      formH = Math.ceil(formShell.getBoundingClientRect().height);

      // restore
      cardContent.style.height = prev || "";
    };

    measureHeights();
    gsap.set(cardContent, { height: mainH });
    gsap.set(fullCard, { scale: 1, transformOrigin: "50% 50%" });
    gsap.set(mainPanel, { opacity: 1, pointerEvents: "auto" });
    gsap.set(formPanel, { opacity: 0, pointerEvents: "none", x: 0, y: 0 });
    gsap.set(formShell, { scale: 0.96 });
    
    const updateMousePosition = () => {
      if (scrollIndicatorEl && fullCard) {
        // Используем высоту только первой панели (mainH), которая уже измерена
        // Получаем padding карточки для точного расчета
        const cardStyle = window.getComputedStyle(fullCard);
        const paddingTop = parseFloat(cardStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(cardStyle.paddingBottom) || 0;
        // Высота первой карточки = высота панели + padding сверху и снизу
        // Используем mainH, который измеряется в measureHeights()
        const firstCardHeight = mainH + paddingTop + paddingBottom;
        // Позиционируем мышь под первой карточкой, но не ниже экрана
        let mouseTop = window.innerHeight / 2 + firstCardHeight / 2 + 70;
        const maxTop = window.innerHeight - 60;
        if (mouseTop > maxTop) mouseTop = maxTop;
        // Обновляем только позицию, не трогаем opacity (управляется через handleScroll)
        gsap.set(scrollIndicatorEl, { 
          top: `${mouseTop}px`
        });
      }
    };
    
    updateMousePosition();

    // Scroll handler - progress-based transition
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll)); // 0 to 1 (0% to 100%)
      
      // Transition progress: if scroll is 30%, transition should be 20%
      // Formula: transitionProgress = scrollProgress * (20/30) = scrollProgress * 0.666...
      // But we want full transition (100%) to be possible at 100% scroll
      // So we need: when scrollProgress = 1, transitionProgress = 1
      // But also: when scrollProgress = 0.3, transitionProgress = 0.2
      // This means: transitionProgress = scrollProgress * (1 / 0.666...) = scrollProgress * 1.5
      // But then at 30% scroll: 0.3 * 1.5 = 0.45 (45%), not 20%
      // 
      // Better approach: use the ratio 20/30 = 2/3, but scale it so max is 1
      // If we want 30% scroll = 20% transition AND 100% scroll = 100% transition:
      // transitionProgress = scrollProgress * (20/30) when scrollProgress <= 0.3
      // transitionProgress = 0.2 + (scrollProgress - 0.3) * (0.8 / 0.7) when scrollProgress > 0.3
      // Or simpler: use smooth curve that respects both points
      let transitionProgress;
      if (scrollProgress <= 0.3) {
        // Linear: 30% scroll = 20% transition
        transitionProgress = scrollProgress * (20 / 30);
      } else {
        // Continue to 100% transition at 100% scroll
        const remainingScroll = scrollProgress - 0.3;
        const remainingTransition = 1 - 0.2; // 0.8
        transitionProgress = 0.2 + (remainingScroll / 0.7) * remainingTransition;
      }
      transitionProgress = Math.min(1, Math.max(0, transitionProgress));

      // Reduced motion: simple crossfade only
      if (prefersReduced) {
        gsap.set(mainPanel, {
          opacity: 1 - transitionProgress,
          pointerEvents: transitionProgress < 0.5 ? "auto" : "none",
        });
        gsap.set(formPanel, {
          opacity: transitionProgress,
          pointerEvents: transitionProgress >= 0.5 ? "auto" : "none",
        });
        if (scrollIndicatorEl) {
          // Мышь должна быть скрыта, если форма видна (transitionProgress >= 0.5)
          const mouseOpacity = transitionProgress >= 0.5 ? 0 : (1 - transitionProgress);
          gsap.set(scrollIndicatorEl, { opacity: mouseOpacity });
          if (scrollIndicatorInnerEl)
            gsap.set(scrollIndicatorInnerEl, {
              scale: transitionProgress >= 0.5 ? 1.3 : (1 + 0.3 * transitionProgress),
              y: 0,
            });
        }
        return;
      }

      const p = transitionProgress;
      const outOpacity = 1 - p;

      // Animate available content height so the form fits inside the glass box
      const contentH = Math.round(mainH + (formH - mainH) * p);
      gsap.set(cardContent, { height: contentH });

      // MAIN content "flies away" (3D scatter + grow)
      if (titleWords.length) {
        titleWords.forEach((node, i) => {
          const s = titleScatter[i];
          gsap.set(node, {
            x: s.x * p,
            y: s.y * p,
            z: s.z * p,
            rotationX: s.rx * p,
            rotationY: s.ry * p,
            rotation: s.rot * p,
            scale: 1 + (s.scale - 1) * p,
            opacity: outOpacity,
          });
        });
      } else {
        gsap.set(titleEl, {
          x: -90 * p,
          y: -60 * p,
          z: 120 * p,
          rotationX: 22 * p,
          rotationY: -18 * p,
          scale: 1 + 0.35 * p,
          opacity: outOpacity,
        });
      }

      if (descWords.length) {
        descWords.forEach((node, i) => {
          const s = descScatter[i];
          gsap.set(node, {
            x: s.x * p,
            y: s.y * p,
            z: s.z * p,
            rotationX: s.rx * p,
            rotationY: s.ry * p,
            rotation: s.rot * p,
            scale: 1 + (s.scale - 1) * p,
            opacity: outOpacity,
          });
        });
      } else {
        gsap.set(descEl, {
          x: -70 * p,
          y: -45 * p,
          z: 90 * p,
          rotationX: 16 * p,
          rotationY: -12 * p,
          scale: 1 + 0.22 * p,
          opacity: outOpacity,
        });
      }

      gsap.set(progressEl, {
        x: -55 * p,
        y: -25 * p,
        z: 70 * p,
        rotationX: 14 * p,
        rotationY: 10 * p,
        scale: 1 + 0.18 * p,
        opacity: outOpacity,
      });

      gsap.set(socialEl, { opacity: outOpacity });

      if (scrollIndicatorEl) {
        // Мышь должна быть скрыта, если форма видна (transitionProgress >= 0.5)
        const mouseOpacity = p >= 0.5 ? 0 : outOpacity;
        gsap.set(scrollIndicatorEl, { opacity: mouseOpacity });
        if (scrollIndicatorInnerEl)
          gsap.set(scrollIndicatorInnerEl, {
            scale: p >= 0.5 ? 1.5 : (1 + 0.5 * p),
            y: p >= 0.5 ? 24 : (24 * p),
          });
      }

      if (etsyEl)
        gsap.set(etsyEl, {
          x: -140 * p,
          y: 55 * p,
          z: 140 * p,
          rotationX: -18 * p,
          rotationY: 22 * p,
          rotation: -14 * p,
          scale: 1 + 0.25 * p,
          opacity: outOpacity,
        });
      if (instagramEl)
        gsap.set(instagramEl, {
          x: -120 * p,
          y: 70 * p,
          z: 120 * p,
          rotationX: 16 * p,
          rotationY: -18 * p,
          rotation: 12 * p,
          scale: 1 + 0.22 * p,
          opacity: outOpacity,
        });

      gsap.set(mainPanel, { pointerEvents: p < 0.5 ? "auto" : "none" });

      // FORM: just fade in (no movement / no stagger)
      gsap.set(formPanel, {
        opacity: p,
        x: 0,
        y: 0,
        pointerEvents: p >= 0.5 ? "auto" : "none",
      });

      gsap.set(formShell, {
        scale: 0.96 + 0.06 * p,
      });

    };

    // Throttle scroll for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    window.addEventListener("resize", updateMousePosition);
    handleScroll(); // Check initial state

    const ro = new ResizeObserver(() => {
      measureHeights();
      handleScroll();
      updateMousePosition();
    });
    ro.observe(mainPanel);
    ro.observe(formShell);

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      window.removeEventListener("resize", rebuildScatter);
      window.removeEventListener("resize", updateMousePosition);
      ro.disconnect();
      gsap.set(cardContent, { height: "" });
    };
  }, [language]);

  // Matrix-style scramble on language change for title & description и UI-текстов.
  // Используем useLayoutEffect, чтобы эффект применялся до отрисовки нового текста,
  // иначе видно "сначала перевод, потом матрица".
  useLayoutEffect(() => {
    const titleEl = titleRef.current;
    const descEl = descRef.current;
    const progressEl = progressRef.current;
    const etsyEl = etsyRef.current;
    const instagramEl = instagramRef.current;
    const formShellEl = formShellRef.current;
    if (!titleEl || !descEl) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const nodes = [
      ...Array.from(titleEl.querySelectorAll(".fly-word")),
      ...Array.from(descEl.querySelectorAll(".fly-word")),
      ...(progressEl ? Array.from(progressEl.querySelectorAll(".fly-word")) : []),
      ...(etsyEl ? Array.from(etsyEl.querySelectorAll(".fly-word")) : []),
      ...(instagramEl ? Array.from(instagramEl.querySelectorAll(".fly-word")) : []),
      ...(formShellEl ? Array.from(formShellEl.querySelectorAll(".fly-word")) : []),
    ];
    if (!nodes.length) return;

    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    // Фиксируем ширину, чтобы не прыгали строки во время эффекта
    const widths = nodes.map((node) => {
      const el = node;
      const prevDisplay = el.style.display;
      const prevWidth = el.style.width;
      el.style.display = "inline-block";
      el.style.width = "auto";
      const w = el.getBoundingClientRect().width;
      el.style.width = `${w}px`;
      el.style.display = prevDisplay || "inline-block";
      return { el, width: w, prevDisplay, prevWidth };
    });

    nodes.forEach((node, index) => {
      const finalText = node.textContent;
      const length = finalText.length;
      if (!length) return;

      // Не трогаем слова, которые должны быть визуально стабильными
      // (например, брендовые/ключевые: Montessori, BusyBuddy)
      const stableWord = /montessori/i.test(finalText) || /busybuddy/i.test(finalText);
      if (stableWord) {
        const widthInfo = widths[index];
        if (widthInfo && widthInfo.el === node) {
          requestAnimationFrame(() => {
            node.style.width = widthInfo.prevWidth || "auto";
            node.style.display = widthInfo.prevDisplay || "";
          });
        }
        return;
      }

      // Мгновенно ставим начальное \"зашумлённое\" состояние,
      // чтобы пользователь не видел голый переведённый текст до старта анимации.
      {
        let scrambled = "";
        for (let i = 0; i < length; i++) {
          const ch = finalText[i];
          if (ch === " ") {
            scrambled += " ";
          } else {
            scrambled += matrixChars[Math.floor(Math.random() * matrixChars.length)];
          }
        }
        node.textContent = scrambled;
      }

      const counter = { progress: 0 };

      gsap.to(counter, {
        progress: 1,
        duration: 0.45,
        delay: 0,
        ease: "power1.out",
        onUpdate: () => {
          const p = counter.progress;
          const reveal = Math.floor(length * p);
          let out = "";
          for (let i = 0; i < length; i++) {
            const ch = finalText[i];
            if (ch === " ") {
              out += " ";
            } else if (i < reveal) {
              out += ch;
            } else {
              out += matrixChars[Math.floor(Math.random() * matrixChars.length)];
            }
          }
          node.textContent = out;
        },
        onComplete: () => {
          node.textContent = finalText;
          const widthInfo = widths[index];
          if (widthInfo && widthInfo.el === node) {
            requestAnimationFrame(() => {
              node.style.width = widthInfo.prevWidth || "auto";
              node.style.display = widthInfo.prevDisplay || "";
            });
          }
        },
      });
    });

    // cleanup не нужен: gsap-сущности сами доезжают до конца и мы возвращаем ширину в onComplete
  }, [language]);

  // Manage focus for popup accessibility
  useEffect(() => {
    if (showPopup) {
      // Переводим фокус на попап
      if (popupRef.current) popupRef.current.focus?.();
    } else {
      // Возвращаем фокус на кнопку отправки, если она есть
      if (submitButtonRef.current) submitButtonRef.current.focus?.();
    }
  }, [showPopup]);

  // Popup animation (respect prefers-reduced-motion)
  useEffect(() => {
    const popup = popupRef.current;
    const overlay = popupOverlayRef.current;
    
    if (!popup || !overlay) return;
    
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (showPopup) {
      overlay.style.display = 'flex';
      if (prefersReduced) {
        overlay.style.opacity = '1';
        popup.style.opacity = '1';
        popup.style.transform = 'translateY(0) scale(1)';
        return;
      }
      gsap.fromTo(overlay, 
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(popup,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    } else {
      if (prefersReduced) {
        overlay.style.opacity = '0';
        overlay.style.display = 'none';
        popup.style.opacity = '0';
        popup.style.transform = 'translateY(20px) scale(0.95)';
        return;
      }
      gsap.to(overlay, { 
        opacity: 0, 
        duration: 0.2, 
        ease: 'power2.in',
        onComplete: () => {
          if (overlay) overlay.style.display = 'none';
        }
      });
      gsap.to(popup, { 
        opacity: 0, 
        scale: 0.95, 
        y: 20, 
        duration: 0.2, 
        ease: 'power2.in' 
      });
    }
  }, [showPopup]);

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setShowPopup(true);
    // Очищаем форму после успешной отправки
    if (formRef.current) {
      formRef.current.reset();
    }
    // Автоматически закрываем попап через 3 секунды
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  return (
    <div className={"under-construction " + (isDark ? "dark" : "light")}>
      {/* Video background */}
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="/media/busybuddy-bg.webm" type="video/webm" />
        </video>
        <div className="video-overlay"></div>
        <div className="video-fallback"></div>
      </div>

      {/* Full Card */}
      <div ref={fullCardRef} className="construction-card">
        <div className="card-header">
          <img src={logoPath} alt="BusyBuddy.Toys" className="logo" />
          <div className="header-controls">
            <button
              className="language-toggle"
              onClick={() => setLanguage((prev) => (prev === "en" ? "de" : "en"))}
              aria-label={t.languageToggleAria}
              type="button"
            >
              <img
                src={language === "en" ? "/media/DE.png" : "/media/GB.png"}
                alt={language === "en" ? "Deutsch" : "English"}
                className="language-flag"
              />
            </button>
            <button
              className="theme-toggle"
              onClick={() => setIsDark((v) => !v)}
              aria-label={isDark ? t.themeToggleToLight : t.themeToggleToDark}
              type="button"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        <div ref={cardContentRef} className="card-content">
          {/* Panel 1: main content */}
          <div ref={mainPanelRef} className="card-panel card-panel-main">
            <h1 ref={titleRef} aria-label={t.title}>
              {renderFlyWords(t.title)}
            </h1>
            <p ref={descRef} aria-label={t.description}>
              {renderFlyWords(t.description)}
            </p>

            <div
              ref={progressRef}
              className="progress-section"
              role="progressbar"
              aria-valuenow={roundedProgress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div className="progress-label">
                <span aria-label={t.progressLabel}>
                  {renderFlyWords(t.progressLabel)}
                </span>
                <span className="progress-percent" aria-live="polite" aria-label={`${displayProgress}%`}>
                  {renderFlyWords(`${displayProgress}%`)}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  ref={progressFillRef}
                  className="progress-fill"
                  style={{ width: `${displayProgress}%` }}
                  aria-hidden="true"
                ></div>
              </div>
            </div>

            <div ref={socialRef} className="social-links">
              <a
                ref={etsyRef}
                href="https://www.etsy.com/shop/BusyBuddyToysEU"
                target="_blank"
                rel="noopener noreferrer"
                className="etsy-button"
                aria-label={t.visitEtsyAria}
              >
                <img src="/media/etsy-logo.png" alt="" aria-hidden="true" />
                <span className="etsy-text" aria-label={t.shopOnEtsy}>
                  {renderFlyWords(t.shopOnEtsy)}
                </span>
              </a>
              <a
                ref={instagramRef}
                href="https://www.instagram.com/busybuddy.toys"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-button"
                aria-label={t.instagramAria}
              >
                <img src="/media/instagram-logo.png" alt="" aria-hidden="true" />
                <span className="social-link-text" aria-label={t.instagram}>
                  {renderFlyWords(t.instagram)}
                </span>
              </a>
            </div>
          </div>

          {/* Panel 2: contact form */}
          <div
            ref={formPanelRef}
            className="card-panel card-panel-form"
            aria-label={t.contactAria}
          >
            <div ref={formShellRef} className="form-shell">
              <div className="form-copy" data-form-field>
                <h2 className="form-title">
                  <span aria-label={t.contactTitle}>
                    {renderFlyWords(t.contactTitle)}
                  </span>
                  <br />
                  <span className="form-title-brand">BusyBuddy.Toys</span>
                </h2>
                <p className="form-subtitle" aria-label={t.contactSubtitle}>
                  {renderFlyWords(t.contactSubtitle)}
                </p>
                <div className="form-contact-grid">
                  <div className="form-contact-item form-contact-email">
                    <div className="form-contact-icon">
                      <img src="/media/email.png" alt="" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="form-contact-label">E-mail</div>
                      <button
                        type="button"
                        className="form-contact-email"
                        onClick={() => setShowEmail(true)}
                      >
                        <span
                          className={
                            "form-contact-value" + (showEmail ? "" : " blurred-email")
                          }
                        >
                          {showEmail ? "info@busybuddy.toys" : "info***@busybuddy.toys"}
                        </span>
                        {!showEmail && <span className="form-contact-click">click</span>}
                      </button>
                    </div>
                  </div>
                  <div className="form-contact-item form-contact-instagram">
                    <div className="form-contact-icon">
                      <img src="/media/instagram-logo.png" alt="" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="form-contact-label">Instagram</div>
                      <a
                        href="https://www.instagram.com/busybuddy.toys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="form-contact-value"
                      >
                        @busybuddy.toys
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <form ref={formRef} className="contact-form" onSubmit={onSubmit}>
                <div className="contact-field" data-form-field>
                  <label
                    className="ui-label"
                    htmlFor="contact-name"
                    aria-label={t.contactName}
                  >
                    {renderFlyWords(t.contactName)}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="ui-input"
                  />
                </div>
                <div className="contact-field" data-form-field>
                  <label
                    className="ui-label"
                    htmlFor="contact-email"
                    aria-label={t.contactEmail}
                  >
                    {renderFlyWords(t.contactEmail)}
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="ui-input"
                  />
                </div>
                <div className="contact-field" data-form-field>
                  <label
                    className="ui-label"
                    htmlFor="contact-message"
                    aria-label={t.contactMessage}
                  >
                    {renderFlyWords(t.contactMessage)}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    className="ui-textarea"
                    placeholder={t.contactPlaceholder}
                  />
                </div>
                <button
                  ref={submitButtonRef}
                  className="contact-submit ui-button"
                  type="submit"
                  data-form-field
                  aria-label={t.contactSend}
                >
                  {renderFlyWords(t.contactSend)}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div ref={scrollIndicatorRef} className="scroll-indicator">
        <div ref={scrollIndicatorInnerRef} className="scroll-downs">
          <div className="mousey">
            <div className="scroller"></div>
          </div>
        </div>
      </div>
      
      {/* Success Popup */}
      <div 
        ref={popupOverlayRef}
        className="success-popup-overlay" 
        onClick={() => setShowPopup(false)}
        style={{ display: 'none' }}
      >
        <div 
          ref={popupRef}
          className="success-popup" 
          onClick={(e) => e.stopPropagation()}
        >
          <p className="success-popup-text">{t.contactSent}</p>
        </div>
      </div>
    </div>
  );
}

