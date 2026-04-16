document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     CURSEUR PERSONNALISÉ (desktop uniquement)
  ===================== */
  const dot  = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  const isMobile = () => window.innerWidth <= 600;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener("mousemove", e => {
    if (isMobile()) return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top  = mouseY + "px";
  });

  function animateRing() {
    if (!isMobile()) {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + "px";
      ring.style.top  = ringY + "px";
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  /* hover sur cliquables */
  const clickables = "a, button, .box, .footer-box, .close-popup, .github-link, .cv";
  document.querySelectorAll(clickables).forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("hovering"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("hovering"));
  });
  document.addEventListener("mousedown", () => document.body.classList.add("clicking"));
  document.addEventListener("mouseup",   () => document.body.classList.remove("clicking"));


  /* =====================
     GLITCH AU HOVER
  ===================== */
  const glitchTargets = document.querySelectorAll(".box h2, .footer-box h2, .main-title");
  glitchTargets.forEach(el => {
    el.closest(".box, .footer-box, .content")?.addEventListener("mouseenter", () => {
      el.classList.add("glitch-active");
      setTimeout(() => el.classList.remove("glitch-active"), 380);
    });
  });


  /* =====================
     GESTION DES POPUPS
  ===================== */
  const overlay = document.getElementById("popup-overlay");
  let currentPopup = null;

  function openPopup(popup, position) {
    /* fermer toute popup déjà ouverte */
    if (currentPopup && currentPopup !== popup) {
      closePopup(currentPopup, false);
    }

    /* positionnement */
    Object.entries(position).forEach(([prop, val]) => popup.style[prop] = val);
    /* reset les props opposées */
    if (!position.left)   popup.style.left   = "";
    if (!position.right)  popup.style.right  = "";
    if (!position.top)    popup.style.top    = "";
    if (!position.bottom) popup.style.bottom = "";

    popup.classList.remove("popup-hidden");
    overlay.classList.add("active");
    currentPopup = popup;

    /* déclencher transition smooth */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => popup.classList.add("visible"));
    });

    /* animer les barres de compétences si popup skills */
    if (popup.id === "skills-popup") animateSkillBars();
  }

  function closePopup(popup, clearOverlay = true) {
    popup.classList.remove("visible");
    setTimeout(() => {
      popup.classList.add("popup-hidden");
      if (clearOverlay) overlay.classList.remove("active");
    }, 250);
    currentPopup = null;
  }

  /* clic sur l'overlay = fermer */
  overlay.addEventListener("click", () => {
    if (currentPopup) closePopup(currentPopup);
  });

  /* ESC = fermer */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && currentPopup) closePopup(currentPopup);
  });

  /* boutons close generiques */
  document.querySelectorAll(".close-popup").forEach(btn => {
    btn.addEventListener("click", () => {
      const popupId = btn.dataset.popup;
      const popup = document.getElementById(popupId);
      if (popup) closePopup(popup);
    });
  });


  /* =====================
     BINDINGS OUVERTURE
  ===================== */
  const bindings = [
    {
      trigger: "profile",
      popup:   "profile-popup",
      pos: () => ({ top: "20px", left: "20px" })
    },
    {
      trigger: "skills",
      popup:   "skills-popup",
      pos: () => ({ top: "20px", right: "20px" })
    },
    {
      trigger: "projpro",
      popup:   "projpro-popup",
      pos: () => ({ bottom: "20px", left: "20px" })
    },
    {
      trigger: "projform",
      popup:   "projform-popup",
      pos: () => ({ bottom: "20px", left: "50%", transform: "translateX(-50%)" })
    },
    {
      trigger: "projperso",
      popup:   "projperso-popup",
      pos: () => ({ bottom: "20px", right: "20px" })
    }
  ];

  bindings.forEach(({ trigger, popup: popupId, pos }) => {
    const triggerEl = document.getElementById(trigger);
    const popupEl   = document.getElementById(popupId);
    if (!triggerEl || !popupEl) return;

    triggerEl.addEventListener("click", () => openPopup(popupEl, pos()));
  });


  /* =====================
     BARRES DE COMPÉTENCES
  ===================== */
  function animateSkillBars() {
    document.querySelectorAll(".skill-fill").forEach(fill => {
      const target = fill.dataset.width;
      /* reset d'abord */
      fill.style.width = "0%";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fill.style.width = target + "%";
        });
      });
    });
  }

});