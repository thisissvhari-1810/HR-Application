/**
 * Nexus Ecosystem — Shared Navigation Runtime
 * ---------------------------------------------------------------
 * Each page declares its identity:
 *
 *   <body data-shell="app"    data-module="employeeDashboard">
 *   <body data-shell="public" data-module="landing">
 *
 * On DOMContentLoaded this script:
 *   1. Hides the page's own mock <header> / <aside> (legacy markup).
 *   2. Injects the correct shell for the declared `data-shell`.
 *   3. Marks the active module in the sidebar and renders breadcrumbs
 *      from `NEXUS_NAV.trail(currentId)`.
 *   4. Wires the mobile drawer, ESC-to-close, and active-link clicks.
 *   5. Renders dashboard quick-link cards in any `[data-quicklinks]`
 *      container so each dashboard automatically lists its sub-pages.
 *
 * Depends on:
 *   - shared/nav-data.js  → exposes window.NEXUS_NAV
 *   - shared/nav.css      → provides the `.nx-*` styles
 *   - Material Symbols Outlined font (loaded by each page)
 */
(function () {
  'use strict';

  const NAV = window.NEXUS_NAV;
  if (!NAV) {
    console.warn('[nexus-nav] nav-data.js missing — navigation cannot render.');
    return;
  }

  /* ---------- tiny DOM helpers --------------------------------------- */
  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        const v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k.indexOf('on') === 0 && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
        else node.setAttribute(k, v);
      });
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach((c) => {
        if (c == null || c === false) return;
        node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  function icon(name, extraClass) {
    return el('span', {
      class: 'material-symbols-outlined' + (extraClass ? ' ' + extraClass : ''),
      'aria-hidden': 'true',
      text: name,
    });
  }

  /* ---------- hide legacy page-local shell --------------------------- */
  function hideLegacyShell() {
    /* The original mock pages each render their own <header> top bar and
       sometimes an <aside> sidebar. They're a different brand of the same
       widgets we're about to inject, so we suppress them visually rather
       than ripping them out of the DOM (preserves their references). */
    const legacy = []
      .concat($$('body > header'))
      .concat($$('body > aside'))
      .concat($$('body > div > header'))
      .concat($$('body > div > aside'));
    legacy.forEach((node) => node.setAttribute('data-nx-hidden', 'true'));
  }

  /* ---------- APP shell: navbar + sidebar + breadcrumbs -------------- */
  function buildAppShell(currentId) {
    const current = NAV.modules[currentId] || {};
    const brand   = NAV.brand;

    /* --- Sidebar -------------------------------------------------- */
    const sidebar = el('aside', { class: 'nx-sidebar', id: 'nxSidebar', 'aria-label': 'Primary navigation' });

    const brandLink = el('a', {
      class: 'nx-sidebar__brand',
      href: NAV.urlFor('welcome'),
      'aria-label': brand.name + ' — go to Welcome',
    }, [
      el('span', { class: 'nx-sidebar__brand-mark' }, [icon('hub')]),
      el('div', { class: 'nx-sidebar__brand-text' }, [
        el('strong', { text: brand.name }),
        el('span',   { text: brand.tagline }),
      ]),
      el('button', {
        class: 'nx-sidebar__close',
        type: 'button',
        'aria-label': 'Close navigation',
        onclick: closeDrawer,
      }, [icon('close')]),
    ]);
    sidebar.appendChild(brandLink);

    const trailIds = new Set(NAV.trail(currentId));
    const nav = el('nav', { class: 'nx-sidebar__nav', 'aria-label': 'Modules' });

    NAV.navGroups.forEach((group) => {
      const list = el('ul', { class: 'nx-nav-group__list' });
      group.items.forEach((moduleId) => {
        const m = NAV.modules[moduleId];
        if (!m) return;
        const isActive = moduleId === currentId;
        const isTrail  = !isActive && trailIds.has(moduleId);
        const link = el('a', {
          class: 'nx-nav-item' + (isActive ? ' is-active' : '') + (isTrail ? ' is-trail' : ''),
          href: NAV.urlFor(moduleId),
          'aria-current': isActive ? 'page' : null,
        }, [
          icon(m.icon || 'circle'),
          el('span', { text: m.label }),
          m.role ? el('span', { class: 'nx-nav-item__role', text: m.role }) : null,
        ]);
        list.appendChild(el('li', null, [link]));
      });
      const groupEl = el('div', { class: 'nx-nav-group' });
      if (group.title) groupEl.appendChild(el('p', { class: 'nx-nav-group__title', text: group.title }));
      groupEl.appendChild(list);
      nav.appendChild(groupEl);
    });

    sidebar.appendChild(nav);

    sidebar.appendChild(el('div', { class: 'nx-sidebar__footer' }, [
      el('a', { class: 'nx-nav-item', href: '#' }, [icon('help'),   el('span', { text: 'Help & Support' })]),
      el('a', { class: 'nx-nav-item', href: NAV.urlFor('signIn') }, [icon('logout'), el('span', { text: 'Sign Out' })]),
    ]));

    /* --- Backdrop ------------------------------------------------- */
    const backdrop = el('div', { class: 'nx-backdrop', id: 'nxBackdrop', onclick: closeDrawer });

    /* --- Top navbar ---------------------------------------------- */
    const navbar = el('header', { class: 'nx-navbar', role: 'banner' });

    navbar.appendChild(el('button', {
      class: 'nx-navbar__hamburger',
      type: 'button',
      'aria-label': 'Open navigation',
      'aria-controls': 'nxSidebar',
      onclick: openDrawer,
    }, [icon('menu')]));

    navbar.appendChild(el('a', { class: 'nx-navbar__brand', href: NAV.urlFor('welcome') }, [
      el('span', { class: 'nx-navbar__brand-dot' }, [icon('hub')]),
      el('span', { text: brand.name }),
    ]));

    navbar.appendChild(el('label', { class: 'nx-navbar__search', 'aria-label': 'Search' }, [
      icon('search'),
      el('input', {
        type: 'search',
        placeholder: 'Search people, modules, documents…',
        autocomplete: 'off',
      }),
      el('kbd', { text: '⌘K' }),
    ]));

    const actions = el('div', { class: 'nx-navbar__actions' }, [
      el('button', { class: 'nx-icon-btn', type: 'button', 'aria-label': 'AI Assistant' }, [icon('smart_toy')]),
      el('button', { class: 'nx-icon-btn', type: 'button', 'aria-label': 'Notifications' }, [
        icon('notifications'),
        el('span', { class: 'nx-icon-btn__badge', text: '3' }),
      ]),
      el('button', { class: 'nx-icon-btn', type: 'button', 'aria-label': 'Settings' }, [icon('settings')]),
      el('a', { class: 'nx-navbar__profile', href: NAV.urlFor('welcome') }, [
        el('div', { class: 'nx-navbar__profile-meta' }, [
          el('strong', { text: brand.userName }),
          el('span',   { text: brand.userTitle }),
        ]),
        el('img', { src: brand.avatar, alt: brand.userName + ' avatar' }),
      ]),
    ]);
    navbar.appendChild(actions);

    /* --- Breadcrumbs --------------------------------------------- */
    const crumbs = el('nav', { class: 'nx-breadcrumbs', 'aria-label': 'Breadcrumb' });
    const trail = NAV.trail(currentId);
    trail.forEach((id, idx) => {
      const m = NAV.modules[id];
      const isLast = idx === trail.length - 1;
      if (isLast) {
        crumbs.appendChild(el('span', { class: 'nx-breadcrumbs__current', 'aria-current': 'page', text: m.label }));
      } else {
        crumbs.appendChild(el('a', { href: NAV.urlFor(id) }, [
          idx === 0 ? icon('home') : null,
          el('span', { text: m.label }),
        ]));
        crumbs.appendChild(el('span', { class: 'nx-breadcrumbs__sep material-symbols-outlined', 'aria-hidden': 'true', text: 'chevron_right' }));
      }
    });

    /* Insert the shell at the very top of <body>. Order matters: backdrop
       sits behind the drawer, sidebar above the backdrop, navbar above
       sidebar, breadcrumbs below navbar. */
    document.body.insertBefore(crumbs,   document.body.firstChild);
    document.body.insertBefore(navbar,   document.body.firstChild);
    document.body.insertBefore(backdrop, document.body.firstChild);
    document.body.insertBefore(sidebar,  document.body.firstChild);

    /* Update the document title so every page reads consistently. */
    if (current.label) {
      document.title = brand.name + ' — ' + current.label;
    }
  }

  /* ---------- PUBLIC shell: slim top bar ---------------------------- */
  function buildPublicShell(currentId) {
    const brand = NAV.brand;
    const isLanding = currentId === 'landing';

    const links = [
      { id: 'landing',  label: 'Platform' },
      { id: 'signIn',   label: 'Sign In' },
    ];

    const nav = el('nav', { class: 'nx-public-nav', role: 'banner' });

    nav.appendChild(el('a', { class: 'nx-public-nav__brand', href: NAV.urlFor('landing') }, [
      el('span', { class: 'nx-public-nav__brand-mark' }, [icon('hub')]),
      el('span', { text: brand.name }),
    ]));

    nav.appendChild(el('div', { class: 'nx-public-nav__links' },
      links.map((l) => el('a', {
        class: currentId === l.id ? 'is-active' : '',
        href: NAV.urlFor(l.id),
      }, [el('span', { text: l.label })]))
    ));

    nav.appendChild(el('a', {
      class: 'nx-public-nav__cta',
      href: NAV.urlFor(isLanding ? 'signIn' : 'welcome'),
    }, [
      el('span', { text: isLanding ? 'Enter Workspace' : 'Open Workspace' }),
      icon('arrow_forward'),
    ]));

    document.body.insertBefore(nav, document.body.firstChild);

    const m = NAV.modules[currentId];
    if (m) document.title = brand.name + ' — ' + m.label;
  }

  /* ---------- Dashboard quick-link grids ---------------------------- */
  function renderQuickLinks() {
    $$('[data-quicklinks]').forEach((container) => {
      const ownerId = container.getAttribute('data-quicklinks');
      const ids = NAV.dashboardLinks[ownerId];
      if (!ids) return;
      container.classList.add('nx-quicklinks');
      ids.forEach((id) => {
        const m = NAV.modules[id];
        if (!m) return;
        const card = el('a', {
          class: 'nx-quicklink',
          href: NAV.urlFor(id),
          style: 'display:flex;gap:14px;align-items:center;padding:16px 18px;border-radius:16px;'
               + 'background:rgba(255,255,255,0.65);backdrop-filter:blur(18px);'
               + 'border:1px solid rgba(195,198,214,0.4);text-decoration:none;color:inherit;'
               + 'transition:transform 180ms ease, box-shadow 220ms ease, background 220ms ease;',
        }, [
          el('span', {
            style: 'width:44px;height:44px;border-radius:14px;display:grid;place-items:center;'
                 + 'background:linear-gradient(135deg,#003d9b,#432f9c);color:#fff;flex-shrink:0;'
                 + 'box-shadow:0 6px 16px rgba(0,61,155,0.25);',
          }, [icon(m.icon || 'circle')]),
          el('div', { style: 'line-height:1.25;' }, [
            el('div', { style: 'font-weight:600;color:#051a3e;font-size:15px;', text: m.label }),
            el('div', { style: 'font-size:12px;color:#535f73;margin-top:2px;', text: 'Open module' }),
          ]),
          el('span', { class: 'material-symbols-outlined', style: 'margin-left:auto;color:#0c56d0;', text: 'arrow_forward' }),
        ]);
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-2px)';
          card.style.boxShadow = '0 12px 28px rgba(5,26,62,0.10)';
          card.style.background = 'rgba(255,255,255,0.9)';
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
          card.style.boxShadow = '';
          card.style.background = 'rgba(255,255,255,0.65)';
        });
        container.appendChild(card);
      });
    });
  }

  /* ---------- Mobile drawer ----------------------------------------- */
  function openDrawer() {
    const sb = $('#nxSidebar');
    const bd = $('#nxBackdrop');
    if (!sb || !bd) return;
    sb.classList.add('is-open');
    bd.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeDrawer() {
    const sb = $('#nxSidebar');
    const bd = $('#nxBackdrop');
    if (!sb || !bd) return;
    sb.classList.remove('is-open');
    bd.classList.remove('is-open');
    document.documentElement.style.overflow = '';
  }
  function wireGlobalKeys() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        const input = $('.nx-navbar__search input');
        if (input) { e.preventDefault(); input.focus(); }
      }
    });
    /* Close drawer on sidebar link click (mobile). */
    document.addEventListener('click', (e) => {
      const link = e.target.closest('.nx-sidebar a.nx-nav-item');
      if (link && window.matchMedia('(max-width: 767px)').matches) closeDrawer();
    });
  }

  /* ---------- bootstrap --------------------------------------------- */
  function init() {
    const body  = document.body;
    const shell = body.getAttribute('data-shell')  || 'app';
    const mid   = body.getAttribute('data-module') || 'welcome';

    hideLegacyShell();

    if (shell === 'public') buildPublicShell(mid);
    else                    buildAppShell(mid);

    renderQuickLinks();
    wireGlobalKeys();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
