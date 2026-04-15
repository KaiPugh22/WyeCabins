(function () {
  'use strict';

  // ── Site Config (change URLs here — applies everywhere) ──
  var SITE = {
    bookingUrl: 'https://booking-directly.com/widgets/9CN882V7vf1Yfx78pC7SZwVe4x2Li3quF98K9z0DEMogyAWYWFLxe1mPuYwt6/properties/unit-selection',
    facebookUrl: 'https://www.facebook.com/pages/Wye%20Glamping/625040167843407/',
    instagramUrl: 'https://www.instagram.com/wye_glamping/',
    email: 'info@wyeglamping.co.uk'
  };

  var LOGO_SVG = '<svg viewBox="0 0 1788.66 586.84" aria-hidden="true"><style>.wgl-t{font-family:\'Abril Fatface\',serif;font-size:268.01px;fill:currentColor}.wgl-tk{letter-spacing:-.05em}.wgl-d{fill:currentColor}</style><polygon class="wgl-d" points="313.74 384.27 382.79 384.27 349.96 204.6 313.74 384.27"/><path class="wgl-d" d="M176.99,192.37l38.68,191.9h43.79c.35,0,.69.04,1.01.12.32-.08.66-.12,1.01-.12h43.79l38.68-191.87h-82.47c-.35,0-.68-.04-.99-.13h0s0,0-.01,0c-.32.08-.66.13-1.01.13l-82.47-.04Z"/><path class="wgl-d" d="M178.54,184.11h80.92c.35,0,.69.05,1.01.13.32-.09.66-.13,1.01-.13l80.95.03h0s-81.96-99.6-81.96-99.6l-81.93,99.57Z"/><polygon class="wgl-d" points="124.33 384.27 38.57 384.27 38.57 220.75 124.33 384.27"/><polygon class="wgl-d" points="163.04 193.57 129.61 376.48 41.23 207.95 163.04 193.57"/><polygon class="wgl-d" points="241.74 92.4 165.59 184.94 165.58 184.95 53.05 198.21 53.05 198.21 241.74 92.4"/><polygon class="wgl-d" points="205.68 384.27 136.63 384.27 169.46 204.6 205.68 384.27"/><text class="wgl-t" transform="translate(373.63 381.96)"><tspan x="0" y="0">W</tspan></text><path class="wgl-d" d="M448.93,184.24c-25.06-12.1-50.71-25.05-76.9-38.93-33.13-17.56-64.58-35.28-94.35-52.9,0,0,68.58,83.35,75.57,91.84h95.67Z"/><polyline class="wgl-d" points="357.9 204.6 395.09 384.27 430.02 384.39 366.62 204.6"/><text class="wgl-t" transform="translate(932.67 382.17)"><tspan x="0" y="0">Cabins</tspan></text><text class="wgl-t wgl-tk" transform="translate(612.24 384.85)"><tspan x="0" y="0">ye</tspan></text><rect class="wgl-d" x="1028.76" y="377.76" width="706" height="7.08"/></svg>';

  var FB_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>';
  var IG_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="4"></rect><circle cx="12" cy="12" r="3.5"></circle><circle cx="16.8" cy="7.3" r="1"></circle></svg>';
  var EMAIL_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>';

  // ── Reusable Header ──
  function renderSiteHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var path = window.location.pathname;
    var navItems = [
      { href: 'town.html', label: 'Town' },
      { href: 'country.html', label: 'Country' },
      { href: 'blog.html', label: 'Blog' },
      { href: 'mailto:' + SITE.email + '?subject=Wye%20Glamping%20Enquiry', label: 'Contact' }
    ];

    var navHTML = navItems.map(function (item) {
      var isActive = item.href.indexOf('mailto:') === -1 && path.indexOf(item.href.replace('.html', '')) > -1;
      return '<a' + (isActive ? ' class="is-active" aria-current="page"' : '') + ' href="' + item.href + '">' + item.label + '</a>';
    }).join('');

    header.innerHTML = '<div class="container topbar-inner">'
      + '<a class="logo" href="index.html" aria-label="Wye Glamping home">' + LOGO_SVG + '</a>'
      + '<button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>'
      + '<nav class="main-nav" id="main-nav" aria-label="Main navigation">' + navHTML
      + '<a class="nav-book-link" href="' + SITE.bookingUrl + '" target="_blank" rel="noreferrer">Book Now</a></nav>'
      + '<div class="header-actions">'
      + '<a class="contact-btn" href="' + SITE.bookingUrl + '" target="_blank" rel="noreferrer">BOOK</a>'
      + '<a class="icon-link" href="' + SITE.facebookUrl + '" target="_blank" rel="noreferrer" aria-label="Facebook (opens in new tab)">' + FB_ICON + '</a>'
      + '<a class="icon-link" href="' + SITE.instagramUrl + '" target="_blank" rel="noreferrer" aria-label="Instagram (opens in new tab)">' + IG_ICON + '</a>'
      + '</div></div>';
  }

  // ── Reusable Footer ──
  function renderSiteFooter() {
    var footer = document.getElementById('site-footer');
    if (!footer) return;

    footer.innerHTML = '<div class="container footer-inner">'
      + '<div class="footer-social"><h3>Follow Wye Glamping</h3>'
      + '<nav class="social-links" aria-label="Social media">'
      + '<a href="' + SITE.facebookUrl + '" target="_blank" rel="noreferrer" aria-label="Facebook (opens in new tab)">' + FB_ICON + '</a>'
      + '<a href="' + SITE.instagramUrl + '" target="_blank" rel="noreferrer" aria-label="Instagram (opens in new tab)">' + IG_ICON + '</a>'
      + '<a href="mailto:' + SITE.email + '" aria-label="Email">' + EMAIL_ICON + '</a>'
      + '</nav></div>'
      + '<div class="footer-line"></div>'
      + '<p class="policy-links"><a href="#">Privacy Policy</a> | <a href="#">Terms &amp; Conditions</a></p>'
      + '<p class="copyright">&#169;2026 - <strong>WYE GLAMPING</strong> - <em>Hand crafted cabins near Hay-on-Wye.</em></p>'
      + '</div>';
  }

  // ── Mobile Nav Toggle ──
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

    // Close nav when clicking a link
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('nav-toggle--open');
        nav.classList.remove('nav-open');
      }
    });
  }

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
    location: '<path d="M12 21c-4-4-7-7-7-11a7 7 0 0 1 14 0c0 4-3 7-7 11z"/><circle cx="12" cy="10" r="2.5"/>'
  };

  var UNIT_DATA = {
    holly: {
      title: 'HOLLY',
      meta: 'Countryside \u00b7 Brecon Beacons',
      introTitle: 'Welcome to Holly',
      introText:
        'Overlooking the babbling brook, Holly is a hand-built wooden cabin, unique and full of character. It occupies the most private spot on site and feels very tucked away in the woods. Well suited for those who love the outdoors, with its separate kitchen hut and outdoor shelter which enables alfresco dining whatever the weather.',
      storyTitle: 'Tucked away in the woods',
      storyText:
        'Holly is a yurt-inspired cabin built by a local craftsman using reclaimed and locally sourced materials. Popular for its den-like feel and privacy amongst the trees, it overlooks the stream and offers a truly off-grid escape. Whether you\'re after a romantic retreat or a family glamping experience, Holly is the perfect place to unwind, surrounded by nature.',
      heroImage: 'assets/images/Holly/Holly Cover.webp',
      gallery: [
        'assets/images/Holly/Holly Cover.webp',
        'assets/images/Holly/Holly-cabin-at-Wye-Glamping-for-families-and-couples-in-Wales.webp',
        'assets/images/Holly/Holly-cabin-at-Wye-Glamping-for-families-in-Wales.webp',
        'assets/images/Holly/Holly-cabin-at-Wye-Glamping-in-Wales.webp',
        'assets/images/Holly/Holly-cabin-by-the-stream-at-Wye-Glamping-in-Wales-for-families.webp',
        'assets/images/Holly/Holly-cabin-is-perfect-for-family-glamping-at-Wye-Glamping-in-Wales.webp',
        'assets/images/Holly/Interior-detail-in-Holly-cabin-at-Wye-Glamping-with-kids-in-Wales.webp',
        'assets/images/Holly/Private-and-well-equipped-glamp-kitchens-at-Wye-Glamping.webp',
        'assets/images/Holly/The-day-bed-in-Holly-cabin-at-Wye-Glamping-in-Wales.webp',
        'assets/images/Holly/The-interior-of-Holly-cabin-at-Wye-Glamping-in-Wales.webp'
      ],
      specs: [
        { icon: 'sleeps', label: 'Sleeps 2 + Infant' },
        { icon: 'bed', label: 'King Bed & Day Bed' },
        { icon: 'flame', label: 'Wood Burner' },
        { icon: 'solar', label: 'Off-Grid & Solar' },
        { icon: 'kitchen', label: 'Private Kitchen Hut' },
        { icon: 'firepit', label: 'Fire Pit Dining' },
        { icon: 'shower', label: 'Hot Water Shower' },
        { icon: 'nature', label: 'Woodland & Stream' }
      ],
      mapQuery: 'Felindre, Brecon, Powys'
    },
    newcabin: {
      title: 'NEW CABIN',
      meta: 'Town Centre \u00b7 Hay-on-Wye',
      introTitle: 'Welcome to New Cabin',
      introText:
        'Located in the heart of Hay-on-Wye, our newest cabin offers the perfect blend of town convenience and rustic charm. Step outside your door and you\'re moments from the famous bookshops, cafes and markets that make Hay so special.',
      storyTitle: 'Town life, cabin style',
      storyText:
        'New Cabin brings our signature hand-crafted glamping experience to the centre of Hay-on-Wye. Enjoy the warmth of a wood burner, the comfort of a king-size bed, and the buzz of the town just a short stroll away. Perfect for book lovers, foodies, and anyone who wants to explore Hay at their own pace.',
      heroImage: 'assets/images/hero-cabin.jpg',
      gallery: [
        'assets/images/hero-cabin.jpg',
        'assets/images/retreat-a.jpg',
        'assets/images/retreat-b.jpg',
        'assets/images/retreat-c.jpg',
        'assets/images/roundhouse-main.jpg',
        'assets/images/gainsborough.jpg'
      ],
      specs: [
        { icon: 'sleeps', label: 'Sleeps 2' },
        { icon: 'bed', label: 'King Bed' },
        { icon: 'flame', label: 'Wood Burner' },
        { icon: 'kitchen', label: 'Kitchenette' },
        { icon: 'location', label: 'Town Centre' },
        { icon: 'firepit', label: 'Fire Pit' }
      ],
      mapQuery: 'Hay-on-Wye, Powys'
    },
    bramble: {
      title: 'BRAMBLE',
      meta: 'Countryside \u00b7 Brecon Beacons',
      introTitle: 'Welcome to Bramble',
      introText:
        'Sitting along the hedgerow, Bramble offers stunning views of the mountain range. A luxurious glamping cabin with mountain views, it\'s bright, beautiful and brimming with style. New for 2026, we have integrated the kitchenette into the cabin, so no need to leave the cosy space for your morning coffee.',
      storyTitle: 'Bright, beautiful and brimming with style',
      storyText:
        'Bramble is a hand-crafted wooden yurt built by a local craftsman using locally sourced materials. Off-grid and self-contained, it offers a sumptuous king-size bed, toasty wood burner, and a private sundeck with open views extending to the Black Mountains. Whether you\'re after a romantic retreat or a getaway with the little one, Bramble is the perfect place to slow down and switch off.',
      heroImage: 'assets/images/Bramble/Bramble Cover.jpeg',
      gallery: [
        'assets/images/Bramble/Bramble Cover.jpeg',
        'assets/images/Bramble/Bramble-cabin-at-Wye-Glamping-is-perfect-for-a-family-glamping-holiday-in-Wales.jpg',
        'assets/images/Bramble/Bramble-cabin-is-perfect-for-family-glamping-in-Wales (1).jpg',
        'assets/images/Bramble/Bramble-cabin-provides-the-perfect-family-glamping-holiday-in-Wales.jpg',
        'assets/images/Bramble/Bramble-cabin-provides-the-perfect-glamping-holiday-for-couples-in-Wales-at-Wye-Glamping.jpg',
        'assets/images/Bramble/Inside-the-beautiful-Bramble-cabin-at-Wye-Glamping-for-couples-with-dogs-in-Wales.jpg',
        'assets/images/Bramble/Inside-the-gorgeous-Bramble-cabin-at-Wye-Glamping-in-Wales-for-families.jpg',
        'assets/images/Bramble/The-toasty-woodburner-inside-Bramble-cabin-at-Wye-Glamping-in-Wales-for-couples.jpg',
        'assets/images/Bramble/View-from-Bramble-cabin-at-Wye-Glamping-family-holidays-in-Wales (1).jpg'
      ],
      specs: [
        { icon: 'sleeps', label: 'Sleeps 2 (Cot Available)' },
        { icon: 'bed', label: 'King Bed' },
        { icon: 'flame', label: 'Wood Burner' },
        { icon: 'solar', label: 'Off-Grid & Solar' },
        { icon: 'kitchen', label: 'Integrated Kitchenette' },
        { icon: 'firepit', label: 'Fire Pit & BBQ' },
        { icon: 'mountain', label: 'Mountain Views' },
        { icon: 'shower', label: 'Luxury Shower' }
      ],
      mapQuery: 'Felindre, Brecon, Powys'
    }
  };

  function toAssetUrl(path) {
    return encodeURI(path);
  }

  function renderStayPage() {
    if (document.body.dataset.page !== 'stay') {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var unitId = params.get('unit') || 'holly';
    var unit = UNIT_DATA[unitId] || UNIT_DATA.holly;

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

    document.title = unit.title + ' | WYE GLAMPING';

    var descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', unit.title + ' — hand crafted cabin at Wye Glamping near Hay-on-Wye.');
    }

    heroImage.src = toAssetUrl(unit.heroImage);
    heroImage.alt = 'Exterior view of ' + unit.title + ' cabin at Wye Glamping';
    heroTitle.textContent = unit.title;
    heroMeta.textContent = unit.meta;
    introTitle.textContent = unit.introTitle;
    introText.textContent = unit.introText;

    if (storySection && storyTitle && storyText && unit.storyTitle) {
      storySection.hidden = false;
      storyTitle.textContent = unit.storyTitle;
      storyText.textContent = unit.storyText;
    }

    // Build gallery with accessible buttons and lazy loading
    gallery.innerHTML = '';
    unit.gallery.forEach(function (imageSrc, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-tile';
      button.setAttribute('aria-label', 'View ' + unit.title + ' gallery image ' + (index + 1) + ' fullscreen');

      var image = document.createElement('img');
      image.src = toAssetUrl(imageSrc);
      image.alt = unit.title + ' gallery image ' + (index + 1);
      if (index >= 3) {
        image.loading = 'lazy';
      }

      button.appendChild(image);
      gallery.appendChild(button);
    });

    // Build specs icon grid
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

    // Wire booking URL to the "Book your Stay" button
    var bookBtn = document.querySelector('.unit-book .outline-btn');
    if (bookBtn) {
      bookBtn.href = SITE.bookingUrl;
      bookBtn.target = '_blank';
      bookBtn.rel = 'noreferrer';
    }

    setupLightbox();
  }

  function setupLightbox() {
    var lightbox = document.querySelector('#lightbox');
    var lightboxImage = document.querySelector('#lightboxImage');
    var closeButton = document.querySelector('#lightboxClose');
    var galleryButtons = document.querySelectorAll('.gallery-tile');
    var triggerButton = null;

    if (!lightbox || !lightboxImage || !closeButton || galleryButtons.length === 0) {
      return;
    }

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
        if (image) {
          open(image, button);
        }
      });
    });

    closeButton.addEventListener('click', close);

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        close();
      }
    });

    // Keyboard: Escape to close, Tab trap within lightbox
    document.addEventListener('keydown', function (event) {
      if (lightbox.hidden) return;

      if (event.key === 'Escape') {
        close();
      } else if (event.key === 'Tab') {
        // Trap focus inside lightbox (only focusable element is close button)
        event.preventDefault();
        closeButton.focus();
      }
    });
  }

  // Subscribe form handler
  function setupSubscribeForm() {
    var form = document.querySelector('.subscribe-form');
    var feedback = document.querySelector('#subscribe-feedback');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var email = form.querySelector('input[type="email"]');
      if (email && email.value) {
        if (feedback) {
          feedback.textContent = 'Thank you for subscribing!';
        }
        email.value = '';
      }
    });
  }

  // ── Blog Posts ──

  var BLOG_DATA = {
    'things-to-do': {
      title: 'Things to do near Hay-on-Wye',
      heroImage: 'assets/images/Holly/Holly-cabin-by-the-stream-at-Wye-Glamping-in-Wales-for-families.webp',
      heroAlt: 'Stream running past a woodland cabin at Wye Glamping',
      body: '<h2>Right on our doorstep</h2>'
        + '<p>There\'s no shortage of adventure around Wye Glamping. Whether you fancy a gentle riverside stroll or a proper mountain scramble, the Brecon Beacons has you covered.</p>'
        + '<img class="blog-photo" src="assets/images/Holly/Holly-cabin-at-Wye-Glamping-for-families-in-Wales.webp" alt="Placeholder — replace with: panoramic view of the Brecon Beacons countryside" loading="lazy">'

        + '<h2>Hay-on-Wye</h2>'
        + '<img class="blog-photo-right" src="assets/images/Holly/Interior-detail-in-Holly-cabin-at-Wye-Glamping-with-kids-in-Wales.webp" alt="Placeholder — replace with: Hay-on-Wye high street with independent bookshops" loading="lazy">'
        + '<p>A pretty boutique town crammed with vintage shops and booksellers. Don\'t miss The Old Electric Shop for quirky finds, Shepherd\'s Parlour for local ice cream and coffee, and the independent bookshops including Booths and Addyman\'s. If you\'re here on a Thursday, the artisan market is well worth a browse for local bakers and producers.</p>'

        + '<h2>Talgarth</h2>'
        + '<p>Just five minutes from our countryside site, Talgarth is a lovely little town with a working watermill — Talgarth Mill — where you can take a tour and pick up freshly milled flour. There\'s also a good deli and butchers for stocking up on provisions. For a beautiful walk, head to Pwll Y Wrach (Witches Pool), a magical trail through the woods to a small waterfall.</p>'

        + '<h2>Wild swimming &amp; the river</h2>'
        + '<p>The pebble beach at Glasbury is perfect for a picnic and a dip, and the River Caf\u00e9 is right on the bank if you fancy a coffee afterwards. Another favourite is The Warren — a peaceful spot you can reach by walking behind the Three Tuns pub and following the old railway line.</p>'
        + '<div class="blog-photo-pair"><img src="assets/images/Holly/Holly-cabin-by-the-stream-at-Wye-Glamping-in-Wales-for-families.webp" alt="Placeholder — replace with: pebble beach at Glasbury on the River Wye" loading="lazy"><img src="assets/images/Bramble/Bramble-cabin-provides-the-perfect-family-glamping-holiday-in-Wales.jpg" alt="Placeholder — replace with: swimmers enjoying a calm stretch of the River Wye" loading="lazy"></div>'

        + '<h2>Hay Bluff &amp; the Black Mountains</h2>'
        + '<p>Hay Bluff offers a beautiful drive to the foot, then a short but sharp climb to the top with sweeping mountain views. Carry on over the Black Mountains and you\'ll reach Llanthony Priory, a hauntingly beautiful 12th-century ruin with dining available Tuesday to Sunday.</p>'
        + '<img class="blog-photo-wide" src="assets/images/Bramble/View-from-Bramble-cabin-at-Wye-Glamping-family-holidays-in-Wales%20(1).jpg" alt="Placeholder — replace with: sweeping panoramic view from the top of Hay Bluff" loading="lazy">'

        + '<h2>Walking &amp; cycling</h2>'
        + '<img class="blog-photo-left" src="assets/images/Bramble/Bramble-cabin-at-Wye-Glamping-is-perfect-for-a-family-glamping-holiday-in-Wales.jpg" alt="Placeholder — replace with: walkers on a Brecon Beacons trail" loading="lazy">'
        + '<p>The Brecon Beacons are a walker\'s paradise. Pen-y-Fan, Wales\'s second-highest peak, is about a 30-minute drive away and the round trip takes 3–4 hours. The Four Waterfalls Walk is around 45 minutes by car and absolutely spectacular. For cycling, Drover Cycles in Hay offers road and leisure bikes for hire.</p>'

        + '<h2>Adventure activities</h2>'
        + '<p>There\'s plenty for thrill seekers too. Wye Valley Canoes and Want to Canoe both offer guided trips on the river. Tregoyd Mountain Riders is just five minutes away for horse riding. The Black Mountains Activity Centre has zip-lining and kayaking, while Interactivities runs gorge adventures and archery sessions. Llangorse Activity Centre has climbing and indoor activities for all weathers.</p>'

        + '<h2>Rainy day ideas</h2>'
        + '<p>Booths Cinema in Hay is a tiny independent with just 40 seats, a bar, and bags of character. Brecon Leisure Centre has swimming, bowling and a gym. The Globe at Hay hosts live entertainment, and Theatr Brycheiniog in Brecon has a regular programme of theatre, comedy and music.</p>'
    },
    'a-day-in-hay': {
      title: 'A day in Hay-on-Wye',
      heroImage: 'assets/images/Bramble/View-from-Bramble-cabin-at-Wye-Glamping-family-holidays-in-Wales (1).jpg',
      heroAlt: 'Mountain view from Bramble cabin at Wye Glamping',
      body: '<h2>The town of books</h2>'
        + '<p>Known as the town of books, Hay-on-Wye is bursting with independent bookshops and cosy cafes. It\'s the kind of place where you can lose an entire afternoon browsing shelves, and every street seems to have another surprise tucked around the corner.</p>'
        + '<img class="blog-photo" src="assets/images/retreat-a.jpg" alt="Placeholder — replace with: view along the main street of Hay-on-Wye" loading="lazy">'

        + '<h2>Morning</h2>'
        + '<img class="blog-photo-left" src="assets/images/Holly/The-interior-of-Holly-cabin-at-Wye-Glamping-in-Wales.webp" alt="Placeholder — replace with: shelves of books inside one of Hay\'s famous bookshops" loading="lazy">'
        + '<p>Start your day with coffee and breakfast at The Granary, right in the heart of town near the Town Clock. Their home-cooked lunches and cakes are worth coming back for later too. After breakfast, wander through Hay\'s famous bookshops — there are over twenty of them. Booths is the biggest and most iconic, sprawling through multiple rooms of an old cinema. Addyman\'s is wonderful for rare and secondhand finds.</p>'

        + '<h2>Late morning</h2>'
        + '<p>Head to The Old Electric Shop for quirky vintage items and gifts — it\'s part antiques market, part curiosity shop, and entirely charming. If it\'s a Thursday, the artisan market in the town centre is a must. Local bakers, cheese makers and producers set up stalls and it\'s a lovely way to soak up the atmosphere.</p>'

        + '<h2>Lunch</h2>'
        + '<img class="blog-photo-right" src="assets/images/Holly/Private-and-well-equipped-glamp-kitchens-at-Wye-Glamping.webp" alt="Placeholder — replace with: tapas and drinks at Tomatitos in Hay-on-Wye" loading="lazy">'
        + '<p>Grab ice cream from Shepherd\'s Parlour, made with milk from local farms. For something more substantial, Tomatitos does brilliant tapas in a lively setting, or The Blue Boar is a homely traditional pub with generous portions.</p>'

        + '<h2>Afternoon</h2>'
        + '<p>Walk off lunch along the river. Cross the bridge and follow the path downstream — the views back to the town with the castle above are gorgeous. If you fancy something more active, Drover Cycles hire out bikes for the afternoon. For families, the playground by the car park is a good shout while the adults enjoy a coffee.</p>'
        + '<div class="blog-photo-pair"><img src="assets/images/retreat-b.jpg" alt="Placeholder — replace with: the old bridge crossing the River Wye at Hay" loading="lazy"><img src="assets/images/retreat-c.jpg" alt="Placeholder — replace with: Hay Castle seen from the riverside walk" loading="lazy"></div>'

        + '<h2>Evening</h2>'
        + '<p>Back at the cabin, light the fire pit, pour a glass of something nice, and watch the stars come out. If you\'d rather eat out, The Old Black Lion does excellent food in a cosy setting, or Red Indigo is a great option for Indian cuisine.</p>'
        + '<img class="blog-photo-wide" src="assets/images/Bramble/Bramble-cabin-provides-the-perfect-glamping-holiday-for-couples-in-Wales-at-Wye-Glamping.jpg" alt="Placeholder — replace with: fire pit under the stars at Wye Glamping" loading="lazy">'

        + '<h2>Family days out</h2>'
        + '<p>If you\'re visiting with children, Cantref Adventure Centre is about 20–30 minutes away and perfect for both wet and dry days — pony rides, tractor rides, soft play and trampolines. The Small Breeds Centre is a real gem where you can get up close with owls, miniature ponies and pygmy goats. The Brecon Mountain Railway is a steam train ride alongside the reservoirs, with a museum and play area on site. And the National Showcaves of Wales are a firm favourite with our guests — suitable for all ages and weather, with a dinosaur park for the little ones.</p>'
    },
    'where-to-eat': {
      title: 'Where to eat near Wye Glamping',
      heroImage: 'assets/images/Bramble/The-toasty-woodburner-inside-Bramble-cabin-at-Wye-Glamping-in-Wales-for-couples.jpg',
      heroAlt: 'Wood burner inside Bramble cabin at Wye Glamping',
      body: '<h2>Our favourite places to eat</h2>'
        + '<p>One of the best things about staying near Hay-on-Wye is the food. From special occasion dining to a quick lunch between bookshop browses, there\'s something for everyone. Here are the places we find ourselves recommending again and again.</p>'
        + '<img class="blog-photo" src="assets/images/Bramble/Inside-the-beautiful-Bramble-cabin-at-Wye-Glamping-for-couples-with-dogs-in-Wales.jpg" alt="Placeholder — replace with: warm candlelit interior of The Griffin at Felin Fach" loading="lazy">'

        + '<h3>The Griffin at Felin Fach</h3>'
        + '<p>Something special, perfect for a celebration or just a treat. The food is outstanding, the wine list is excellent, and the atmosphere strikes that lovely balance between relaxed and refined. Book ahead.</p>'

        + '<h3>Tomatitos</h3>'
        + '<img class="blog-photo-right" src="assets/images/Holly/The-day-bed-in-Holly-cabin-at-Wye-Glamping-in-Wales.webp" alt="Placeholder — replace with: colourful tapas plates at Tomatitos" loading="lazy">'
        + '<p>Lively atmosphere and yummy tapas right in Hay. Great for a sociable evening, and they\'ve got a good vegan menu too.</p>'

        + '<h3>The Blue Boar</h3>'
        + '<p>A homely traditional pub in Hay serving classic pub fare. The kind of place where you can settle in for the evening without any fuss.</p>'

        + '<h3>The Old Black Lion</h3>'
        + '<p>Another Hay stalwart, the Old Black Lion has been serving food and drink since the 17th century. The cooking is a step above standard pub grub and the building itself is beautiful.</p>'

        + '<h3>Red Indigo</h3>'
        + '<p>Excellent Indian cuisine in Hay, available for dine-in or takeaway. A great option when you fancy something different.</p>'

        + '<h3>The Three Tuns</h3>'
        + '<p>Italian and traditional fayre in a friendly setting. Their Sunday roast includes a vegetarian option, which is a nice touch.</p>'

        + '<h3>Off Grid Gourmet</h3>'
        + '<p>A solar, wood and wind powered supper club run by Hugh — a truly unique experience with amazing food. Not to be missed if they\'re running during your stay.</p>'
        + '<img class="blog-photo-wide" src="assets/images/Bramble/Bramble%20Cover.jpeg" alt="Placeholder — replace with: outdoor supper club dining under festoon lights" loading="lazy">'

        + '<h2>Also worth a visit</h2>'

        + '<h3>Honey Caf\u00e9, Bronllys</h3>'
        + '<img class="blog-photo-left" src="assets/images/Holly/Holly-cabin-at-Wye-Glamping-in-Wales.webp" alt="Placeholder — replace with: the welcoming interior of the Honey Caf\u00e9 in Bronllys" loading="lazy">'
        + '<p>Open daily from 9am to 9pm, serving everything from breakfast to Tex Mex, sandwiches and children\'s meals. Reliable, welcoming and close to our countryside site.</p>'

        + '<h3>The Granary, Hay-on-Wye</h3>'
        + '<p>Home-cooked lunches and cakes in central Hay, right near the Town Clock. Perfect for a midday stop.</p>'

        + '<h3>The Old Electric Shop</h3>'
        + '<p>Not just a curiosity shop — they serve brilliant vegetarian and vegan lunches upstairs. Well worth combining a browse with a bite to eat.</p>'

        + '<h3>Foyles, Glasbury</h3>'
        + '<p>Quality dining indoors or in their expansive garden, with afternoon tea available too. Lovely on a sunny day.</p>'
        + '<div class="blog-photo-pair"><img src="assets/images/gainsborough.jpg" alt="Placeholder — replace with: garden terrace dining at Foyles in Glasbury" loading="lazy"><img src="assets/images/roundhouse-main.jpg" alt="Placeholder — replace with: afternoon tea spread at a local restaurant" loading="lazy"></div>'

        + '<h3>The Old Barn, Three Cocks</h3>'
        + '<p>Breakfast, lunch, dinner and afternoon tea — just be sure to book ahead as it\'s popular.</p>'

        + '<h3>The Old Railway Line Garden Centre</h3>'
        + '<p>Houses an on-site railway restaurant. Not the most obvious dining destination, but a fun one, especially for families.</p>'
    }
  };

  function renderBlogPost() {
    if (document.body.dataset.page !== 'blog') return;

    var params = new URLSearchParams(window.location.search);
    var slug = params.get('post');
    if (!slug) return;

    var post = BLOG_DATA[slug];
    if (!post) return;

    var listing = document.getElementById('blogListing');
    var article = document.getElementById('blogPost');
    var hero = document.getElementById('blogPostHero');
    var title = document.getElementById('blogPostTitle');
    var body = document.getElementById('blogPostBody');

    if (!listing || !article || !hero || !title || !body) return;

    listing.hidden = true;
    article.hidden = false;

    document.title = post.title + ' | Wye Glamping Blog';
    var descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute('content', post.title + ' — stories and guides from Wye Glamping.');
    }

    hero.src = toAssetUrl(post.heroImage);
    hero.alt = post.heroAlt;
    title.textContent = post.title;
    body.innerHTML = post.body;
  }

  renderSiteHeader();
  renderSiteFooter();
  setupMobileNav();
  renderStayPage();
  renderBlogPost();
  setupSubscribeForm();
})();
