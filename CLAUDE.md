# Blog — vivekanand.dev

Vivek's public tech blog: Hugo, own theme `themes/lector` (same style guide as his Lector and Adversaria apps), Cloudflare Pages, Giscus comments.
**Public site** (unlike Lector/Adversaria, no Cloudflare Access).

- Repo `vivekanand-pujar/blog` (public; formerly `vivekanand-pujar.github.io`), checkout `~/blog`. Old local copy `~/Documents/vivekanandpv-github-io` is obsolete.
- Hugo **0.168.0** extended (local Homebrew; Cloudflare Pages env `HUGO_VERSION=0.168.0`). Build: `hugo --gc --minify`, output `public/`.
- Domains: **vivekanand.dev** is canonical (Pages custom domain); `www.vivekanand.dev`, `vivekanand.io`, `www.vivekanand.io` → 301 to the same path on vivekanand.dev (Cloudflare Redirect Rules). The zones also hold Proton Mail records and the Lector/Adversaria subdomains — keep mail records DNS only.
- Sections (`params.mainSections`): `papers` (White Papers), `deep-dives`, `essays`. `about.md`, `archive.md` (layout `archive`), `tags/_index.md`.
- New post: `hugo new content deep-dives/my-post.md` → edit → `draft = false` → push. Front matter: `description`, `tags`, `toc = true` for a contents box, `comments = false` to hide comments, `images = ["/images/x.png"]` for a share image.

## Theme (themes/lector)
- Layouts use Hugo's 0.146+ structure: `baseof/home/section/term/taxonomy/single/archive/404.html`, `_partials/`, `_markup/` (heading anchors, external links → new tab, lazy images with sizes).
- `assets/css/main.css`: tokens = Lector/Adversaria (White/Night, accent #a4501f/#e0915e); interface Inter **400 only**, 0.04em tracking (titles 0.06em, uppercase labels 0.12em); article text Inter 18px/1.7, headings & bold 600; code Fira Code with Adversaria's code colours mapped to Chroma classes (`markup.highlight.noClasses = false`).
- `assets/js/theme.js` (loaded blocking in `<head>`, no inline JS): White/Night/Auto toggle (localStorage `vp:theme`), code-block language label = copy button, Giscus loader that follows the theme.
- `titleCaseStyle = "none"` (titles/tags exactly as written). `markup.goldmark.renderer.unsafe = true` (own writing; allows <kbd> etc.; CSP blocks scripts).
- `static/_headers`: CSP (self + giscus.app), cache: fingerprinted css/js immutable, HTML revalidated.
- Default share image `static/images/og-default.png` (1200×630).

## Comments (Giscus)
GitHub Discussions in this repo, category "Comments" (announcement format). IDs in `hugo.toml` `[params.giscus]`; comments render only when repoId and categoryId are set.

## Working with Vivek
Candid, concise; point out mistakes in his English briefly at the end of replies. Leave to him anything that grants access, accepts terms or types personal data.
