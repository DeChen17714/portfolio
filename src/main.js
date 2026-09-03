import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/newsreader';
import '@fontsource/dm-mono/400.css';
import '@fontsource/dm-mono/500.css';

const THEME_STORAGE_KEY = 'wong-portfolio-theme';
const EMAIL = 'dechen2002@gmail.com';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigationObserver();
  initSpotlight();
  initCopyEmail();
  initReveal();
});

function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const root = document.documentElement;
  const colorPreference = window.matchMedia('(prefers-color-scheme: dark)');
  const storedTheme = readStoredTheme();

  applyTheme(storedTheme ?? (colorPreference.matches ? 'dark' : 'light'), false);

  toggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true);
  });

  colorPreference.addEventListener?.('change', (event) => {
    if (!readStoredTheme()) applyTheme(event.matches ? 'dark' : 'light', false);
  });

  function applyTheme(theme, persist) {
    root.dataset.theme = theme;
    toggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
    toggle.setAttribute('aria-label', `Use ${theme === 'dark' ? 'light' : 'dark'} theme`);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute('content', theme === 'dark' ? '#151713' : '#F3F1E8');

    if (!persist) return;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // The selected theme still applies when storage is unavailable.
    }
  }
}

function readStoredTheme() {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function initNavigationObserver() {
  const links = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const sectionIds = ['home', 'interfaces', 'systems', 'posters', 'profile', 'contact'];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

  const linksById = new Map(
    links.map((link) => [link.getAttribute('href').slice(1), link]),
  );

  const updateActiveSection = () => {
    const readingLine = window.innerHeight * 0.22;
    const activeSection = sections.find((section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= readingLine && bounds.bottom > readingLine;
    });

    links.forEach((link) => link.removeAttribute('aria-current'));
    if (activeSection?.id !== 'home') {
      linksById.get(activeSection?.id)?.setAttribute('aria-current', 'location');
    }
  };

  const observer = new IntersectionObserver(updateActiveSection, {
    rootMargin: '-22% 0px -77% 0px',
    threshold: 0,
  });

  sections.forEach((section) => observer.observe(section));
  updateActiveSection();
}


function initSpotlight() {
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!hasFinePointer || reducedMotion) return;

  const controller = new AbortController();
  const mediaItems = document.querySelectorAll('.work-media, .trace-frame, .poster-card');

  mediaItems.forEach((item) => {
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    item.classList.add('has-spotlight');

    const updateSpotlight = () => {
      const rect = item.getBoundingClientRect();
      item.style.setProperty('--spotlight-x', `${pointerX - rect.left}px`);
      item.style.setProperty('--spotlight-y', `${pointerY - rect.top}px`);
      item.style.setProperty('--spotlight-opacity', '1');
      frame = 0;
    };

    const handlePointerMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(updateSpotlight);
    };

    const handlePointerLeave = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      item.style.setProperty('--spotlight-opacity', '0');
    };

    item.addEventListener('pointermove', handlePointerMove, {
      passive: true,
      signal: controller.signal,
    });
    item.addEventListener('pointerleave', handlePointerLeave, {
      passive: true,
      signal: controller.signal,
    });
  });

  window.addEventListener('pagehide', () => controller.abort(), {
    once: true,
    signal: controller.signal,
  });
}

function initCopyEmail() {
  const button = document.getElementById('copy-email');
  const status = document.getElementById('copy-status');
  if (!button || !status) return;

  let clearStatusTimer;

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.email || EMAIL);
      status.textContent = 'Email copied.';
      button.textContent = 'Copied';
    } catch {
      status.textContent = 'Copy unavailable. Use the email link.';
      button.textContent = 'Copy email';
    }

    window.clearTimeout(clearStatusTimer);
    clearStatusTimer = window.setTimeout(() => {
      status.textContent = '';
      button.textContent = 'Copy email';
    }, 2400);
  });
}

function initReveal() {
  const items = Array.from(document.querySelectorAll('[data-reveal]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!items.length || reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  document.documentElement.classList.add('reveal-ready');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.12,
  });

  items.forEach((item) => observer.observe(item));
}
