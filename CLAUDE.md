# Blog — vivekanand.dev

Vivek's public tech blog: Hugo, own theme `themes/lector` (same style guide as his Lector and Adversaria apps), Cloudflare Pages, Giscus comments.
**Public site** (unlike Lector/Adversaria, no Cloudflare Access).

- Repo `vivekanand-pujar/blog` (public; formerly `vivekanand-pujar.github.io`), checkout `~/blog`. Old local copy `~/Documents/vivekanandpv-github-io` is obsolete.
- Hugo **0.168.0** extended (local Homebrew; Cloudflare Pages env `HUGO_VERSION=0.168.0`). Build (Cloudflare): `hugo --gc --minify && npx -y pagefind@1.3.0 --site public` (Pagefind = header search; indexes only `data-pagefind-body` = posts), output `public/`. CSP needs `wasm-unsafe-eval` for Pagefind.
- Domains: **vivekanand.dev** is canonical (Pages custom domain); `www.vivekanand.dev`, `vivekanand.io`, `www.vivekanand.io` → 301 to the same path on vivekanand.dev (Cloudflare Redirect Rules). The zones also hold Proton Mail records and the Lector/Adversaria subdomains — keep mail records DNS only.
- Sections (`params.mainSections`): `papers` (White Papers), `deep-dives`, `essays`. `about.md`, `archive.md` (layout `archive`), `tags/_index.md`.
- New post: `hugo new content deep-dives/my-post.md` → edit → `draft = false` → push. Front matter: `description`, `tags`, `toc = true` for a contents box, `comments = false` to hide comments, `images = ["/images/x.png"]` for a share image.

## Theme (themes/lector)
- Layouts use Hugo's 0.146+ structure: `baseof/home/section/term/taxonomy/single/archive/404.html`, `_partials/`, `_markup/` (heading anchors, external links → new tab, lazy images with sizes).
- `assets/css/main.css`: tokens = Lector/Adversaria (White/Night, accent #a4501f/#e0915e); interface Inter **400 only**, 0.04em tracking (titles 0.06em, uppercase labels 0.12em); article text Inter 20px (17px phones), letter-spacing 0.02rem, line height 1.7; column = 37.5 × text size + 75 × letter-spacing ≈ 774px (≈ 75 chars per line), headings & bold 600; code Fira Mono with Adversaria's code colours mapped to Chroma classes (`markup.highlight.noClasses = false`).
- `assets/js/theme.js` (loaded blocking in `<head>`, no inline JS): White/Night/Auto toggle (localStorage `vp:theme`), code-block language label = copy button, Giscus loader that follows the theme.
- `titleCaseStyle = "none"` (titles/tags exactly as written). `markup.goldmark.renderer.unsafe = true` (own writing; allows <kbd> etc.; CSP blocks scripts).
- `static/_headers`: CSP (self + giscus.app), cache: fingerprinted css/js immutable, HTML revalidated.
- Default share image `static/images/og-default.png` (1200×630).

## Comments (Giscus)
GitHub Discussions in this repo, category "Comments" (announcement format). IDs in `hugo.toml` `[params.giscus]`; comments render only when repoId and categoryId are set.

## Working with Vivek
Candid, concise; point out mistakes in his English briefly at the end of replies. Leave to him anything that grants access, accepts terms or types personal data.

## Two wings (added 2026-11-16)

- **Technical:** `papers`, `deep-dives`, `essays` (Inter). **Humanities:** `marginalia` (philosophy, epistemology, reviews of mostly non-technical books) and `translations` (Sanskrit). Lists in `hugo.toml` `[params.wings]`; `mainSections` = all five.
- Header groups menu items by `[menu.main.params] group` with hairline separators; below 1200px the menu moves to its own row (scrolls sideways on phones).
- Home: "Recent" = technical only; "Marginalia & Translations" = latest 5 humanities posts, separately.
- Feeds (full content): `/index.xml` everything, `/technical.xml`, `/humanities.xml`, and `<section>/index.xml`. Templates `home.rss.xml`, `home.techrss.xml`, `home.humrss.xml`, `section.rss.xml` → `_partials/rss.xml`.
- Humanities pages: `body.wing-humanities` → Literata 19px (17px phones), column 36.5 × text size (~75 chars/line). Literata loads only on humanities posts; Tiro Devanagari Sanskrit only on posts using the `verse` shortcode.
- Book reviews: `[book]` (title, author, year, translator, publisher); translations: `[work]` (title, author, section, metre, edition) → `_partials/work-panel.html`. Archetypes: `hugo new marginalia/x.md`, `hugo new translations/x.md`.
- `{{< verse n="2.47" >}} Devanagari --- IAST --- translation [--- note] {{< /verse >}}` (parts separated by a line `---`; two parts = original + translation). Toggles to hide Devanāgarī / transliteration (localStorage `vp:hide-sa`, `vp:hide-iast`).
