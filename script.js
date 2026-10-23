(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-nav');
  const year = document.querySelector('#year');
  let reduceMotion = false;
  try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) { /* Keep motion defaults when the media query API is unavailable. */ }
  let systemThemeQuery = null;
  try { systemThemeQuery = window.matchMedia('(prefers-color-scheme: light)'); } catch (_) { /* Use dark theme when system preference is unavailable. */ }
  const supportsObserver = 'IntersectionObserver' in window;
  const supportsViewTimeline = Boolean(window.CSS && CSS.supports('animation-timeline: view()'));
  const scrollAnimations = supportsViewTimeline && !reduceMotion;

  root.classList.add('js-motion');

  // Smooth in-page navigation while respecting the sticky header and OS motion settings.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href').slice(1);
      const destination = document.getElementById(id);
      if (!destination) return;

      event.preventDefault();
      destination.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      if (window.history.replaceState) window.history.replaceState(null, '', `#${id}`);
      closeMenu();
    });
  });

  // Give every major content block the same carefully timed entrance pattern.
  const motionGroups = [
    '.section-heading', '.about-body', '.about-summary', '.heading-note',
    '.service-card', '.skills-intro', '.skill-item', '.project-card',
    '.portfolio-note', '.contact-copy', '.contact-row', '.profile-identity',
    '.profile-heading', '.profile-links', '.language-switch', '.profile-overview',
    '.profile-facts article', '.profile-block', '.timeline-entry', '.profile-contact'
  ];
  const allRevealItems = new Set();
  motionGroups.forEach((selector) => {
    const items = [...document.querySelectorAll(selector)];
    items.forEach((item, index) => {
      item.classList.add('reveal');
      if (['.service-card', '.skill-item', '.project-card', '.contact-row', '.profile-facts article', '.timeline-entry', '.profile-block'].includes(selector)) {
        item.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 65}ms`);
      }
      allRevealItems.add(item);
    });
  });

  if (reduceMotion || !supportsObserver) {
    allRevealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -32px 0px' });
    allRevealItems.forEach((item) => revealObserver.observe(item));
  }

  // Fill each bar and count its displayed percentage when the skills panel enters view.
  const skillSection = document.querySelector('#yetkinlikler');
  const bars = [...document.querySelectorAll('.progress span')];
  const percentages = [...document.querySelectorAll('.skill-item > div:first-child span:last-child')];
  bars.forEach((bar) => {
    bar.dataset.targetWidth = bar.style.getPropertyValue('--level').trim() || '0%';
    if (!scrollAnimations) bar.style.width = '0%';
  });

  const countTo = (element, target) => {
    if (!element) return;
    const suffix = element.textContent.trim().replace(/[\d.\s-]/g, '');
    if (reduceMotion) {
      element.textContent = `${target}${suffix}`;
      return;
    }
    const duration = 850;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };

  let skillsPlayed = false;
  const playSkills = () => {
    if (skillsPlayed) return;
    skillsPlayed = true;
    bars.forEach((bar, index) => {
      if (!scrollAnimations) window.setTimeout(() => { bar.style.width = bar.dataset.targetWidth; }, reduceMotion ? 0 : index * 75);
      const target = Number.parseInt(bar.dataset.targetWidth, 10) || 0;
      countTo(percentages[index], target);
    });
  };

  if (skillSection && bars.length) {
    if (reduceMotion || !supportsObserver) playSkills();
    else {
      const skillsObserver = new IntersectionObserver((entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        playSkills();
        observer.disconnect();
      }, { threshold: 0.24 });
      skillsObserver.observe(skillSection);
    }
  }

  function closeMenu() {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Menüyü aç');
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menuButton.setAttribute('aria-label', open ? 'Menüyü aç' : 'Menüyü kapat');
      navigation.classList.toggle('is-open', !open);
      document.body.classList.toggle('menu-open', !open);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', (event) => {
      if (navigation.classList.contains('is-open') && !navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 740) closeMenu();
    });
  }

  // Compact glass navigation on scroll; update active section without polling every frame.
  let scrollFrame = 0;
  const refreshHeader = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      header?.classList.toggle('is-scrolled', window.scrollY > 12);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      root.style.setProperty('--page-progress', String(progress));
      scrollFrame = 0;
    });
  };
  refreshHeader();
  window.addEventListener('scroll', refreshHeader, { passive: true });

  if (navigation && supportsObserver) {
    const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
    const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-22% 0px -68% 0px', threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const languageButtons = document.querySelectorAll('[data-language]');
  const languagePanels = document.querySelectorAll('[data-language-panel]');
  const setLanguage = (language) => {
    document.documentElement.lang = language;
    languagePanels.forEach((panel) => { panel.hidden = panel.dataset.languagePanel !== language; });
    languageButtons.forEach((button) => {
      const active = button.dataset.language === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-tr][data-en]').forEach((element) => {
      element.textContent = element.dataset[language];
    });
  };
  languageButtons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));

  const themeButton = document.querySelector('.theme-toggle');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const themeIcon = themeButton?.querySelector('i');
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    themeColor?.setAttribute('content', theme === 'light' ? '#ffffff' : '#000000');
    const light = theme === 'light';
    if (themeIcon) {
      themeIcon.classList.toggle('fa-sun', !light);
      themeIcon.classList.toggle('fa-moon', light);
    }
    if (themeButton) {
      const label = light ? 'Koyu temaya geç' : 'Açık temaya geç';
      themeButton.setAttribute('aria-label', label);
      themeButton.setAttribute('title', label);
    }
  };
  setTheme(systemThemeQuery?.matches ? 'light' : 'dark');
  themeButton?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
  });
  if (systemThemeQuery) {
    const syncSystemTheme = (event) => setTheme(event.matches ? 'light' : 'dark');
    if (typeof systemThemeQuery.addEventListener === 'function') systemThemeQuery.addEventListener('change', syncSystemTheme);
    else if (typeof systemThemeQuery.addListener === 'function') systemThemeQuery.addListener(syncSystemTheme);
  }

  if (year) year.textContent = String(new Date().getFullYear());
})();


