// Loaded blocking in <head> (no inline scripts, so the CSP stays strict).
// 1. Theme: White (default) / Night / Auto, remembered per browser; applied before the page paints.
// 2. Theme toggle, code-block language label + copy, Giscus comments that follow the theme.
(function () {
  var KEY = 'vp:theme', root = document.documentElement;
  var dark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : { matches: false, addEventListener: function () {} };
  function pref() { try { var v = localStorage.getItem(KEY); return v === 'night' || v === 'auto' ? v : 'white' } catch (e) { return 'white' } }
  function resolved(p) { return p === 'auto' ? (dark.matches ? 'night' : 'white') : p }
  function apply(p) {
    var t = resolved(p);
    root.dataset.pref = p; root.dataset.theme = t;
    var g = document.querySelector('iframe.giscus-frame');
    if (g) g.contentWindow.postMessage({ giscus: { setConfig: { theme: t === 'night' ? 'dark' : 'light' } } }, 'https://giscus.app');
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

    // comments (Giscus): config comes from data-* on #giscus
    var g = document.getElementById('giscus');
    if (g) {
      var s = document.createElement('script'), d = g.dataset;
      s.src = 'https://giscus.app/client.js'; s.async = true; s.crossOrigin = 'anonymous';
      var attrs = { repo: d.repo, 'repo-id': d.repoId, category: d.category, 'category-id': d.categoryId, mapping: d.mapping,
        strict: '1', 'reactions-enabled': '1', 'emit-metadata': '0', 'input-position': 'bottom', lang: 'en', loading: 'lazy',
        theme: root.dataset.theme === 'night' ? 'dark' : 'light' };
      for (var k in attrs) s.setAttribute('data-' + k, attrs[k]);
      g.appendChild(s);
    }
  });
})();
