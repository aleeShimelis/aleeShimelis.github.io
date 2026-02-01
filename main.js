// Small UX enhancements: year, keyboard jumps, theme toggle
(function(){
  const yearEl = document.getElementById('y');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function jumpTo(id){
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
  }

  // Keyboard: J = projects, T = top
  window.addEventListener('keydown', (e) => {
    if (/input|textarea|select/i.test(document.activeElement?.tagName)) return;
    const k = e.key.toLowerCase();
    if (k === 'j') jumpTo('projects');
    if (k === 't') jumpTo('top');
  });

  // Theme toggle with localStorage
  const THEME_KEY = 'theme';
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  function applyTheme(theme){
    const next = theme === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    if (btn){
      btn.setAttribute('aria-pressed', String(next === 'dark'));
      const label = next === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'light' ? '#f7f9fc' : '#0f1115');
  }

  applyTheme(localStorage.getItem(THEME_KEY) || (prefersLight ? 'light' : 'dark'));

  btn?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  // Smooth in-page anchor scroll (redundant with CSS but ensures consistency)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href');
      if (!hash || hash === '#') return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // If the Hostinger map can't be embedded (X-Frame-Options/CSP), show a fallback link
  const mapIframe = document.getElementById('map-iframe');
  const mapFallback = document.getElementById('map-fallback');
  if (mapIframe && mapFallback){
    let timer = setTimeout(() => {
      mapFallback.hidden = false;
    }, 4000);
    mapIframe.addEventListener('load', () => {
      clearTimeout(timer);
    });
    mapIframe.addEventListener('error', () => {
      clearTimeout(timer);
      mapFallback.hidden = false;
    });
  }
})();
