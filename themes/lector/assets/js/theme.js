// Loaded blocking in <head> (no inline scripts, so the CSP stays strict).
// 1. Theme: White (default) / Night / Auto, remembered per browser; applied before the page paints.
// 2. Theme toggle, code-block language label + copy, Giscus comments that follow the theme.
(function () {
  var KEY = 'vp:theme', root = document.documentElement;
  var dark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : { matches: false, addEventListener: function () {} };
  function pref() { try { var v = localStorage.getItem(KEY); return v === 'night' || v === 'auto' ? v : 'white' } catch (e) { return 'white' } }
  function resolved(p) { return p === 'auto' ? (dark.matches ? 'night' : 'white') : p }
  // Giscus theme files in the site's own colours (static/giscus/white.css, night.css), served from this origin
  function giscusTheme(t) { return location.origin + '/giscus/' + t + '.css' }
  function apply(p) {
    var t = resolved(p);
    root.dataset.pref = p; root.dataset.theme = t;
    var g = document.querySelector('iframe.giscus-frame');
    if (g) g.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusTheme(t) } } }, 'https://giscus.app');
  }
  apply(pref());
  dark.addEventListener('change', function () { if (pref() === 'auto') apply('auto') });

  document.addEventListener('DOMContentLoaded', function () {
    // theme toggle: White → Night → Auto
    var b = document.getElementById('themeToggle');
    if (b) {
      var names = { white: 'White', night: 'Night', auto: 'Auto (follows the system)' };
      var label = function () { b.title = 'Theme: ' + names[pref()]; b.setAttribute('aria-label', b.title) };
      label();
      b.addEventListener('click', function () {
        var next = { white: 'night', night: 'auto', auto: 'white' }[pref()];
        try { localStorage.setItem(KEY, next) } catch (e) {}
        apply(next); label();
      });
    }

    // code blocks: language label top right (click to copy), copy icon when no language
    var COPY = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';
    var NAMES = { js: 'JavaScript', javascript: 'JavaScript', ts: 'TypeScript', typescript: 'TypeScript', sh: 'Shell', shell: 'Shell', bash: 'Bash', zsh: 'Zsh',
      py: 'Python', python: 'Python', yml: 'YAML', yaml: 'YAML', json: 'JSON', xml: 'XML', html: 'HTML', css: 'CSS', sql: 'SQL', go: 'Go', golang: 'Go',
      java: 'Java', kotlin: 'Kotlin', kt: 'Kotlin', cs: 'C#', csharp: 'C#', cpp: 'C++', rust: 'Rust', rs: 'Rust', hcl: 'HCL', tf: 'Terraform', terraform: 'Terraform',
      dockerfile: 'Dockerfile', docker: 'Dockerfile', toml: 'TOML', ini: 'INI', md: 'Markdown', markdown: 'Markdown', diff: 'Diff', text: '', plaintext: '', txt: '' };
    document.querySelectorAll('.prose pre > code').forEach(function (code) {
      var pre = code.parentElement, host = pre.closest('.highlight') || pre;
      var lang = (code.dataset.lang || (code.className.match(/language-([\w+#-]+)/) || [])[1] || '').toLowerCase();
      var name = lang in NAMES ? NAMES[lang] : lang.charAt(0).toUpperCase() + lang.slice(1);
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'code-label'; btn.title = 'Copy code';
      var show = function () { if (name) btn.textContent = name; else btn.innerHTML = COPY };
      show();
      btn.addEventListener('click', function () {
        var text = code.innerText.replace(/\n$/, '');
        (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () {
          btn.textContent = 'Copied'; btn.classList.add('is-copied');
        }, function () { btn.textContent = 'Copy failed' }).then(function () {
          setTimeout(function () { btn.classList.remove('is-copied'); show() }, 1300);
        });
      });
      host.appendChild(btn);
    });

    // sticky header: hide while scrolling down, show on scroll up; reading progress on posts
    var header = document.getElementById('siteHeader'), bar = document.getElementById('readProgress'), prose = document.querySelector('.prose');
    var lastY = window.scrollY, ticking = false;
    function onScroll() {
      var y = window.scrollY;
      if (header) header.classList.toggle('is-hidden', y > lastY && y > 120 && !document.getElementById('searchDialog').open);
      lastY = y;
      if (bar && prose) {
        var r = prose.getBoundingClientRect(), total = r.height - window.innerHeight * 0.6;
        var done = Math.min(1, Math.max(0, (window.innerHeight * 0.4 - r.top) / (total > 0 ? total : 1)));
        bar.style.transform = 'scaleX(' + done.toFixed(4) + ')';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll) } }, { passive: true });
    onScroll();

    // search (Pagefind, built at deploy): button, ⌘K / Ctrl+K or "/" opens; ↑↓ move; ↵ opens; Esc closes
    var dlg = document.getElementById('searchDialog'), input = document.getElementById('searchInput'), list = document.getElementById('searchResults'), hint = document.getElementById('searchHint');
    var pf = null, sel = -1, seq = 0;
    function loadPagefind() {
      if (!pf) pf = import('/pagefind/pagefind.js').then(function (m) { return m.options ? m.options({ excerptLength: 22 }).then(function () { return m }) : m })
        .catch(function () { hint.textContent = 'Search becomes available once the site is built with its search index.'; return null });
      return pf;
    }
    function openSearch() { if (!dlg || dlg.open) return; dlg.showModal(); input.select(); loadPagefind() }
    function mark(i) { var items = list.children; sel = Math.max(-1, Math.min(items.length - 1, i));
      for (var k = 0; k < items.length; k++) items[k].setAttribute('aria-selected', k === sel ? 'true' : 'false');
      if (items[sel]) items[sel].scrollIntoView({ block: 'nearest' }) }
    function esc(t) { var d = document.createElement('div'); d.textContent = t || ''; return d.innerHTML }
    async function run(q) {
      var my = ++seq, m = await loadPagefind(); if (!m || my !== seq) return;
      if (!q.trim()) { list.innerHTML = ''; hint.style.display = ''; return }
      var res = await m.debouncedSearch(q, {}, 120); if (!res || my !== seq) return;
      var data = await Promise.all(res.results.slice(0, 12).map(function (r) { return r.data() })); if (my !== seq) return;
      hint.style.display = data.length ? 'none' : ''; if (!data.length) hint.textContent = 'No posts match “' + q + '”.';
      list.innerHTML = data.map(function (d) {
        var meta = [d.meta.section, d.meta.date].filter(Boolean).map(esc).join(' · ');
        return '<li role="option"><a href="' + esc(d.url) + '"><div class="r-meta">' + meta + '</div><div class="r-title">' + esc(d.meta.title) + '</div><div class="r-excerpt">' + d.excerpt + '</div></a></li>';
      }).join('');   // excerpt: Pagefind's own text from our posts, with <mark> around matches
      mark(data.length ? 0 : -1);
    }
    if (dlg) {
      document.getElementById('searchOpen').addEventListener('click', openSearch);
      document.addEventListener('keydown', function (e) {
        var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
        if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); dlg.open ? dlg.close() : openSearch() }
        else if (e.key === '/' && !typing && !dlg.open) { e.preventDefault(); openSearch() }
      });
      input.addEventListener('input', function () { run(input.value) });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); mark(sel + 1) }
        else if (e.key === 'ArrowUp') { e.preventDefault(); mark(sel - 1) }
        else if (e.key === 'Enter') { var a = list.children[sel] && list.children[sel].querySelector('a'); if (a) { e.preventDefault(); location.href = a.href } }
      });
      dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close() });   // click on the backdrop
    }

    // translations: show/hide Devanagari and transliteration in verses (remembered per browser)
    var post = document.getElementById('post');
    document.querySelectorAll('.verse-toggles .chip').forEach(function (chip) {
      var cls = chip.dataset.hide, key = 'vp:' + cls;
      var hidden = false; try { hidden = localStorage.getItem(key) === '1' } catch (e) {}
      function set(h) { post.classList.toggle(cls, h); chip.setAttribute('aria-pressed', h ? 'false' : 'true') }
      set(hidden);
      chip.addEventListener('click', function () { hidden = !hidden; set(hidden); try { localStorage.setItem(key, hidden ? '1' : '0') } catch (e) {} });
    });

    // comments (Giscus): config comes from data-* on #giscus
    var g = document.getElementById('giscus');
    if (g) {
      var s = document.createElement('script'), d = g.dataset;
      s.src = 'https://giscus.app/client.js'; s.async = true; s.crossOrigin = 'anonymous';
      var attrs = { repo: d.repo, 'repo-id': d.repoId, category: d.category, 'category-id': d.categoryId, mapping: d.mapping,
        strict: '1', 'reactions-enabled': '1', 'emit-metadata': '0', 'input-position': 'bottom', lang: 'en', loading: 'lazy',
        theme: giscusTheme(root.dataset.theme) };
      for (var k in attrs) s.setAttribute('data-' + k, attrs[k]);
      g.appendChild(s);
    }
  });
})();
