import { SITE_URL, supabase } from './supabase';

export type { Locale } from './copy';

/* The EduCo. family (brief/01-landing section 5). EduVerse is the jewel; these
   are its four siblings, all sharing the one EduID. */
export const familyApps = [
  { key: 'educo', name: 'EduCo.', url: 'https://educo.pages.dev', light: '/app-logos/educo-light.svg', dark: '/app-logos/educo-dark.svg' },
  { key: 'chat', name: 'EduChat', url: 'https://educhat.pages.dev', light: '/app-logos/educhat-light.svg', dark: '/app-logos/educhat-dark.svg' },
  { key: 'rafiq', name: 'EduRafiq', url: 'https://edurafiq.pages.dev', light: '/app-logos/edurafiq-light.svg', dark: '/app-logos/edurafiq-dark.svg' },
  { key: 'agent', name: 'EduAgent', url: 'https://eduagent.pages.dev', light: '/app-logos/eduagent-light.svg', dark: '/app-logos/eduagent-dark.svg' },
] as const;

/** Founder portrait (brief/01 section 3). The slot is designed and shipped;
 *  drop the photo into public/ and set PUBLIC_FOUNDER_PORTRAIT to its path. */
export const FOUNDER_PORTRAIT: string | null =
  (import.meta.env.PUBLIC_FOUNDER_PORTRAIT as string) || null;

export function localePath(locale: string, path = ''): string {
  const normalized = path.replace(/^\/+/, '');
  return normalized ? `/${locale}/${normalized}` : `/${locale}/`;
}

/** The other locale's path for the current page, for the locale switcher. */
export function swapLocalePathname(currentPathname: string, from: string, to: string): string {
  const parts = currentPathname.split('/').filter(Boolean);
  if (parts[0] === from || parts[0] === to) parts[0] = to;
  else parts.unshift(to);
  const trailing = currentPathname.endsWith('/') ? '/' : '';
  return `/${parts.join('/')}${trailing}`;
}

export function absoluteUrl(path: string): string {
  const base = SITE_URL.replace(/\/+$/, '') || 'http://localhost:4321';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getStoredLocale(): string {
  if (typeof window === 'undefined') return 'en';
  return window.localStorage.getItem('locale') === 'ar' ? 'ar' : 'en';
}

export function setStoredLocale(locale: string): void {
  window.localStorage.setItem('locale', locale);
}

function applyTheme(theme: 'light' | 'dark'): void {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll<HTMLElement>('[data-logo]').forEach((logo) => {
    const source = theme === 'dark' ? logo.dataset.dark : logo.dataset.light;
    if (source) logo.setAttribute('src', source);
  });
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    const label = theme === 'dark' ? button.dataset.labelDark : button.dataset.labelLight;
    if (label) button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', String(theme === 'dark'));
  });
}

export function getInitialTheme(): 'light' | 'dark' {
  const stored = window.localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Render errors as TEXT only. Never innerHTML with server-provided text. */
export function setMessage(
  target: HTMLElement | null,
  message: string,
  tone: 'error' | 'success' | 'info' = 'error',
): void {
  if (!target) return;
  target.replaceChildren();
  if (!message) return;
  const alert = document.createElement('div');
  alert.className = `alert alert--${tone}`;
  alert.setAttribute('role', tone === 'error' ? 'alert' : 'status');
  alert.textContent = message;
  target.append(alert);
}

export function setButtonBusy(
  button: HTMLButtonElement | null,
  busy: boolean,
  busyLabel = 'Working…',
): void {
  if (!button) return;
  if (!button.dataset.defaultLabel) button.dataset.defaultLabel = button.textContent?.trim() || '';
  button.disabled = busy;
  button.textContent = busy ? busyLabel : button.dataset.defaultLabel;
}

export function replaceLocation(path: string): void {
  window.location.replace(path);
}

/** Server errors go to the console only (checklist B12). */
export function logDetail(scope: string, error: unknown): void {
  if (import.meta.env.DEV) console.warn(`[eduverse:${scope}]`, error);
}

function closeNav(): void {
  const navMenu = document.querySelector<HTMLElement>('[data-nav-menu]');
  const navToggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  if (navMenu) navMenu.removeAttribute('data-open');
  if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
}

async function updateAuthNavigation(locale: string): Promise<void> {
  const login = document.querySelector<HTMLElement>('[data-auth-login]');
  const logout = document.querySelector<HTMLElement>('[data-auth-logout]');
  const dash = document.querySelector<HTMLElement>('[data-auth-dash]');
  if (!login && !logout && !dash) return;

  const { data } = await supabase.auth.getUser();
  const isAuthenticated = Boolean(data.user);
  if (login) login.hidden = isAuthenticated;
  if (logout) logout.hidden = !isAuthenticated;
  if (dash) dash.hidden = !isAuthenticated;
  void locale;
}

export function initCookieBanner(): void {
  const banner = document.querySelector<HTMLElement>('[data-cookie-banner]');
  const accept = document.querySelector<HTMLButtonElement>('[data-cookie-accept]');
  if (!banner) return;
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem('eduverse.consent');
  } catch {
    stored = null;
  }
  if (stored === 'ok') {
    banner.hidden = true;
    return;
  }
  banner.hidden = false;
  accept?.addEventListener('click', () => {
    try {
      window.localStorage.setItem('eduverse.consent', 'ok');
    } catch {
      /* private mode — the banner simply returns next visit */
    }
    banner.hidden = true;
  });
}

export function initSite(): void {
  applyTheme(getInitialTheme());

  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem('theme', next);
      applyTheme(next);
    });
  });

  document.querySelectorAll<HTMLAnchorElement>('[data-locale-link]').forEach((link) => {
    link.addEventListener('click', () => {
      const locale = link.dataset.localeLink;
      if (locale === 'ar' || locale === 'en') setStoredLocale(locale);
    });
  });

  const navToggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const navMenu = document.querySelector<HTMLElement>('[data-nav-menu]');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.hasAttribute('data-open');
      if (isOpen) {
        closeNav();
      } else {
        navMenu.setAttribute('data-open', '');
        navToggle.setAttribute('aria-expanded', 'true');
      }
    });
    navMenu.querySelectorAll<HTMLAnchorElement>('a').forEach((link) =>
      link.addEventListener('click', closeNav),
    );
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });
  }

  document.querySelectorAll<HTMLAnchorElement>('[data-auth-logout]').forEach((link) => {
    link.addEventListener('click', async (event) => {
      event.preventDefault();
      await supabase.auth.signOut();
      window.location.replace('/');
    });
  });

  initCookieBanner();
  void updateAuthNavigation(document.documentElement.lang);
}
