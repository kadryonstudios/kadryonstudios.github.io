/* Shared language switcher for Kadryon HTML pages.
   Mark page text with data-i18n="key" and add this file to the page to localize it. */
(function () {
  "use strict";

  var copy = {
    tr: {
      navProjects: "Projeler", navContact: "İletişim", heroTitle: "Her seferinde yeni dünyalar.",
      heroDescription: "Efe Yıldız tarafından kurulan Kadryon bir yazılım stüdyosudur. Roblox oyunları, haritaları ve scriptleri geliştiriyoruz.",
      explore: "Projelerimizi keşfet", joinDiscord: "Discord'a katıl", serviceSoftware: "Yazılım geliştirme",
      serviceGames: "Roblox oyunları", serviceMaps: "Haritalar", serviceScripts: "Scriptler",
      contactTitle: "Birlikte çalışalım.", contactDescription: "Roblox oyunları, haritaları, scriptleri veya yazılım projeleri için bize ulaşın.",
      featureTitle: "Fikirleri deneyimlere dönüştürüyoruz.", featureDescription: "Efe Yıldız tarafından kurulan Kadryon; Roblox oyunları, haritaları ve scriptleri geliştiren bir yazılım stüdyosudur.",
      projectsTitle: "Projelerimiz.", projectsDescription: "Kadryon tarafından geliştirilen Roblox oyunları, haritalar ve scriptler.", backHome: "Ana sayfaya dön",
      projectsLabel: "Roblox projeleri", ourServices: "Hizmetlerimiz", robloxDevelopment: "Roblox geliştirme",
      servicesDescription: "Etkileşimli fikirleri hayata geçirmek için Roblox oyunları geliştiriyor, haritalar tasarlıyor ve scriptler yazıyoruz.",
      games: "Oyunlar", maps: "Haritalar", scripts: "Scriptler", workWithUs: "Bizimle çalışın",
      builtWithCare: "Özenle geliştirildi.", careDescription: "Özenli oynanışa, detaylı haritalara ve güvenilir scriptlere odaklanıyoruz.",
      foundedBy: "Efe Yıldız tarafından kuruldu.", companyDescription: "Kadryon, yazılım geliştirmeyi Roblox yaratıcılığıyla buluşturuyor.",
      disclaimer: "Kadryon bağımsız bir yazılım stüdyosudur ve Roblox Corporation ile bağlantısı yoktur.",
      titleHome: "Kadryon Studios | Roblox Oyun, Harita ve Yazılım Geliştirme",
      descriptionHome: "Kadryon Studios, Efe Yıldız tarafından kurulan bir yazılım stüdyosudur. Roblox oyunları, haritaları ve scriptleri geliştiriyoruz.",
      titleProjects: "Projeler | Kadryon Studios — Roblox Oyunları ve Haritalar",
      descriptionProjects: "Kadryon Studios projelerini keşfedin: Roblox oyun geliştirme, özgün harita tasarımı ve script hizmetleri."
    },
    en: {
      navProjects: "Projects", navContact: "Contact", heroTitle: "Worlds, one at a time.",
      heroDescription: "Kadryon is a software company founded by Efe Yıldız. We create Roblox games, maps, and scripts.",
      explore: "Explore our work", joinDiscord: "Join the Discord", serviceSoftware: "Software development",
      serviceGames: "Roblox games", serviceMaps: "Maps", serviceScripts: "Scripts",
      contactTitle: "Let’s work together.", contactDescription: "Contact us about Roblox games, maps, scripts, or software projects.",
      featureTitle: "Ideas into experiences.", featureDescription: "Founded by Efe Yıldız, Kadryon is a software company creating Roblox games, maps, and scripts.",
      projectsTitle: "Our projects.", projectsDescription: "Roblox games, maps, and scripts made by Kadryon.", backHome: "Back to home",
      projectsLabel: "Roblox projects", ourServices: "Our services", robloxDevelopment: "Roblox development",
      servicesDescription: "We create Roblox games, design maps, and develop scripts to bring interactive ideas to life.",
      games: "Games", maps: "Maps", scripts: "Scripts", workWithUs: "Work with us",
      builtWithCare: "Built with care.", careDescription: "We focus on thoughtful gameplay, detailed maps, and reliable scripts.",
      foundedBy: "Founded by Efe Yıldız.", companyDescription: "Kadryon brings software development and Roblox creativity together.",
      disclaimer: "Kadryon is an independent software company and is not affiliated with Roblox Corporation.",
      titleHome: "Kadryon Studios | Roblox Game, Map and Software Development",
      descriptionHome: "Kadryon is a software company founded by Efe Yıldız, creating Roblox games, maps, and scripts.",
      titleProjects: "Projects | Kadryon Studios — Roblox Games and Maps",
      descriptionProjects: "Explore Kadryon's Roblox games, maps, and scripts."
    }
  };

  function applyLanguage(language, rememberChoice) {
    language = language === "tr" ? "tr" : "en";
    var strings = copy[language];
    document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      var key = element.getAttribute("data-i18n");
      if (strings[key]) element.textContent = strings[key];
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (element) {
      var label = strings[element.getAttribute("data-i18n-aria")];
      if (label) element.setAttribute("aria-label", label);
    });
    var projectPage = /(?:^|\/)projects\.html$/.test(location.pathname);
    var title = projectPage ? strings.titleProjects : strings.titleHome;
    var description = projectPage ? strings.descriptionProjects : strings.descriptionHome;
    document.title = title;
    var descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) descriptionMeta.content = description;
    ["og:title", "twitter:title"].forEach(function (name) {
      var meta = document.querySelector('meta[property="' + name + '"],meta[name="' + name + '"]');
      if (meta) meta.content = title;
    });
    ["og:description", "twitter:description"].forEach(function (name) {
      var meta = document.querySelector('meta[property="' + name + '"],meta[name="' + name + '"]');
      if (meta) meta.content = description;
    });
    document.querySelectorAll("[data-language]").forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-language") === language ? "true" : "false");
    });
    if (rememberChoice) {
      try { localStorage.setItem("kd-language", language); } catch (e) {}
    }
  }

  function init() {
    var toggle = document.querySelector(".language-toggle");
    if (!toggle) {
      var navLinks = document.querySelector("nav .links");
      var nav = navLinks || document.querySelector("nav");
      if (!nav) {
        nav = document.createElement("div");
        nav.style.cssText = "position:fixed;top:14px;right:14px;z-index:10000";
        document.body.appendChild(nav);
      }
      var style = document.createElement("style");
      style.textContent = ".language-toggle{display:inline-flex;align-items:center;gap:2px;padding:3px;border:1px solid currentColor;border-radius:999px;margin-inline:6px}.language-toggle button[aria-pressed=true]{background:#f5f5f7;color:#111}";
      document.head.appendChild(style);
      toggle = document.createElement("div");
      toggle.className = "language-toggle";
      toggle.setAttribute("role", "group");
      toggle.setAttribute("aria-label", "Language / Dil");
      ["tr", "en"].forEach(function (language) {
        var button = document.createElement("button");
        button.type = "button";
        button.textContent = language.toUpperCase();
        button.setAttribute("data-language", language);
        button.setAttribute("aria-pressed", "false");
        button.style.cssText = "min-width:38px;padding:7px 9px;border:0;border-radius:999px;background:transparent;color:inherit;font:inherit;font-size:.78rem;font-weight:700;cursor:pointer";
        toggle.appendChild(button);
      });
      nav.appendChild(toggle);
    }
    document.querySelectorAll("[data-language]").forEach(function (button) {
      button.addEventListener("click", function () { applyLanguage(button.getAttribute("data-language"), true); });
    });

    var saved = null;
    try { saved = localStorage.getItem("kd-language"); } catch (e) {}
    if (saved === "tr" || saved === "en") {
      applyLanguage(saved);
      return;
    }
    var initial = (navigator.language || "en").toLowerCase().indexOf("tr") === 0 ? "tr" : "en";
    try { if (Intl.DateTimeFormat().resolvedOptions().timeZone === "Europe/Istanbul") initial = "tr"; } catch (e) {}
    applyLanguage(initial);
    var manuallyChosen = false;
    document.querySelectorAll("[data-language]").forEach(function (button) {
      button.addEventListener("click", function () { manuallyChosen = true; });
    });
    fetch("https://ipapi.co/json/", { headers: { Accept: "application/json" }, cache: "no-store" })
      .then(function (response) { if (!response.ok) throw new Error("Country lookup unavailable"); return response.json(); })
      .then(function (country) { if (!manuallyChosen && country && country.country_code) applyLanguage(country.country_code === "TR" ? "tr" : "en"); })
      .catch(function () {});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  window.KadryonLanguage = { apply: applyLanguage };
})();
