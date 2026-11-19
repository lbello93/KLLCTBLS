/* kllctbls — site interactions (vanilla, no dependencies) */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const navH = () => { const h = $('.site-header'); return h ? Math.round(h.getBoundingClientRect().height) : 0; };

  /* ───────── Mobile menu ───────── */
  const menuBtn = $('.menu-btn');
  const mobileNav = $('#mobile-nav');
  if (menuBtn && mobileNav) {
    const set = (open) => {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mobileNav.hidden = !open;
    };
    menuBtn.addEventListener('click', () => set(menuBtn.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mobileNav.hidden) { set(false); menuBtn.focus(); } });
    matchMedia('(min-width: 760px)').addEventListener('change', (e) => { if (e.matches) set(false); });
  }

  /* ───────── Reveal on scroll ───────── */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -30px 0px', threshold: 0.01 });
    revealEls.forEach((el) => io.observe(el));
    setTimeout(() => revealEls.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add('is-in'); }), 1800);
  } else revealEls.forEach((el) => el.classList.add('is-in'));

  /* ───────── Count-up (rolling digits) ───────── */
  function countUp(el) {
    const target = parseFloat(el.dataset.count) || 0;
    const str = (el.dataset.prefix || '') + target.toLocaleString('en-US') + (el.dataset.suffix || '');
    el.setAttribute('aria-label', str);
    el.classList.add('roll');
    el.textContent = '';
    let d = 0;
    const cols = [];
    [...str].forEach((c) => {
      const cell = document.createElement('span');
      cell.setAttribute('aria-hidden', 'true');
      if (!/\d/.test(c)) { cell.textContent = c; el.appendChild(cell); return; }
      const loops = 1 + d; d++;
      cell.className = 'roll__cell';
      const col = document.createElement('span');
      col.className = 'roll__col';
      const n = loops * 10 + Number(c);
      for (let k = 0; k <= n; k++) { const s = document.createElement('span'); s.textContent = k % 10; col.appendChild(s); }
      cell.appendChild(col); el.appendChild(cell);
      cols.push({ col, n, i: d });
    });
    const roll = () => {
      cols.forEach(({ col, n, i }) => {
        col.style.transition = 'none'; col.style.transform = 'translateY(0)';
        void col.offsetHeight;
        if (reduce) { col.style.transform = `translateY(-${n}em)`; return; }
        col.style.transition = `transform ${1100 + i * 260}ms cubic-bezier(.16,.84,.3,1.06) ${i * 70}ms`;
        col.style.transform = `translateY(-${n}em)`;
      });
    };
    requestAnimationFrame(roll);
    let last = 0;
    const again = () => { const t = performance.now(); if (t - last > 2600) { last = t; roll(); } };
    el.addEventListener('pointerenter', again);
    el.addEventListener('click', again);
  }
  const counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { cio.unobserve(en.target); countUp(en.target); } });
    }, { threshold: 0.4 });
    counters.forEach((el) => cio.observe(el));
  }

  /* ───────── 3D tilt cards (mouse + touch) ───────── */
  $$('[data-card3d]').forEach((el) => {
    const base = () => getComputedStyle(el).getPropertyValue('--base').trim() || '0deg';
    const rest = () => {
      el.style.transition = 'transform .55s cubic-bezier(.2,.9,.25,1), filter .55s ease-out';
      el.style.transform = '';
      el.style.filter = '';
    };
    const tilt = (x, y) => {
      const r = el.getBoundingClientRect();
      const dx = clamp((x - r.left) / r.width, 0, 1) - 0.5;
      const dy = clamp((y - r.top) / r.height, 0, 1) - 0.5;
      el.style.transition = 'transform .08s linear, filter .2s ease-out';
      el.style.transform = `perspective(900px) rotateY(${(dx * 22).toFixed(2)}deg) rotateX(${(-dy * 18).toFixed(2)}deg) rotate(${base()}) scale(1.05)`;
      el.style.filter = `drop-shadow(${(-dx * 30).toFixed(0)}px ${(26 + dy * 12).toFixed(0)}px 42px rgba(61,9,86,0.23))`;
    };
    if (reduce) return;
    el.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') tilt(e.clientX, e.clientY); });
    el.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') rest(); });
    // Touch: tilt follows the finger without blocking page scroll
    el.addEventListener('touchstart', (e) => { const t = e.touches[0]; tilt(t.clientX, t.clientY); }, { passive: true });
    el.addEventListener('touchmove', (e) => { const t = e.touches[0]; tilt(t.clientX, t.clientY); }, { passive: true });
    el.addEventListener('touchend', rest, { passive: true });
    el.addEventListener('touchcancel', rest, { passive: true });
  });

  /* ───────── Misprint ink-shift ───────── */
  $$('[data-misprint]').forEach((el) => {
    const layers = $$('[data-mis]', el);
    const big = el.classList.contains('nf-card');
    const set = (x, y) => layers.forEach((l) => { const s = parseFloat(l.dataset.mis); l.style.transform = `translate(${(s * x).toFixed(1)}px,${(-s * y).toFixed(1)}px)`; });
    const move = (cx, cy) => {
      const r = el.getBoundingClientRect();
      const dx = (cx - r.left) / r.width - 0.5, dy = (cy - r.top) / r.height - 0.5;
      big ? set(6 + dx * 22, 3 + dy * 16) : set(4 + dx * 14, 2 + dy * 10);
    };
    const restXY = big ? [6, 3] : [4, 2];
    el.addEventListener('pointermove', (e) => move(e.clientX, e.clientY));
    el.addEventListener('pointerleave', () => set(...restXY));
    el.addEventListener('touchmove', (e) => move(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    el.addEventListener('touchend', () => set(...restXY), { passive: true });
  });

  /* ───────── Holo sheen follows pointer / finger ───────── */
  $$('[data-holo]').forEach((el) => {
    const at = (cx, cy) => {
      const r = el.getBoundingClientRect();
      const x = clamp((cx - r.left) / r.width, 0, 1) * 100, y = clamp((cy - r.top) / r.height, 0, 1) * 100;
      el.style.setProperty('--mx', x.toFixed(1) + '%'); el.style.setProperty('--my', y.toFixed(1) + '%');
      el.style.setProperty('--hx', x.toFixed(1) + '%'); el.style.setProperty('--hy', y.toFixed(1) + '%');
    };
    el.addEventListener('pointermove', (e) => at(e.clientX, e.clientY));
    el.addEventListener('touchstart', (e) => { el.classList.add('is-touch'); at(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    el.addEventListener('touchmove', (e) => at(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    const off = () => setTimeout(() => el.classList.remove('is-touch'), 350);
    el.addEventListener('touchend', off, { passive: true });
    el.addEventListener('touchcancel', off, { passive: true });
  });

  /* Holo shine on touch for CTAs + illustration boxes (hover-only in the design) */
  if (coarse && !reduce) {
    $$('.holo-cta, .holo-ill-box').forEach((el) => {
      el.addEventListener('touchstart', () => { el.classList.add('is-shine'); }, { passive: true });
      el.addEventListener('touchend', () => setTimeout(() => el.classList.remove('is-shine'), 900), { passive: true });
    });
    if ('IntersectionObserver' in window) {
      const sio = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-shine'); sio.unobserve(en.target); } }), { threshold: 0.6 });
      $$('.holo-ill-box').forEach((el) => sio.observe(el));
    }
  }

  /* ───────── Accordions: open on scroll + smooth open/close ───────── */
  const EASE = 'cubic-bezier(.2,.8,.2,1)';
  const animating = new WeakMap();
  const setOpen = (d, open, smooth = true) => {
    if (d.open === open && !animating.has(d)) return;
    const panel = $('.acc-panel', d);
    const prev = animating.get(d); if (prev) prev.cancel();
    if (!smooth || reduce || !panel || !panel.animate) { d.open = open; return; }
    if (open) {
      d.open = true;
      const h = panel.offsetHeight;
      const a = panel.animate([{ height: '0px', opacity: 0, transform: 'translateY(-10px)' }, { height: h + 'px', opacity: 1, transform: 'none' }], { duration: Math.min(900, 380 + h * 0.6), easing: EASE });
      panel.style.overflow = 'hidden';
      animating.set(d, a);
      a.onfinish = a.oncancel = () => { panel.style.overflow = ''; animating.delete(d); };
    } else {
      const h = panel.offsetHeight;
      panel.style.overflow = 'hidden';
      const a = panel.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 420, easing: EASE });
      animating.set(d, a);
      a.onfinish = () => { d.open = false; panel.style.overflow = ''; animating.delete(d); };
      a.oncancel = () => { panel.style.overflow = ''; animating.delete(d); };
    }
  };
  /* Scroll-driven mode (when an open panel fits on screen): the section pins, and scroll
     position itself morphs one panel into the next — no timed animations, no page jumps. */
  function scrubAcc(acc) {
    const sec = acc.closest('section'), inner = acc.parentElement;
    const items = $$('details', acc);
    const n = items.length;
    if (!sec || !inner || n < 2 || reduce) return null;
    // wrap each panel in a clip box whose height scroll controls
    const clips = items.map((d) => {
      const p = $('.acc-panel', d);
      const c = document.createElement('div'); c.className = 'acc-clip';
      p.parentNode.insertBefore(c, p); c.appendChild(p);
      return c;
    });
    const ctl = { on: false, S: 0 };
    const GAP = 16; // space between the header and the pinned accordion
    let H = [], cur = 0, target = 0, raf = 0, lift = 0;
    const smooth = (t) => t * t * (3 - 2 * t);
    const render = (p) => {
      const i0 = Math.min(n - 2, Math.floor(p)), f = p - i0;
      const t = smooth(clamp((f - 0.15) / 0.7, 0, 1)); // hold each panel a little at both ends
      items.forEach((d, i) => {
        const a = i === i0 ? 1 - t : i === i0 + 1 ? t : 0;
        clips[i].style.height = (a * H[i]).toFixed(1) + 'px';
        clips[i].style.opacity = String(Math.min(1, a * 1.4));
        d.classList.toggle('is-on', a > 0.5);
      });
    };
    // pinning starts once the title has scrolled away and the accordion reaches the header
    const progress = () => clamp((navH() - lift - sec.getBoundingClientRect().top) / ctl.S, 0, n - 1);
    const tick = () => {
      raf = 0;
      cur += (target - cur) * 0.2; // gentle follow for a silky feel
      if (Math.abs(target - cur) < 0.0005) cur = target;
      render(cur);
      if (cur !== target) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => { if (!ctl.on) return; target = progress(); if (!raf) raf = requestAnimationFrame(tick); };
    const disable = () => {
      ctl.on = false;
      sec.classList.remove('acc-scrub'); sec.style.height = '';
      inner.style.top = ''; inner.style.height = '';
      clips.forEach((c) => { c.style.height = ''; c.style.opacity = ''; });
      items.forEach((d, i) => { d.classList.remove('is-on'); d.open = i === 0; });
    };
    const setup = () => {
      sec.classList.add('acc-scrub');
      items.forEach((d) => { d.open = true; });
      clips.forEach((c) => { c.style.height = 'auto'; });
      H = clips.map((c) => c.offsetHeight);
      const vh = innerHeight, nh = navH(), avail = vh - nh;
      const sums = items.reduce((s, d) => s + $('summary', d).offsetHeight, 0);
      // only the accordion has to fit: the title above it scrolls away before pinning
      const need = sums + Math.max(...H) + GAP + 20;
      if (innerWidth < 760 || need > avail) { disable(); return false; }
      lift = acc.offsetTop - GAP; // title block height above the accordion
      inner.style.top = (nh - lift) + 'px';
      inner.style.height = (avail + lift) + 'px';
      ctl.S = Math.max(360, vh * 0.6);
      sec.style.height = Math.round(avail + lift + (n - 1) * ctl.S + ctl.S * 0.35) + 'px';
      ctl.on = true;
      cur = target = progress(); render(cur);
      return true;
    };
    // scroll position for panel i (used by clicks and the hero pills)
    ctl.go = (i, smoothScroll = true) => {
      const top = sec.getBoundingClientRect().top + scrollY - navH() + lift + i * ctl.S + (i ? 2 : 0);
      scrollTo({ top, behavior: smoothScroll ? 'smooth' : 'auto' });
    };
    ctl.index = (d) => items.indexOf(d);
    items.forEach((d, i) => $('summary', d).addEventListener('click', (e) => {
      if (!ctl.on) return;
      e.preventDefault(); e.stopImmediatePropagation();
      ctl.go(i);
    }));
    addEventListener('scroll', onScroll, { passive: true });
    let w0 = innerWidth, h0 = innerHeight;
    addEventListener('resize', () => {
      if (innerWidth === w0 && Math.abs(innerHeight - h0) < 140) return;
      w0 = innerWidth; h0 = innerHeight;
      disable(); setup();
    });
    // measure after fonts/images settle
    setup();
    addEventListener('load', () => { disable(); setup(); }, { once: true });
    return ctl;
  }

  $$('[data-acc]').forEach((acc) => {
    acc._scrub = scrubAcc(acc);
    const scrubOn = () => acc._scrub && acc._scrub.on;
    const items = $$('details', acc);
    const busy = () => items.some((d) => animating.has(d));
    // While panels slide, cancel out the layout shift around `el` so the reader's place holds.
    // Only the layout delta is corrected, so the user's own scrolling isn't fought.
    let holding = false;
    const hold = (el) => {
      holding = true;
      let doc = el.getBoundingClientRect().top + scrollY;
      const loop = () => {
        const now = el.getBoundingClientRect().top + scrollY;
        if (Math.abs(now - doc) > 0.5) scrollBy(0, now - doc);
        doc = el.getBoundingClientRect().top + scrollY;
        if (busy()) requestAnimationFrame(loop);
        else { holding = false; lastY = scrollY; }
      };
      requestAnimationFrame(loop);
    };
    // one open at a time: open k, close the rest
    const activate = (k, smooth = true, keep = null) => {
      lastK = k;
      items.forEach((d, i) => setOpen(d, i === k, smooth));
      if (keep && smooth && !reduce) hold(keep);
    };
    acc._activate = (d, smooth) => activate(items.indexOf(d), smooth);
    // click: smooth toggle (opening one closes the others; the clicked title stays put)
    items.forEach((d, i) => $('summary', d).addEventListener('click', (e) => {
      e.preventDefault();
      if (scrubOn()) return;
      if (d.open) setOpen(d, false); else activate(i, true, $('summary', d));
    }));
    // scroll: when a new title crosses the middle of the screen, it opens and the others close
    const centred = () => {
      // at the very bottom of the page the last titles can't reach the middle, so count what's on screen
      const atEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
      const line = atEnd ? innerHeight - 90 : innerHeight * 0.5;
      let k = 0;
      items.forEach((d, i) => { if ($('summary', d).getBoundingClientRect().top < line) k = i; });
      return k;
    };
    let lastK = Math.max(0, items.findIndex((d) => d.open)), lastY = scrollY, raf = 0;
    function check() {
      raf = 0;
      if (holding || scrubOn()) return;
      // follow the user's scroll direction only, so layout shifts can't flip panels back and forth
      const y = scrollY, dir = Math.sign(y - lastY);
      lastY = y;
      const k = centred();
      if (k !== lastK && Math.sign(k - lastK) === dir) activate(k, true, $('summary', items[k]));
    }
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(check); }, { passive: true });
  });
  const openService = (id, scroll) => {
    const d = document.getElementById(id);
    if (!d || d.tagName !== 'DETAILS') return false;
    const acc = d.closest('[data-acc]');
    if (acc && acc._scrub && acc._scrub.on) { acc._scrub.go(acc._scrub.index(d), scroll); return true; }
    if (acc && acc._activate) acc._activate(d, scroll); else setOpen(d, true, scroll);
    if (scroll) requestAnimationFrame(() => d.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }));
    return true;
  };
  $$('[data-open]').forEach((a) => a.addEventListener('click', (e) => {
    if (openService(a.dataset.open, true)) { e.preventDefault(); history.replaceState(null, '', '#' + a.dataset.open); }
  }));
  if (location.hash) openService(decodeURIComponent(location.hash.slice(1)), false);

  /* ───────── Home: scroll-scrubbed hero ───────── */
  const hero = $('[data-hero]');
  if (hero) {
    const sticky = $('.hero-scrub__sticky', hero);
    const canvas = $('canvas', hero);
    const cue = $('.hero-scrub__cue', hero);
    const ctx = canvas.getContext('2d');
    const N = 72;
    const portrait = matchMedia('(max-aspect-ratio: 1/1)').matches;
    const dir = portrait ? '/assets/hero-m/' : '/assets/hero/';
    const frames = new Array(N);
    const src = (i) => dir + 'f' + String(i).padStart(3, '0') + '.webp';
    const load = (i) => new Promise((res) => {
      if (frames[i]) return res();
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => { frames[i] = im; res(); schedule(); };
      im.onerror = () => res();
      im.src = src(i);
    });
    // Progressive order: coarse keyframes first, then fill the gaps
    const order = [];
    for (const step of [12, 6, 3, 1]) for (let i = 0; i < N; i += step) if (!order.includes(i)) order.push(i);
    const loadAll = async () => {
      let k = 0;
      const worker = async () => { while (k < order.length) await load(order[k++]); };
      await Promise.all([worker(), worker(), worker(), worker()]);
    };
    // SCRUB = true: tall hero, frames move only with scroll (no autoplay).
    // SCRUB = false: normal-height hero that just loops: play through, hold the last frame, repeat.
    const SCRUB = true;
    const FPS = 24, HOLD = 1800, PLAY = (N / FPS) * 1000;
    const canAuto = !SCRUB && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ready = false, t0 = 0, wasTop = true;
    const startLoop = () => { ready = true; t0 = performance.now(); schedule(); };
    load(0).then(() => {
      const go = () => loadAll().then(() => { if (canAuto) startLoop(); });
      if (document.readyState === 'complete') go(); else addEventListener('load', go, { once: true });
    });

    let vh = innerHeight, vw = innerWidth, last = -1, raf = 0;
    const layout = () => {
      const nh = navH();
      const hh = vh - nh;
      hero.style.height = (SCRUB ? hh + vh * 1.5 : hh) + 'px';
      sticky.style.height = hh + 'px';
      sticky.style.top = nh + 'px';
      const dpr = Math.min(2, devicePixelRatio || 1);
      const cw = Math.round(sticky.clientWidth * dpr), ch = Math.round(hh * dpr);
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; last = -1; }
    };
    const nearest = (i) => {
      for (let d = 0; d < N; d++) {
        if (i - d >= 0 && frames[i - d]) return i - d;
        if (i + d < N && frames[i + d]) return i + d;
      }
      return -1;
    };
    const draw = () => {
      raf = 0;
      const nh = navH();
      const top = hero.getBoundingClientRect().top;
      const p = clamp(-(top - nh) / (SCRUB ? vh * 1.5 : vh - nh), 0, 1);
      if (cue) cue.style.opacity = String(Math.max(0, 1 - p * 6));
      // without scrub, loop whenever any of the hero is on screen
      const atTop = SCRUB ? p <= 0.002 : p < 1;
      let want;
      if (ready && atTop && !document.hidden) {
        const now = performance.now();
        if (!wasTop) t0 = now + 600; // back at the top: rest on frame 0, then loop again
        const t = (now - t0) % (PLAY + HOLD);
        want = now < t0 ? 0 : Math.min(N - 1, Math.floor((t / 1000) * FPS));
        raf = requestAnimationFrame(draw); // keep the loop ticking
      } else if (SCRUB) {
        want = Math.round(p * (N - 1));
      } else {
        want = last < 0 ? 0 : last; // off screen / reduced motion: stay put
      }
      wasTop = atTop;
      const i = nearest(want);
      if (i < 0 || i === last) return;
      last = i;
      const img = frames[i];
      const cw = canvas.width, ch = canvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const sw = cw / s, sh = ch / s;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, cw, ch);
      hero.classList.add('is-live');
    };
    function schedule() { if (!raf) raf = requestAnimationFrame(draw); }
    layout(); schedule();
    addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    // Only re-layout on real size changes (ignore mobile URL-bar show/hide jitter)
    addEventListener('resize', () => {
      if (innerWidth !== vw || Math.abs(innerHeight - vh) > 140) { vw = innerWidth; vh = innerHeight; layout(); last = -1; schedule(); }
    });
  }

  /* ───────── Home hero video: portrait or landscape file, plays only on screen ───────── */
  const heroV = $('[data-hero-video]');
  if (heroV) {
    const v = $('video', heroV);
    const cue = $('.hero-scrub__cue', heroV);
    if (cue) addEventListener('scroll', () => { cue.style.opacity = String(Math.max(0, 1 - scrollY / 120)); }, { passive: true });
    if (v && !reduce) {
      v.muted = true;
      v.src = matchMedia('(max-aspect-ratio: 1/1)').matches ? v.dataset.srcM : v.dataset.src;
      v.preload = 'auto';
      v.addEventListener('playing', () => heroV.classList.add('is-playing'), { once: true });
      const play = () => v.play().catch(() => {});
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(([e]) => { if (e.isIntersecting) play(); else v.pause(); }).observe(heroV);
      } else play();
      document.addEventListener('visibilitychange', () => { if (document.hidden) v.pause(); else if (heroV.getBoundingClientRect().bottom > 0) play(); });
    }
  }

  /* ───────── Background videos: load when near, play only on screen ───────── */
  $$('[data-bg-video]').forEach((v) => {
    if (reduce || !('IntersectionObserver' in window)) return; // poster only
    v.muted = true;
    let loaded = false;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!loaded) { loaded = true; v.src = v.dataset.src; v.preload = 'auto'; }
        v.play().catch(() => {});
      } else if (loaded) v.pause();
    }, { rootMargin: '200px 0px' }).observe(v);
  });

  /* ───────── Home: pack tear ───────── */
  const pack = $('[data-pack]');
  if (pack) initPack(pack);

  function initPack(root) {
    const stage = $('.pack__stage', root);
    const cards = $$('.pack-card', root);
    const body = $('[data-layer="body"]', root), top = $('[data-layer="top"]', root);
    const sparks = $$('.pack-spark', root);
    const glow = $('.pack__glow', root);
    const hit = $('.pack__hit', root);
    const hint = $('.pack__hint', root);
    const reseal = $('.pack__reseal', root);
    const SPRING = 'transform 560ms cubic-bezier(.22,1.2,.36,1)';
    const TEAR = 17;
    const ZIG = [];
    for (let k = 0; k <= 20; k++) { const amp = 1.1 + ((k * 37) % 5) * 0.28; ZIG.push((k / 20 * 100).toFixed(2) + '% ' + (TEAR + (k % 2 ? amp : -amp)).toFixed(2) + '%'); }
    $('.pack-layer__clip', body).style.clipPath = 'polygon(' + ZIG.join(', ') + ', 100% 100%, 0% 100%)';
    $('.pack-layer__clip', top).style.clipPath = 'polygon(0% 0%, 100% 0%, ' + ZIG.slice().reverse().join(', ') + ')';

    const s = { phase: 0, hover: false, hoverCard: -1, drag: null, w: stage.clientWidth || 1000 };
    let timers = [], start = null, lastDy = 0, closeAt = 100, released = false;
    const set = (patch) => { Object.assign(s, patch); render(); };
    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

    const tear = () => {
      if (s.phase !== 0) return;
      clearTimers();
      set({ phase: 1, hover: false });
      timers.push(setTimeout(() => set({ phase: 2 }), 480));
      timers.push(setTimeout(() => set({ phase: 3 }), 1220));
      timers.push(setTimeout(() => set({ phase: 4 }), 1640));
    };
    const close = () => { clearTimers(); set({ phase: 0, hover: false, hoverCard: -1, drag: null }); };

    function render() {
      const ph = s.phase, dealt = ph >= 3, W = s.w || 1000;
      const cardW = Math.min(280, Math.max(220, W - 48));
      const cardH = Math.round(cardW * 1.45);
      const packW = Math.round(cardW * 1.14);
      const packH = Math.round(packW * 830 / 488);
      const packY = Math.round(cardH * 0.2);
      const gap = 28;
      const row = W >= cardW * 3 + gap * 2 + 24;
      const stageH = dealt ? (row ? cardH + 170 : cardH * 3 + 36 * 2 + 60) : Math.round(cardH * 1.8 + 20);
      stage.style.height = stageH + 'px';

      cards.forEach((el, i) => {
        const off = i - 1;
        let x, y, r, sc, z, delay;
        if (ph <= 1) { x = 0; y = packY; r = 0; sc = 0.94; z = 10; delay = (2 - i) * 40; }
        else if (ph === 2) { x = off * cardW * 0.2; y = packY - cardH * 0.6 + Math.abs(off) * 18; r = off * 7; sc = 0.97; z = 10; delay = i * 70; }
        else {
          x = row ? off * (cardW + gap) : 0;
          y = row ? -6 : off * (cardH + 36);
          r = 0; sc = 1.03; z = ph >= 4 ? 50 : 10; delay = i * 60;
          if (s.hoverCard === i) { sc = 1.07; z = 100; }
        }
        const d = s.drag && s.drag.i === i ? s.drag : null;
        if (d) {
          const mx = Math.max(0, (W - cardW * 1.12) / 2), my = Math.max(0, (stageH - cardH * 1.12) / 2);
          const nx = clamp(x + d.dx, -mx, mx), ny = clamp(y + d.dy, -my, my);
          closeAt = clamp((my - y) * 0.7, 30, 100);
          lastDy = ny - y;
          x = nx; y = ny; r = 5; sc = 1.12; z = 150;
        }
        const lifted = dealt && (s.hoverCard === i || d);
        Object.assign(el.style, {
          left: `calc(50% - ${cardW / 2}px)`, top: `calc(50% - ${cardH / 2}px)`, width: cardW + 'px', height: cardH + 'px',
          transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${r}deg) scale(${sc})`,
          transition: d ? 'none' : `${SPRING} ${reduce ? 0 : delay}ms`,
          zIndex: z, cursor: dealt ? (d ? 'grabbing' : 'grab') : 'pointer', pointerEvents: dealt ? 'auto' : 'none',
        });
        el.setAttribute('aria-hidden', dealt ? 'false' : 'true');
        $('.pack-card__explore', el).tabIndex = dealt ? 0 : -1;
        const flip = $('.pack-card__flip', el);
        flip.style.transform = dealt ? 'rotateY(0deg)' : 'rotateY(180deg)';
        flip.style.transition = `transform 620ms cubic-bezier(.3,1.25,.4,1) ${dealt ? 180 + i * 90 : 0}ms`;
        const shadow = lifted ? '0 34px 60px rgba(61,9,86,0.28)' : '0 18px 36px rgba(61,9,86,0.18)';
        $('.pack-card__face', el).style.boxShadow = shadow;
        $('.pack-card__back', el).style.boxShadow = shadow;
        $('.pack-card__ui', el).style.transform = `scale(${(cardW / 280).toFixed(4)})`;
      });

      const hov = ph === 0 && s.hover;
      let topTf, topOp, topTr, bodyTf, bodyOp, bodyTr;
      if (ph === 0) {
        topTf = hov ? `translate(0px,${packY - 10}px) rotate(-4deg)` : `translate(0px,${packY}px) rotate(0deg)`;
        topOp = 1; topTr = 'transform 440ms cubic-bezier(.22,1.25,.36,1) 360ms, opacity 260ms ease 360ms';
        bodyTf = hov ? `translate(0px,${packY - 8}px) rotate(-1.5deg) scale(1)` : `translate(0px,${packY}px) rotate(0deg) scale(1)`;
        bodyOp = 1; bodyTr = 'transform 440ms cubic-bezier(.22,1.25,.36,1) 260ms, opacity 300ms ease 260ms';
      } else {
        topTf = `translate(${Math.round(packW * 0.32)}px,${Math.round(packY - cardH * 0.55)}px) rotate(-26deg)`;
        topOp = 0; topTr = 'transform 780ms cubic-bezier(.2,.75,.3,1), opacity 420ms ease 320ms';
        if (ph === 1) bodyTf = `translate(0px,${packY + 5}px) rotate(0.8deg) scale(1)`;
        else if (ph === 2) bodyTf = `translate(0px,${packY + 12}px) rotate(0deg) scale(1)`;
        else bodyTf = `translate(0px,${Math.round(packY + packH * 0.8)}px) rotate(6deg) scale(.9)`;
        bodyOp = dealt ? 0 : 1;
        bodyTr = dealt ? 'transform 620ms cubic-bezier(.55,0,.75,.35), opacity 420ms ease 200ms' : 'transform 380ms cubic-bezier(.22,1.25,.36,1), opacity 300ms ease';
      }
      [[body, bodyTf, bodyOp, bodyTr, 20], [top, topTf, topOp, topTr, 22]].forEach(([el, tf, op, tr, z]) => Object.assign(el.style, {
        left: `calc(50% - ${packW / 2}px)`, top: `calc(50% - ${packH / 2}px)`, width: packW + 'px', height: packH + 'px',
        transform: tf, opacity: op, transition: reduce ? 'none' : tr, zIndex: z,
      }));

      const bursting = ph === 1 || ph === 2;
      sparks.forEach((sp, k) => {
        sp.style.left = `calc(50% - ${packW / 2}px + ${Math.round(parseFloat(sp.dataset.f) * packW)}px)`;
        sp.style.top = `calc(50% + ${Math.round(packY - packH / 2 + packH * TEAR / 100)}px)`;
        sp.style.animation = bursting && !reduce ? `sparkPop 820ms cubic-bezier(.2,.8,.3,1) ${k * 45}ms both` : 'none';
      });
      glow.style.opacity = bursting ? 1 : 0.75;
      glow.style.transform = `translate(-50%,-50%) scale(${ph === 2 ? 1.15 : 1})`;

      Object.assign(hit.style, { top: `calc(50% + ${packY}px)`, width: packW + 40 + 'px', height: packH + 40 + 'px', pointerEvents: ph === 0 ? 'auto' : 'none' });
      hit.hidden = ph !== 0;
      hit.setAttribute('aria-expanded', String(ph > 0));
      hint.textContent = dealt ? (coarse ? 'Tap Explore on any card — or reseal the pack' : 'Drag any card down to reseal the pack') : 'Tap or scroll to tear it open';
      reseal.hidden = !dealt;
    }

    // Interactions
    hit.addEventListener('click', () => { released = true; tear(); });
    hit.addEventListener('mouseenter', () => s.phase === 0 && set({ hover: true }));
    hit.addEventListener('mouseleave', () => set({ hover: false }));
    reseal.addEventListener('click', () => { close(); released = true; hit.focus({ preventScroll: true }); });

    cards.forEach((el, i) => {
      el.addEventListener('mouseenter', () => s.phase >= 3 && set({ hoverCard: i }));
      el.addEventListener('mouseleave', () => set({ hoverCard: -1 }));
      el.addEventListener('pointerdown', (e) => {
        if (s.phase < 3 || e.target.closest('a')) return;
        el.setPointerCapture(e.pointerId);
        start = { x: e.clientX, y: e.clientY };
        lastDy = 0;
        set({ drag: { i, dx: 0, dy: 0 } });
      });
      el.addEventListener('pointermove', (e) => {
        if (!s.drag || !start) return;
        set({ drag: { i: s.drag.i, dx: e.clientX - start.x, dy: e.clientY - start.y } });
      });
      const up = () => {
        start = null;
        if (!s.drag) return;
        if (lastDy > closeAt) close(); else set({ drag: null });
      };
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });

    // Resize
    if ('ResizeObserver' in window) {
      new ResizeObserver(() => requestAnimationFrame(() => { const w = stage.clientWidth; if (w && w !== s.w) set({ w }); })).observe(stage);
    }

    // Scroll-to-tear
    if (!reduce) {
      if (coarse) {
        // Touch: tear as the pack scrolls into the middle of the screen (never traps the page scroll)
        const io = new IntersectionObserver((entries) => entries.forEach((en) => {
          if (en.isIntersecting && s.phase === 0 && !released) { tear(); released = true; io.disconnect(); }
        }), { rootMargin: '-35% 0px -35% 0px', threshold: 0 });
        io.observe(hit);
      } else {
        // Mouse/trackpad: hold the page on the sealed pack, the next scroll tears it, then release
        let lockOn = false, lockTop = 0, releaseT;
        const locked = () => lockOn && !released;
        const pull = () => { if (s.phase !== 0) return; tear(); clearTimeout(releaseT); releaseT = setTimeout(() => { released = true; }, 1900); };
        const onScroll = () => {
          if (released) return;
          if (locked()) { if (Math.abs(scrollY - lockTop) > 1) scrollTo(0, lockTop); return; }
          if (s.phase !== 0) return;
          const r = stage.getBoundingClientRect();
          const vh = innerHeight || 800, nh = navH();
          const inView = r.height <= vh - nh ? r.top >= nh - 8 && r.bottom <= vh + 8 : r.top <= vh * 0.2 && r.bottom >= vh * 0.8;
          if (inView) { lockOn = true; lockTop = scrollY; }
        };
        const onIntent = (e) => {
          if (!locked()) return;
          if (e.type === 'keydown' && !['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) return;
          if (e.type === 'keydown' && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
          if (e.cancelable) e.preventDefault();
          pull();
        };
        addEventListener('scroll', onScroll, { passive: true });
        addEventListener('wheel', onIntent, { passive: false });
        addEventListener('keydown', onIntent);
      }
    }
    render();
  }

  /* ───────── Home: show pass steps ───────── */
  const passOuter = $('[data-pass]');
  if (passOuter) {
    const steps = $$('.pass-step', passOuter);
    const imgs = $$('.pass__img', passOuter);
    const stageEl = $('.pass__stage', passOuter);
    const next = $('[data-next]', passOuter);
    const lanyardEl = $('[data-lanyard]', passOuter);
    const lanyard = lanyardEl ? initLanyard(lanyardEl) : null;
    let step = -1, scrolly = false, auto = false, autoT;
    const go = (n) => {
      if (n === step) return;
      step = n;
      steps.forEach((b, i) => {
        b.classList.toggle('is-active', i === step);
        b.classList.toggle('is-done', i < step);
        if (i === step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
      const cur = step + 1;
      imgs.forEach((im, k) => {
        im.classList.toggle('is-on', k === cur);
        im.classList.toggle('is-past', k < cur);
        im.setAttribute('aria-hidden', String(k !== cur));
      });
      if (lanyard) lanyard.stage(cur);
      const last = step === 2;
      stageEl.classList.toggle('is-final', last);
      next.textContent = last ? 'Get your pass → Book a call' : 'Next step';
      next.classList.toggle('is-final', last);
    };
    const measure = () => {
      const s2 = passOuter.clientWidth >= 760 && innerHeight >= 560;
      if (s2 !== scrolly) { scrolly = s2; passOuter.classList.toggle('is-scrolly', scrolly); }
    };
    const onScroll = () => {
      if (auto) return;
      const r = passOuter.getBoundingClientRect(), vh = innerHeight || 800;
      let p;
      if (scrolly) { const span = r.height - vh; if (span <= 0) return; p = -r.top / span; }
      else p = (vh * 0.7 - r.top) / Math.max(1, r.height * 0.9);
      p = clamp(p, 0, 1);
      go(p < 0.12 ? -1 : p < 0.41 ? 0 : p < 0.71 ? 1 : 2);
    };
    const scrollToStep = (n) => {
      if (!scrolly) return;
      const r = passOuter.getBoundingClientRect(), span = r.height - innerHeight;
      const t = r.top + scrollY + span * [0.26, 0.56, 0.86][n];
      auto = true; clearTimeout(autoT); autoT = setTimeout(() => { auto = false; }, 900);
      scrollTo({ top: t, behavior: reduce ? 'auto' : 'smooth' });
    };
    steps.forEach((b, i) => b.addEventListener('click', () => { go(i); scrollToStep(i); }));
    next.addEventListener('click', (e) => {
      if (step === 2) return; // final state: follow the link to /contact/
      e.preventDefault();
      const n = step < 0 ? 0 : step + 1;
      go(n); scrollToStep(n);
    });
    measure();
    addEventListener('resize', () => { measure(); onScroll(); });
    addEventListener('scroll', onScroll, { passive: true });
    requestAnimationFrame(onScroll);
  }

  /* ───────── Lanyard badge: drag to swing, tap to flip ─────────
     Rigid badge hanging from a rope pivot. Fixed-step integration, angle is
     soft-limited so the badge can never swing over the top of its clip. */
  function initLanyard(stage) {
    const card = $('.lanyard__card', stage);
    const back = $('.lanyard__back', stage);
    const svg = $('.lanyard__strap', stage);
    const paths = $$('path', svg);
    const IW = 400, IH = 613;               // badge image size (px in source)
    const PIV = [201, 4], END = [201, 22];  // clip top (pivot) and where the strap tucks in
    const STRAP = 70 / IW;                  // strap width relative to badge width
    const MAXA = 40 * Math.PI / 180;        // badge tilt limit
    const SOFTA = 26 * Math.PI / 180;       // tilt where resistance starts
    const MAXR = 45 * Math.PI / 180;        // strap swing limit from vertical
    const MINR = 0.55;                      // clip never closer to the hook than this × strap length

    let W = 0, H = 0, cw = 0, ch = 0, L = 0, sc = 1, g = 0;
    let px = 0, py = 0, vx = 0, vy = 0, th = 0, om = 0, ax = 0, ay = 0;
    let drag = null, raf = 0, lastT = 0, sleeping = true, flipped = false;

    const size = () => {
      W = stage.clientWidth; H = stage.clientHeight;
      if (!W || !H) return;
      ch = Math.min(H * 0.66, (W * 0.62) * IH / IW);
      cw = ch * IW / IH; sc = cw / IW;
      L = Math.max(60, H * 0.88 - ch - 8);
      g = 2400 * (H / 560);
      card.style.width = cw + 'px'; card.style.height = ch + 'px';
      if (!px && !py) { px = W / 2; py = L; }
      wake();
    };
    // local badge point (source px) → stage coords
    const toWorld = (lx, ly) => {
      const dx = (lx - PIV[0]) * sc, dy = (ly - PIV[1]) * sc, c = Math.cos(th), s = Math.sin(th);
      return [px + dx * c - dy * s, py + dx * s + dy * c];
    };
    const render = () => {
      const ox = PIV[0] * sc, oy = PIV[1] * sc;
      card.style.transform = `translate(${(px - ox).toFixed(2)}px,${(py - oy).toFixed(2)}px) translate(${ox}px,${oy}px) rotate(${th.toFixed(4)}rad) translate(${-ox}px,${-oy}px)`;
      // strap: cubic from the hook down into the clip, entering along the badge's up-axis
      const [ex, ey] = toWorld(END[0], END[1]);
      const axp = W / 2, ayp = -4;
      const d = Math.hypot(ex - axp, ey - ayp), slack = Math.max(0, L + 18 * sc - d);
      const k = 0.36 * d + 0.55 * slack;
      const ux = Math.sin(th), uy = -Math.cos(th);
      const dd = `M${axp} ${ayp} C${axp} ${ayp + k} ${ex + ux * k} ${ey + uy * k} ${ex} ${ey}`;
      const sw = STRAP * cw;
      paths.forEach((p, i) => { p.setAttribute('d', dd); p.setAttribute('stroke-width', String(i === 0 ? sw : i === 1 ? sw - 4 : 1.5)); });
    };

    const step = (dt) => {
      const m = 1, I = m * ((ch * ch) / 3 + (cw * cw) / 12);
      // centre of mass relative to pivot
      const cx = -Math.sin(th) * ch * 0.5, cy = Math.cos(th) * ch * 0.5;
      let fx = 0, fy = m * g, tq = cx * m * g; // gravity on pivot + gravity torque (r × F, z)
      if (drag) {
        const [gx, gy] = toWorld(drag.lx, drag.ly);
        const rx = gx - px, ry = gy - py;
        const gvx = vx - om * ry, gvy = vy + om * rx; // velocity of the grab point
        const K = 220, C = 22;
        const Fx = (K * (drag.tx - gx) - C * gvx) * m, Fy = (K * (drag.ty - gy) - C * gvy) * m;
        fx += Fx; fy += Fy; tq += rx * Fy - ry * Fx;
      }
      // badge lags when the pivot accelerates (pseudo-force on the centre of mass)
      tq += -(cx * ay - cy * ax) * m;
      // growing resistance past SOFTA so the tilt eases into its limit
      const over = Math.abs(th) - SOFTA;
      if (over > 0) tq -= Math.sign(th) * over * I * 220;
      const nax = fx / m, nay = fy / m;
      vx += nax * dt; vy += nay * dt;
      om += (tq / I) * dt;
      // damping (frame-rate independent)
      const ld = Math.exp(-(drag ? 3 : 1.1) * dt), ad = Math.exp(-(drag ? 6 : 2.4) * dt);
      vx *= ld; vy *= ld; om *= ad;
      // speed caps keep fast flicks from exploding
      const sp = Math.hypot(vx, vy), maxV = 3800 * (H / 560);
      if (sp > maxV) { vx *= maxV / sp; vy *= maxV / sp; }
      om = clamp(om, -14, 14);
      const vx0 = vx - nax * dt, vy0 = vy - nay * dt;
      px += vx * dt; py += vy * dt; th += om * dt;
      // rope: inextensible, may go slack
      const rx = px - W / 2, ry = py;
      const dist = Math.hypot(rx, ry);
      if (dist > L) {
        const nx = rx / dist, ny = ry / dist;
        px = W / 2 + nx * L; py = ny * L;
        const vr = vx * nx + vy * ny; if (vr > 0) { vx -= vr * nx; vy -= vr * ny; }
      }
      // never above the hook, never out of the frame
      // strap stays within a cone below the hook and can't bunch up
      {
        const qx = px - W / 2, qy = py;
        let ang = Math.atan2(qx, qy), d = Math.hypot(qx, qy);
        const ca = clamp(ang, -MAXR, MAXR), cd = clamp(d, L * MINR, L);
        if (ca !== ang || cd !== d || qy <= 0) {
          px = W / 2 + Math.sin(ca) * cd; py = Math.cos(ca) * cd;
          // remove velocity pushing further out of bounds
          const nx = Math.sin(ca), ny = Math.cos(ca), tx = ny, ty = -nx;
          const vr = vx * nx + vy * ny, vt = vx * tx + vy * ty;
          const vr2 = (cd !== d && ((d < cd && vr < 0) || (d > cd && vr > 0))) ? 0 : vr;
          const vt2 = (ca !== ang && Math.sign(vt) === Math.sign(ang)) ? -vt * 0.2 : vt;
          vx = nx * vr2 + tx * vt2; vy = ny * vr2 + ty * vt2;
        }
      }
      const minY = Math.max(14, L * MINR * Math.cos(MAXR));
      // keep the whole rotated badge inside the frame
      const c = Math.cos(th), s = Math.sin(th), hw = cw / 2, pad = 10;
      let lo = Infinity, hi = -Infinity, bot = -Infinity;
      for (const [lx, ly] of [[-hw, 0], [hw, 0], [-hw, ch], [hw, ch]]) {
        const wx = lx * c - ly * s, wy = lx * s + ly * c;
        if (wx < lo) lo = wx; if (wx > hi) hi = wx; if (wy > bot) bot = wy;
      }
      if (hi - lo < W - pad * 2) {
        if (px + lo < pad) { px = pad - lo; if (vx < 0) vx *= -0.3; }
        if (px + hi > W - pad) { px = W - pad - hi; if (vx > 0) vx *= -0.3; }
      }
      if (py + bot > H - pad && py > minY) { py = Math.max(minY, H - pad - bot); if (vy > 0) vy *= -0.3; }
      // soft angle limit: badge can tilt hard but not flip over its clip
      if (th > MAXA) { th = MAXA; if (om > 0) om *= -0.25; }
      if (th < -MAXA) { th = -MAXA; if (om < 0) om *= -0.25; }
      // actual pivot acceleration (after the rope), capped so wall hits don't spike the swing
      ax = (vx - vx0) / dt; ay = (vy - vy0) / dt;
      const am = Math.hypot(ax, ay), amax = g * 4;
      if (am > amax) { ax *= amax / am; ay *= amax / am; }
    };

    const tick = (t) => {
      raf = 0;
      let dt = Math.min(0.05, (t - (lastT || t)) / 1000); lastT = t;
      const SUB = 1 / 240;
      while (dt > 1e-6) { const h = Math.min(SUB, dt); step(h); dt -= h; }
      render();
      const rest = Math.abs(px - W / 2) < 0.3 && Math.abs(py - L) < 0.6 && Math.abs(th) < 0.002;
      const calm = Math.hypot(vx, vy) < 2 && Math.abs(om) < 0.01;
      if (!drag && rest && calm) { sleeping = true; lastT = 0; return; }
      raf = requestAnimationFrame(tick);
    };
    function wake() { sleeping = false; if (!raf) raf = requestAnimationFrame(tick); }

    // Pointer: drag to swing; a short press without movement flips
    const local = (e) => { const r = stage.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    card.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      e.preventDefault(); // no focus ring / text selection on mouse grab
      const [x, y] = local(e);
      // grab point in badge-local source px
      const dx = x - px, dy = y - py, c = Math.cos(-th), s = Math.sin(-th);
      drag = { lx: PIV[0] + (dx * c - dy * s) / sc, ly: PIV[1] + (dx * s + dy * c) / sc, tx: x, ty: y, sx: x, sy: y, t: performance.now(), moved: false, id: e.pointerId };
      card.setPointerCapture(e.pointerId);
      card.classList.add('is-grab');
      wake();
    });
    card.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const [x, y] = local(e);
      drag.tx = x; drag.ty = y;
      if (Math.hypot(x - drag.sx, y - drag.sy) > 6) drag.moved = true;
    });
    const end = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const tap = !drag.moved && performance.now() - drag.t < 350;
      drag = null; card.classList.remove('is-grab');
      if (tap && e.type === 'pointerup') flip();
      wake();
    };
    card.addEventListener('pointerup', end);
    card.addEventListener('pointercancel', end);
    card.addEventListener('lostpointercapture', end);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); vx += (e.key === 'ArrowLeft' ? -1 : 1) * 700 * (H / 560); wake(); }
    });
    card.addEventListener('dragstart', (e) => e.preventDefault());

    function flip() {
      flipped = !flipped;
      card.classList.toggle('is-flipped', flipped);
      card.setAttribute('aria-pressed', String(flipped));
      if (!reduce) { om += (flipped ? 1 : -1) * 0.9; wake(); }
    }

    const setBack = (k) => {
      const im = $$('.pass__img', stage)[k];
      if (im) back.style.setProperty('--back', `url("${im.getAttribute('src')}")`);
    };
    setBack(0);
    size();
    render();
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(stage); else addEventListener('resize', size);

    return {
      // new stage art: update the back's clip art and give the badge a little swing
      stage(k) {
        setBack(k);
        if (!reduce && W) { om += (k % 2 ? -1 : 1) * 1.1; vx += (k % 2 ? 1 : -1) * 120 * (H / 560); wake(); }
      },
    };
  }

  /* ───────── Contact form ───────── */
  const form = $('[data-contact]');
  if (form) {
    const done = $('.form-done');
    const errEl = (n) => $('#err-' + n);
    const showErr = (n, msg) => {
      const el = errEl(n); if (el) el.textContent = msg || '';
      const input = form.elements[n];
      if (input && input.setAttribute && !(input instanceof RadioNodeList)) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    };
    const get = (n) => (form.elements[n] ? String(form.elements[n].value || '').trim() : '');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = get('name'), email = get('email'), message = get('message'), need = get('need');
      const errors = {};
      if (!name) errors.name = 'We need a name to say hello.';
      if (!email) errors.email = 'An email address, please.';
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) errors.email = "That email doesn't look right.";
      if (!need) errors.need = 'Pick at least one thing you need.';
      if (message.length < 10) errors.message = 'A sentence or two about the show helps.';
      ['name', 'email', 'need', 'message'].forEach((n) => showErr(n, errors[n]));
      const firstBad = ['name', 'email', 'need', 'message'].find((n) => errors[n]);
      if (firstBad) { const f = form.elements[firstBad]; (f.focus ? f : f[0]).focus(); return; }
      if (get('_gotcha')) return;

      const btn = $('.form__submit', form);
      const endpoint = form.dataset.endpoint;
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        if (endpoint) {
          const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error('send failed');
        } else {
          const lines = ['Name: ' + name, 'Email: ' + email, 'Company / show: ' + get('company'), 'Phone: ' + get('phone'), 'Need: ' + need, 'Budget: ' + get('budget'), 'Heard via: ' + get('hear'), '', message];
          location.href = 'mailto:' + form.dataset.mailto + '?subject=' + encodeURIComponent('Book a call — ' + need + (get('company') ? ' · ' + get('company') : '')) + '&body=' + encodeURIComponent(lines.join('\n'));
        }
        $('[data-sent="name"]').textContent = name.split(' ')[0];
        $('[data-sent="need"]').textContent = need;
        $('[data-sent="email"]').textContent = email;
        $('[data-sent="ref"]').textContent = 'KL-' + String(1000 + Math.floor(Math.random() * 8999));
        form.hidden = true; done.hidden = false; done.focus();
      } catch (err) {
        showErr('message', "Couldn't send just now — please email " + form.dataset.mailto + ' directly.');
      } finally {
        btn.disabled = false; btn.textContent = 'Send it over';
      }
    });
    $('[data-reset]').addEventListener('click', () => { form.reset(); form.hidden = false; done.hidden = true; form.elements.name.focus(); });
  }

  /* ───────── 404 details ───────── */
  const pd = $('[data-pull-date]');
  if (pd) pd.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const sn = $('[data-serial]');
  if (sn) sn.textContent = '#' + String(Math.floor(Math.random() * 9000) + 1000);
})();
