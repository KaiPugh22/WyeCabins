(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════
  //  Wye Cabins — client-side renderer
  //
  //  All editable copy lives in /content/ as JSON or Markdown.
  //  This script fetches those files and renders them into the
  //  slot elements on each HTML page.
  //
  //  Structure:
  //    content/site.json               — contact, social, nav, footer
  //    content/pages/*.json            — per-page copy
  //    content/units/{slug}.json       — cabin data (Holly, Bramble, Book Nook)
  //    content/blog/meta.json          — list of posts for the listing page
  //    content/blog/{slug}.md          — body of each blog post
  // ══════════════════════════════════════════════════════════

  // Rendered once SITE loads
  var SITE = null;

  // ── Static SVG assets (structural, not editable copy) ──
  var LOGO_SVG = '<svg viewBox="0 0 1788.66 586.84" aria-hidden="true"><style>.wgl-t{font-family:\'Abril Fatface\',serif;font-size:268.01px;fill:currentColor}.wgl-tk{letter-spacing:-.05em}.wgl-d{fill:currentColor}</style><polygon class="wgl-d" points="313.74 384.27 382.79 384.27 349.96 204.6 313.74 384.27"/><path class="wgl-d" d="M176.99,192.37l38.68,191.9h43.79c.35,0,.69.04,1.01.12.32-.08.66-.12,1.01-.12h43.79l38.68-191.87h-82.47c-.35,0-.68-.04-.99-.13h0s0,0-.01,0c-.32.08-.66.13-1.01.13l-82.47-.04Z"/><path class="wgl-d" d="M178.54,184.11h80.92c.35,0,.69.05,1.01.13.32-.09.66-.13,1.01-.13l80.95.03h0s-81.96-99.6-81.96-99.6l-81.93,99.57Z"/><polygon class="wgl-d" points="124.33 384.27 38.57 384.27 38.57 220.75 124.33 384.27"/><polygon class="wgl-d" points="163.04 193.57 129.61 376.48 41.23 207.95 163.04 193.57"/><polygon class="wgl-d" points="241.74 92.4 165.59 184.94 165.58 184.95 53.05 198.21 53.05 198.21 241.74 92.4"/><polygon class="wgl-d" points="205.68 384.27 136.63 384.27 169.46 204.6 205.68 384.27"/><text class="wgl-t" transform="translate(373.63 381.96)"><tspan x="0" y="0">W</tspan></text><path class="wgl-d" d="M448.93,184.24c-25.06-12.1-50.71-25.05-76.9-38.93-33.13-17.56-64.58-35.28-94.35-52.9,0,0,68.58,83.35,75.57,91.84h95.67Z"/><polyline class="wgl-d" points="357.9 204.6 395.09 384.27 430.02 384.39 366.62 204.6"/><text class="wgl-t" transform="translate(932.67 382.17)"><tspan x="0" y="0">Cabins</tspan></text><text class="wgl-t wgl-tk" transform="translate(612.24 384.85)"><tspan x="0" y="0">ye</tspan></text><rect class="wgl-d" x="1028.76" y="377.76" width="706" height="7.08"/></svg>';
  var FB_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>';
  var IG_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="4"></rect><circle cx="12" cy="12" r="3.5"></circle><circle cx="16.8" cy="7.3" r="1"></circle></svg>';
  var EMAIL_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>';
  var PHONE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';

  // ── Cabin spec icons (stroke paths used by the "At a Glance" grid) ──
  var SPEC_ICONS = {
    sleeps: '<circle cx="12" cy="7" r="4"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/>',
    bed: '<path d="M2 18V5"/><path d="M2 12h16a4 4 0 0 1 4 4v2H2"/>',
    flame: '<path d="M12 2c-4 4-7 8-7 11a7 7 0 0 0 14 0c0-3-3-7-7-11z"/>',
    solar: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    kitchen: '<path d="M6 2v6a3 3 0 0 0 6 0V2"/><path d="M9 8v14"/><path d="M18 2v20"/>',
    firepit: '<path d="M12 5c-2 2.5-3.5 5-3.5 7a3.5 3.5 0 0 0 7 0c0-2-1.5-4.5-3.5-7z"/><path d="M3 21h18"/>',
    shower: '<path d="M12 3v3"/><path d="M8 10v3M12 10v3M16 10v3"/><path d="M10 16v3M14 16v3"/>',
    nature: '<path d="M12 4L6 14h12z"/><path d="M12 14v8"/>',
    mountain: '<path d="M3 20l6-12 3 5 3-5 6 12"/>',
    location: '<path d="M12 21c-4-4-7-7-7-11a7 7 0 0 1 14 0c0 4-3 7-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    garden: '<path d="M12 22V8"/><path d="M5 12c0-3.87 3.13-7 7-7s7 3.13 7 7"/><path d="M8 16c0-2.21 1.79-4 4-4s4 1.79 4 4"/>',
    wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/>',
    parking: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
    dog: '<path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/><path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75z"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'
  };

  // ══════════════════════════════════════════════════════════
  //  Fetch helpers
  // ══════════════════════════════════════════════════════════

  function fetchJson(path) {
    return fetch(path, { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error(path + ' HTTP ' + res.status);
      return res.json();
    });
  }

  function fetchText(path) {
    return fetch(path, { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error(path + ' HTTP ' + res.status);
      return res.text();
    });
  }

  function showSlotError(selector) {
    var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    el.innerHTML = '<p class="slot-error" style="padding:16px;color:#6b7060;font-style:italic">Content failed to load &mdash; please refresh.</p>';
  }

  function toAssetUrl(path) {
    return encodeURI(path);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ══════════════════════════════════════════════════════════
  //  Header, footer, contact section (driven by site.json)
  // ══════════════════════════════════════════════════════════

  function renderSiteHeader() {
    var header = document.getElementById('site-header');
    if (!header || !SITE) return;

    var path = window.location.pathname;
    var navHTML = SITE.nav.map(function (item) {
      var isActive = item.href.indexOf('#') === -1 && path.indexOf(item.href.replace('.html', '')) > -1;
      return '<a' + (isActive ? ' class="is-active" aria-current="page"' : '') + ' href="' + item.href + '">' + escapeHtml(item.label) + '</a>';
    }).join('');

    header.innerHTML = '<div class="container topbar-inner">'
      + '<a class="logo" href="index.html" aria-label="' + escapeHtml(SITE.brand.name) + ' home">' + LOGO_SVG + '</a>'
      + '<button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>'
      + '<nav class="main-nav" id="main-nav" aria-label="Main navigation">' + navHTML
      + '<a class="nav-book-link" href="' + SITE.contact.bookingUrl + '" target="_blank" rel="noreferrer">Book Now</a></nav>'
      + '<div class="header-actions">'
      + '<a class="contact-btn" href="' + SITE.contact.bookingUrl + '" target="_blank" rel="noreferrer">BOOK</a>'
      + '<a class="icon-link" href="' + SITE.social.facebookUrl + '" target="_blank" rel="noreferrer" aria-label="Facebook (opens in new tab)">' + FB_ICON + '</a>'
      + '<a class="icon-link" href="' + SITE.social.instagramUrl + '" target="_blank" rel="noreferrer" aria-label="Instagram (opens in new tab)">' + IG_ICON + '</a>'
      + '</div></div>';
  }

  function renderSiteFooter() {
    var footer = document.getElementById('site-footer');
    if (!footer || !SITE) return;

    var policyHTML = SITE.footer.policyLinks.map(function (link) {
      return '<a href="' + link.href + '">' + escapeHtml(link.label) + '</a>';
    }).join(' | ');

    footer.innerHTML = '<div class="container footer-inner">'
      + '<div class="footer-social"><h3>' + escapeHtml(SITE.footer.socialHeading) + '</h3>'
      + '<nav class="social-links" aria-label="Social media">'
      + '<a href="' + SITE.social.facebookUrl + '" target="_blank" rel="noreferrer" aria-label="Facebook (opens in new tab)">' + FB_ICON + '</a>'
      + '<a href="' + SITE.social.instagramUrl + '" target="_blank" rel="noreferrer" aria-label="Instagram (opens in new tab)">' + IG_ICON + '</a>'
      + '<a href="mailto:' + SITE.contact.email + '" aria-label="Email">' + EMAIL_ICON + '</a>'
      + '</nav></div>'
      + '<div class="footer-line"></div>'
      + '<p class="policy-links">' + policyHTML + '</p>'
      + '<p class="copyright">' + escapeHtml(SITE.brand.copyright) + '</p>'
      + '</div>';
  }

  function renderContactSection() {
    var footer = document.getElementById('site-footer');
    if (!footer || !SITE) return;

    var cs = SITE.contactSection;
    var section = document.createElement('section');
    section.id = 'contact-section';
    section.className = 'contact-section';
    section.innerHTML = '<div class="container contact-inner">'
      + '<h2>' + escapeHtml(cs.heading) + '</h2>'
      + '<p class="contact-subtext">' + escapeHtml(cs.subtext) + '</p>'
      + '<div class="contact-grid">'
      + '<div class="contact-info">'
      + '<div class="contact-detail">' + EMAIL_ICON + '<a href="mailto:' + SITE.contact.email + '">' + SITE.contact.email + '</a></div>'
      + '<div class="contact-detail">' + PHONE_ICON + '<a href="tel:' + SITE.contact.phone.replace(/\s/g, '') + '">' + SITE.contact.phone + '</a></div>'
      + '</div>'
      + '<form class="contact-form" id="contactForm">'
      + '<div class="form-row"><label for="contact-name">Name</label><input id="contact-name" type="text" name="name" required></div>'
      + '<div class="form-row"><label for="contact-email">Email</label><input id="contact-email" type="email" name="email" required></div>'
      + '<div class="form-row form-row--full"><label for="contact-message">Message</label><textarea id="contact-message" name="message" rows="5" required></textarea></div>'
      + '<button type="submit">' + escapeHtml(cs.submitLabel) + '</button>'
      + '</form>'
      + '</div>'
      + '<div aria-live="polite" id="contact-feedback"></div>'
      + '</div>';

    footer.parentNode.insertBefore(section, footer);
  }

  function setupContactForm() {
    var form = document.getElementById('contactForm');
    var feedback = document.getElementById('contact-feedback');
    if (!form || !SITE) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // TODO: Connect to your form handler (Formspree, Netlify Forms, etc.)
      if (feedback) {
        feedback.textContent = SITE.contactSection.successMessage;
      }
      form.reset();
    });
  }

  // ══════════════════════════════════════════════════════════
  //  Shared UI helpers
  // ══════════════════════════════════════════════════════════

  function setupSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        var toggle = document.getElementById('navToggle');
        var nav = document.getElementById('main-nav');
        if (toggle && nav) {
          toggle.setAttribute('aria-expanded', 'false');
          toggle.classList.remove('nav-toggle--open');
          nav.classList.remove('nav-open');
        }
      }
    });
  }

  function setupMobileNav() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.classList.toggle('nav-toggle--open');
      nav.classList.toggle('nav-open');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('nav-toggle--open');
        nav.classList.remove('nav-open');
      }
    });
  }

  function setupSubscribeForm() {
    var form = document.querySelector('.subscribe-form');
    var feedback = document.querySelector('#subscribe-feedback');
    if (!form || !SITE) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var email = form.querySelector('input[type="email"]');
      if (email && email.value) {
        if (feedback) {
          feedback.textContent = SITE.subscribe.successMessage;
        }
        email.value = '';
      }
    });
  }

  // ══════════════════════════════════════════════════════════
  //  Page: Home (index.html)
  // ══════════════════════════════════════════════════════════

  function applyMeta(meta) {
    if (!meta) return;
    if (meta.title) document.title = meta.title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc && meta.description) desc.setAttribute('content', meta.description);
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && meta.title) ogTitle.setAttribute('content', meta.title);
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && (meta.ogDescription || meta.description)) ogDesc.setAttribute('content', meta.ogDescription || meta.description);
    var ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg && meta.ogImage) ogImg.setAttribute('content', meta.ogImage);
    var twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle && meta.title) twTitle.setAttribute('content', meta.title);
    var twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc && (meta.ogDescription || meta.description)) twDesc.setAttribute('content', meta.ogDescription || meta.description);
    var twImg = document.querySelector('meta[name="twitter:image"]');
    if (twImg && meta.ogImage) twImg.setAttribute('content', meta.ogImage);
  }

  function renderStayCard(card) {
    return '<a class="stay-card' + (card.className ? ' ' + card.className : '') + '" href="' + (card.href || ('stay.html?unit=' + card.unit)) + '"' + (card.target ? ' target="' + card.target + '" rel="noreferrer"' : '') + '>'
      + '<img src="' + toAssetUrl(card.image) + '" alt="' + escapeHtml(card.alt) + '" width="' + card.width + '" height="' + card.height + '"' + (card.eager ? '' : ' loading="lazy"') + '>'
      + '<div class="stay-overlay">'
      + '<h2>' + escapeHtml(card.title) + '</h2>'
      + '<p>' + escapeHtml(card.tagline) + '</p>'
      + (card.badge ? '<span class="festival-badge">' + escapeHtml(card.badge) + '</span>' : '')
      + '</div></a>';
  }

  function renderHomePage() {
    if (document.body.dataset.page !== 'home') return;
    var slot = document.getElementById('homeContent');
    if (!slot) return;

    fetchJson('content/pages/home.json').then(function (data) {
      applyMeta(data.meta);

      slot.innerHTML = ''
        + '<section class="home-section">'
        + '<div class="container home-headline">'
        + '<h1>' + escapeHtml(data.headline.title) + '<br><span class="headline-sub">' + escapeHtml(data.headline.subtitle) + '</span></h1>'
        + '</div>'
        + '<div class="container stay-stack">' + data.cabinStack.map(renderStayCard).join('') + '</div>'
        + '<div class="container split-links">'
        + '<a href="' + data.countryLink.href + '">' + escapeHtml(data.countryLink.label) + ' <span aria-hidden="true">&#8594;</span></a>'
        + '</div>'
        + '<div class="container stay-stack stay-stack--spaced">' + data.townStack.map(renderStayCard).join('') + '</div>'
        + '<div class="container split-links">'
        + '<a href="' + data.townLink.href + '">' + escapeHtml(data.townLink.label) + ' <span aria-hidden="true">&#8594;</span></a>'
        + '</div>'
        + '</section>'
        + '<section class="antidote-section"><div class="container antidote-inner">'
        + '<h2>' + escapeHtml(data.antidote.title) + '</h2>'
        + '<p>' + escapeHtml(data.antidote.body) + '</p>'
        + '<p class="antidote-tagline">' + escapeHtml(data.antidote.tagline) + '</p>'
        + '<a class="outline-btn" href="' + data.antidote.ctaHref + '">' + escapeHtml(data.antidote.ctaLabel) + '</a>'
        + '</div></section>'
        + '<section class="mailing-section"><div class="container mailing-inner">'
        + '<h2>' + escapeHtml(data.mailing.title) + '</h2>'
        + '<p>' + escapeHtml(data.mailing.body) + '</p>'
        + '<form class="subscribe-form" action="#" method="post">'
        + '<label for="email-input" class="sr-only">Email address</label>'
        + '<input id="email-input" type="email" name="email" placeholder="' + escapeHtml(data.mailing.placeholder) + '" required>'
        + '<button type="submit">' + escapeHtml(data.mailing.submitLabel) + '</button>'
        + '</form>'
        + '<div aria-live="polite" id="subscribe-feedback"></div>'
        + '</div></section>';

      setupSubscribeForm();
    }).catch(function (err) {
      console.error(err);
      showSlotError('#homeContent');
    });
  }

  // ══════════════════════════════════════════════════════════
  //  Page: Country (country.html)
  // ══════════════════════════════════════════════════════════

  function renderCountryPage() {
    if (document.body.dataset.page !== 'country') return;
    var slot = document.getElementById('countryContent');
    if (!slot) return;

    fetchJson('content/pages/country.json').then(function (data) {
      applyMeta(data.meta);
      slot.innerHTML = ''
        + '<div class="container home-headline"><h1>' + escapeHtml(data.headline) + '</h1></div>'
        + '<div class="container stay-stack">' + data.cabinStack.map(renderStayCard).join('') + '</div>';
    }).catch(function (err) {
      console.error(err);
      showSlotError('#countryContent');
    });
  }

  // ══════════════════════════════════════════════════════════
  //  Page: Town (town.html)
  // ══════════════════════════════════════════════════════════

  function renderTownPage() {
    if (document.body.dataset.page !== 'town') return;
    var slot = document.getElementById('townContent');
    if (!slot) return;

    fetchJson('content/pages/town.json').then(function (data) {
      applyMeta(data.meta);

      var intro = data.hayGlampingIntro.map(function (para, i) {
        return '<p' + (i === data.hayGlampingIntro.length - 1 ? ' class="coming-soon-note"' : '') + '>' + para + '</p>';
      }).join('');

      slot.innerHTML = ''
        + '<div class="container home-headline"><h1>' + escapeHtml(data.headline) + '</h1></div>'
        + '<div class="container stay-stack">' + renderStayCard(Object.assign({ eager: true }, data.bookNook)) + '</div>'
        + '<div class="container town-between-text">' + intro + '</div>'
        + '<div class="container stay-stack">' + renderStayCard({
            className: 'stay-card--festival',
            href: data.hayGlampingCard.href,
            target: '_blank',
            title: data.hayGlampingCard.title,
            tagline: data.hayGlampingCard.tagline,
            badge: data.hayGlampingCard.badge,
            image: data.hayGlampingCard.image,
            alt: data.hayGlampingCard.alt,
            width: data.hayGlampingCard.width,
            height: data.hayGlampingCard.height
          }) + '</div>';
    }).catch(function (err) {
      console.error(err);
      showSlotError('#townContent');
    });
  }

  // ══════════════════════════════════════════════════════════
  //  Page: Stay (stay.html) — cabin detail
  // ══════════════════════════════════════════════════════════

  function renderStayPage() {
    if (document.body.dataset.page !== 'stay') return;

    var params = new URLSearchParams(window.location.search);
    var unitId = params.get('unit') || 'holly';

    fetchJson('content/units/' + unitId + '.json')
      .catch(function () { return fetchJson('content/units/holly.json'); })
      .then(function (unit) {
        renderUnit(unit);
      })
      .catch(function (err) {
        console.error(err);
        showSlotError('main');
      });
  }

  function renderUnit(unit) {
    var heroImage = document.querySelector('#unitHeroImage');
    var heroTitle = document.querySelector('#unitHeroTitle');
    var heroMeta = document.querySelector('#unitHeroMeta');
    var introTitle = document.querySelector('#unitIntroTitle');
    var introText = document.querySelector('#unitIntroText');
    var gallery = document.querySelector('#unitGallery');
    var specsGrid = document.querySelector('#unitSpecsGrid');
    var mapFrame = document.querySelector('#unitMapFrame');
    var mapLink = document.querySelector('#unitMapLink');
    var storySection = document.querySelector('#unitStorySection');
    var storyTitle = document.querySelector('#unitStoryTitle');
    var storyText = document.querySelector('#unitStoryText');

    if (!heroImage || !heroTitle || !heroMeta || !introTitle || !introText || !gallery || !specsGrid || !mapFrame || !mapLink) {
      return;
    }

    applyMeta({
      title: unit.title + ' | WYE CABINS',
      description: unit.title + ' \u2014 hand crafted cabin at Wye Cabins near Hay-on-Wye.',
      ogImage: unit.heroImage
    });

    heroImage.src = toAssetUrl(unit.heroImage);
    heroImage.alt = 'Exterior view of ' + unit.title + ' cabin at Wye Cabins';
    heroTitle.textContent = unit.title;
    heroMeta.textContent = unit.meta;
    introTitle.textContent = unit.introTitle;
    introText.textContent = unit.introText;

    if (storySection && storyTitle && storyText && unit.storyTitle) {
      storySection.hidden = false;
      storyTitle.textContent = unit.storyTitle;
      storyText.textContent = unit.storyText;
    }

    gallery.innerHTML = '';
    unit.gallery.forEach(function (imageSrc, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-tile';
      button.setAttribute('aria-label', 'View ' + unit.title + ' gallery image ' + (index + 1) + ' fullscreen');
      var image = document.createElement('img');
      image.src = toAssetUrl(imageSrc);
      image.alt = unit.title + ' gallery image ' + (index + 1);
      if (index >= 3) image.loading = 'lazy';
      button.appendChild(image);
      gallery.appendChild(button);
    });

    specsGrid.innerHTML = '';
    if (unit.specs) {
      unit.specs.forEach(function (spec) {
        var item = document.createElement('div');
        item.className = 'spec-item';
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'spec-icon');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = SPEC_ICONS[spec.icon] || '';
        var label = document.createElement('span');
        label.className = 'spec-label';
        label.textContent = spec.label;
        item.appendChild(svg);
        item.appendChild(label);
        specsGrid.appendChild(item);
      });
    }

    var query = encodeURIComponent(unit.mapQuery);
    mapFrame.src = 'https://www.google.com/maps?q=' + query + '&output=embed';
    mapFrame.title = 'Map showing location of ' + unit.title + ' cabin';
    mapLink.href = 'https://www.google.com/maps/search/?api=1&query=' + query;

    var bookBtn = document.querySelector('.unit-book .outline-btn');
    if (bookBtn && SITE) {
      bookBtn.href = SITE.contact.bookingUrl;
      bookBtn.target = '_blank';
      bookBtn.rel = 'noreferrer';
    }

    renderInstagramEmbed();
    setupLightbox();
  }

  // ══════════════════════════════════════════════════════════
  //  Instagram feed
  // ══════════════════════════════════════════════════════════

  function renderInstagramEmbed() {
    var section = document.getElementById('unitInstagram');
    if (!section || !SITE) return;
    var track = document.getElementById('instagramTrack');
    if (!track) return;

    var token = SITE.social.instagramToken || '';

    if (token) {
      fetch('https://graph.instagram.com/me/media?fields=id,media_url,permalink,media_type,thumbnail_url&limit=12&access_token=' + token)
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (!data.data) return fallbackEmbed(track);
          track.innerHTML = '';
          data.data.forEach(function (post, i) {
            var imgUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
            if (!imgUrl) return;
            var slide = document.createElement('a');
            slide.href = post.permalink;
            slide.target = '_blank';
            slide.rel = 'noreferrer';
            slide.className = 'insta-slide';
            slide.setAttribute('aria-label', 'Instagram post ' + (i + 1));
            var img = document.createElement('img');
            img.src = imgUrl;
            img.alt = '';
            img.loading = i > 3 ? 'lazy' : 'eager';
            slide.appendChild(img);
            track.appendChild(slide);
          });
          setupSliderArrows(track);
        })
        .catch(function () { fallbackEmbed(track); });
    } else {
      fallbackEmbed(track);
    }
  }

  function fallbackEmbed(track) {
    track.innerHTML = '';
    var wrapper = document.createElement('div');
    wrapper.className = 'insta-embed-wrapper';
    wrapper.innerHTML = '<iframe src="https://www.instagram.com/'
      + SITE.social.instagramUsername + '/embed" frameborder="0" scrolling="no"'
      + ' allowtransparency="true" loading="lazy"'
      + ' title="' + escapeHtml(SITE.brand.name) + ' Instagram feed"></iframe>';
    track.appendChild(wrapper);
    var prev = document.getElementById('instaPrev');
    var next = document.getElementById('instaNext');
    if (prev) prev.style.display = 'none';
    if (next) next.style.display = 'none';
  }

  function setupSliderArrows(track) {
    var prev = document.getElementById('instaPrev');
    var next = document.getElementById('instaNext');
    if (!prev || !next) return;
    prev.style.display = '';
    next.style.display = '';
    var scrollAmount = function () {
      var slide = track.querySelector('.insta-slide');
      return slide ? slide.offsetWidth + 12 : 300;
    };
    prev.addEventListener('click', function () {
      track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });
  }

  // ══════════════════════════════════════════════════════════
  //  Lightbox
  // ══════════════════════════════════════════════════════════

  function setupLightbox() {
    var lightbox = document.querySelector('#lightbox');
    var lightboxImage = document.querySelector('#lightboxImage');
    var closeButton = document.querySelector('#lightboxClose');
    var galleryButtons = document.querySelectorAll('.gallery-tile');
    var triggerButton = null;

    if (!lightbox || !lightboxImage || !closeButton || galleryButtons.length === 0) return;

    function close() {
      lightbox.hidden = true;
      lightboxImage.removeAttribute('src');
      document.body.classList.remove('lightbox-open');
      if (triggerButton) {
        triggerButton.focus();
        triggerButton = null;
      }
    }

    function open(image, button) {
      triggerButton = button;
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.hidden = false;
      document.body.classList.add('lightbox-open');
      closeButton.focus();
    }

    galleryButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var image = button.querySelector('img');
        if (image) open(image, button);
      });
    });

    closeButton.addEventListener('click', close);
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) close();
    });
    document.addEventListener('keydown', function (event) {
      if (lightbox.hidden) return;
      if (event.key === 'Escape') {
        close();
      } else if (event.key === 'Tab') {
        event.preventDefault();
        closeButton.focus();
      }
    });
  }

  // ══════════════════════════════════════════════════════════
  //  Blog — listing + Markdown-rendered post detail
  // ══════════════════════════════════════════════════════════

  function mapBtnHtml(place) {
    return ' <a class="place-map-link" href="https://www.google.com/maps/search/?api=1&query='
      + encodeURIComponent(place + ' near Hay-on-Wye')
      + '" target="_blank" rel="noreferrer" aria-label="Show ' + escapeHtml(place) + ' on Google Maps">&#x1f4cd; Map</a>';
  }

  /**
   * Preprocess {{map:"query"}} shortcodes in Markdown source before
   * handing it to marked. The shortcode expands to the same HTML
   * that the old mapBtn() helper produced.
   */
  function expandShortcodes(md) {
    return md.replace(/\{\{map:"([^"]+)"\}\}/g, function (_, q) {
      return mapBtnHtml(q);
    });
  }

  function renderBlogIndex(meta) {
    var grid = document.getElementById('postsGrid');
    if (!grid) return;
    grid.innerHTML = meta.posts.map(function (post) {
      var url = 'blog.html?post=' + post.slug;
      return '<article class="post-card">'
        + '<a class="post-card-thumb" href="' + url + '">'
        + '<img src="' + toAssetUrl(post.cardImage) + '" alt="' + escapeHtml(post.cardAlt) + '" width="' + post.cardWidth + '" height="' + post.cardHeight + '"' + (meta.posts.indexOf(post) === 0 ? '' : ' loading="lazy"') + '>'
        + '</a>'
        + '<div class="post-card-body">'
        + '<h2>' + escapeHtml(post.title) + '</h2>'
        + '<p>' + escapeHtml(post.excerpt) + '</p>'
        + '<a href="' + url + '" aria-label="Read more about ' + escapeHtml(post.title.toLowerCase()) + '">Read More <span aria-hidden="true">&#8594;</span></a>'
        + '</div></article>';
    }).join('');
  }

  function renderBlogPost(slug, meta) {
    var post = meta.posts.filter(function (p) { return p.slug === slug; })[0];
    if (!post) return Promise.reject(new Error('Unknown post: ' + slug));

    var listing = document.getElementById('blogListing');
    var article = document.getElementById('blogPost');
    var hero = document.getElementById('blogPostHero');
    var title = document.getElementById('blogPostTitle');
    var body = document.getElementById('blogPostBody');
    if (!listing || !article || !hero || !title || !body) return Promise.reject(new Error('Missing blog slots'));

    listing.hidden = true;
    article.hidden = false;

    applyMeta({
      title: post.title + ' | Wye Cabins Blog',
      description: post.metaDescription || (post.title + ' \u2014 stories and guides from Wye Cabins.'),
      ogImage: post.heroImage
    });

    hero.src = toAssetUrl(post.heroImage);
    hero.alt = post.heroAlt;
    title.textContent = post.title;

    return fetchText('content/blog/' + slug + '.md').then(function (md) {
      var expanded = expandShortcodes(md);
      if (typeof marked === 'undefined') {
        body.innerHTML = '<p class="slot-error">Markdown renderer failed to load &mdash; please refresh.</p>';
        return;
      }
      marked.setOptions({ breaks: false, mangle: false, headerIds: false });
      body.innerHTML = marked.parse(expanded);
      // Add target="_blank" to external links
      body.querySelectorAll('a[href^="http"]').forEach(function (a) {
        a.target = '_blank';
        a.rel = 'noreferrer';
      });
    });
  }

  function renderBlogPage() {
    if (document.body.dataset.page !== 'blog') return;

    var params = new URLSearchParams(window.location.search);
    var slug = params.get('post');

    Promise.all([
      fetchJson('content/blog/meta.json'),
      fetchJson('content/pages/blog-index.json')
    ]).then(function (results) {
      var meta = results[0];
      var index = results[1];

      if (slug) {
        return renderBlogPost(slug, meta);
      } else {
        applyMeta(index.meta);
        var heading = document.querySelector('.blog-title');
        if (heading) heading.textContent = index.heading;
        renderBlogIndex(meta);
      }
    }).catch(function (err) {
      console.error(err);
      var body = document.getElementById('blogPostBody') || document.getElementById('postsGrid');
      if (body) showSlotError(body);
    });
  }

  // ══════════════════════════════════════════════════════════
  //  Init — load site-wide data first, then route-specific renderers
  // ══════════════════════════════════════════════════════════

  fetchJson('content/site.json').then(function (data) {
    SITE = data;
    renderSiteHeader();
    renderSiteFooter();
    renderContactSection();
    setupMobileNav();
    setupSmoothScroll();
    setupContactForm();

    // Route-specific
    renderHomePage();
    renderCountryPage();
    renderTownPage();
    renderStayPage();
    renderBlogPage();
  }).catch(function (err) {
    console.error('Failed to load site config:', err);
    var main = document.querySelector('main');
    if (main) showSlotError(main);
  });
})();
