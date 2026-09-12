/* ==========================================================================
   Brooke Stamps — portfolio behaviour
   Everything here is progressive enhancement. With JavaScript off you still
   get the full page: all ten project cards, the résumé (native <details>),
   and every link. This file adds the detail overlay on top.
   ========================================================================== */

(function () {
  'use strict';

  var ytThumb = function (id) { return 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg'; };
  var ytEmbed = function (id) { return 'https://www.youtube.com/embed/' + id + '?rel=0&autoplay=1'; };

  var grid = document.getElementById('grid');
  var overlay = document.getElementById('overlay');
  if (!grid || !overlay) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));

  /* Read one card's content out of the DOM. The markup is the single source
     of truth — edit index.html and this picks the change up for free. */
  function readCard(card) {
    var detail = card.querySelector('.card__detail');
    var list = function (sel) {
      return Array.prototype.map.call(card.querySelectorAll(sel), function (li) {
        return li.textContent.trim();
      });
    };
    var split = function (attr) {
      var v = detail ? (detail.getAttribute(attr) || '') : '';
      return v ? v.split(',').map(function (s) { return s.trim(); }).filter(Boolean) : [];
    };
    var videos = split('data-videos');
    var images = split('data-images');

    return {
      title: (card.querySelector('.card__title') || {}).textContent || '',
      kind:  (card.querySelector('.card__kind')  || {}).textContent || '',
      where: (card.querySelector('.card__where') || {}).textContent || '',
      year:  (card.querySelector('.card__year')  || {}).textContent || '',
      blurb: (card.querySelector('.card__blurb') || {}).textContent || '',
      tags: list('.card__alltags li'),
      link: detail ? detail.getAttribute('data-link') || '' : '',
      linkLabel: detail ? detail.getAttribute('data-link-label') || '' : '',
      // Videos first, then stills — the first item is what the card shows.
      media: videos.map(function (id) {
        return { thumb: ytThumb(id), embed: ytEmbed(id) };
      }).concat(images.map(function (src) {
        return { thumb: src, embed: '' };
      }))
    };
  }

  var data = cards.map(readCard);

  /* If a card has no video but does have stills listed in data-images, use the
     first still as its thumbnail instead of the placeholder. */
  cards.forEach(function (card, i) {
    var ph = card.querySelector('.card__ph');
    if (ph && data[i].media.length) {
      var img = document.createElement('img');
      img.src = data[i].media[0].thumb;
      img.alt = '';
      img.loading = 'lazy';
      ph.replaceWith(img);
    }
  });

  /* ---------------------------------------------------------------- overlay */

  var el = {
    frame:   document.getElementById('ov-frame'),
    extras:  document.getElementById('ov-extras'),
    kind:    document.getElementById('ov-kind'),
    where:   document.getElementById('ov-where'),
    title:   document.getElementById('ov-title'),
    year:    document.getElementById('ov-year'),
    blurb:   document.getElementById('ov-blurb'),
    tags:    document.getElementById('ov-tags'),
    link:    document.getElementById('ov-link'),
    counter: document.getElementById('ov-counter'),
    close:   document.getElementById('ov-close'),
    prev:    document.getElementById('ov-prev'),
    next:    document.getElementById('ov-next'),
    scrim:   document.getElementById('ov-scrim')
  };

  var current = -1;      // index of the open project, -1 when closed
  var lastFocused = null; // so focus goes back where it came from

  function renderFrame(project, playingEmbed) {
    el.frame.textContent = '';
    var first = project.media[0];

    if (playingEmbed) {
      var iframe = document.createElement('iframe');
      iframe.src = playingEmbed;
      iframe.title = project.title + ' video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      el.frame.appendChild(iframe);
      return;
    }

    if (first) {
      var img = document.createElement('img');
      img.src = first.thumb;
      img.alt = project.title;
      el.frame.appendChild(img);

      if (first.embed) {
        var play = document.createElement('button');
        play.type = 'button';
        play.className = 'overlay__playbtn';
        play.setAttribute('aria-label', 'Play video');
        play.innerHTML = '<span aria-hidden="true">&#9658;</span>';
        play.addEventListener('click', function () { renderFrame(project, first.embed); });
        el.frame.appendChild(play);
      }
      return;
    }

    // Nothing to show yet.
    var ph = document.createElement('div');
    ph.className = 'overlay__ph';
    ph.innerHTML = '<div><div class="overlay__ph-label">drop screenshot / clip here</div>' +
                   '<div class="overlay__ph-title"></div></div>';
    ph.querySelector('.overlay__ph-title').textContent = project.title;
    el.frame.appendChild(ph);
  }

  function renderExtras(project) {
    el.extras.textContent = '';
    project.media.slice(1).forEach(function (m) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'overlay__extra';
      b.setAttribute('aria-label', 'Show another clip from ' + project.title);
      var img = document.createElement('img');
      img.src = m.thumb;
      img.alt = '';
      img.loading = 'lazy';
      b.appendChild(img);
      b.addEventListener('click', function () { renderFrame(project, m.embed || ''); });
      el.extras.appendChild(b);
    });
  }

  function show(i) {
    if (i < 0 || i >= data.length) return;
    var p = data[i];
    current = i;

    el.kind.textContent  = p.kind;
    el.where.textContent = p.where;
    el.title.textContent = p.title;
    el.year.textContent  = p.year;
    el.blurb.textContent = p.blurb;

    el.tags.textContent = '';
    p.tags.forEach(function (t) {
      var li = document.createElement('li');
      li.textContent = t;
      el.tags.appendChild(li);
    });

    if (p.link) {
      el.link.href = p.link;
      el.link.textContent = (p.linkLabel || 'Take a look') + ' ↗';
      el.link.hidden = false;
    } else {
      el.link.hidden = true;
      el.link.removeAttribute('href');
    }

    el.counter.textContent = (i + 1) + ' of ' + data.length;
    renderFrame(p, '');
    renderExtras(p);
  }

  function open(i) {
    lastFocused = document.activeElement;
    show(i);
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    el.close.focus();
  }

  function close() {
    overlay.hidden = true;
    current = -1;
    el.frame.textContent = '';   // stops any playing video
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function step(d) {
    if (current < 0) return;
    show((current + d + data.length) % data.length);
  }

  cards.forEach(function (card, i) {
    var btn = card.querySelector('.card__btn');
    if (btn) btn.addEventListener('click', function () { open(i); });
  });

  el.close.addEventListener('click', close);
  el.scrim.addEventListener('click', close);
  el.prev.addEventListener('click', function () { step(-1); });
  el.next.addEventListener('click', function () { step(1); });

  var shuffle = document.getElementById('shuffle');
  if (shuffle) {
    shuffle.addEventListener('click', function () {
      var n = current;
      while (data.length > 1 && n === current) n = Math.floor(Math.random() * data.length);
      if (current < 0) open(n); else show(n);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (overlay.hidden) return;
    if (e.key === 'Escape')     { close(); return; }
    if (e.key === 'ArrowLeft')  { step(-1); return; }
    if (e.key === 'ArrowRight') { step(1);  return; }

    // Keep Tab inside the dialog while it is open.
    if (e.key !== 'Tab') return;
    var focusable = overlay.querySelectorAll(
      'a[href], button:not([disabled]):not([tabindex="-1"]), iframe, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ------------------------------------------------------- résumé expand all */

  var expandBtn = document.getElementById('expand-all');
  var roles = Array.prototype.slice.call(document.querySelectorAll('.role'));
  if (expandBtn && roles.length) {
    var syncLabel = function () {
      var allOpen = roles.every(function (r) { return r.open; });
      expandBtn.textContent = allOpen ? 'Collapse all' : 'Expand all';
    };
    expandBtn.addEventListener('click', function () {
      var allOpen = roles.every(function (r) { return r.open; });
      roles.forEach(function (r) { r.open = !allOpen; });
      syncLabel();
    });
    roles.forEach(function (r) { r.addEventListener('toggle', syncLabel); });
    syncLabel();
  }

  /* ------------------------------------------------------------ featured loop */
  /* The looping clip reveals itself only once it is actually playing, and never
     if the visitor asked for reduced motion. A missing file leaves the poster. */

  var reduceMotion = window.matchMedia &&
                     window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  Array.prototype.forEach.call(document.querySelectorAll('.card__loop'), function (video) {
    if (reduceMotion) { video.removeAttribute('autoplay'); video.pause(); return; }

    video.addEventListener('playing', function () { video.classList.add('is-playing'); });
    video.addEventListener('error', function () { video.classList.remove('is-playing'); }, true);

    // Some browsers hold autoplay until the tab is interacted with; asking
    // explicitly covers that, and a refusal just leaves the poster up.
    var attempt = video.play();
    if (attempt && attempt.catch) attempt.catch(function () { /* poster stays */ });

    // Don't burn battery on a card nobody is looking at.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var pl = video.play();
            if (pl && pl.catch) pl.catch(function () {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.1 }).observe(video);
    }
  });

  /* --------------------------------------------------------- image fallback */
  /* If a thumbnail 404s (a video went private, a filename is wrong), show the
     striped placeholder instead of a broken-image icon. */

  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    if (img.dataset.failed) return;
    img.dataset.failed = '1';

    var ph = document.createElement('div');
    if (img.closest('.card__media')) {
      ph.className = 'card__ph';
      ph.textContent = 'drop screenshot or clip here';
    } else if (img.closest('.overlay__frame')) {
      ph.className = 'overlay__ph';
      ph.innerHTML = '<div><div class="overlay__ph-label">image unavailable</div></div>';
    } else {
      img.style.visibility = 'hidden';
      return;
    }
    img.replaceWith(ph);
  }, true); // capture: error on <img> does not bubble

  /* ------------------------------------------------------------------ footer */

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
