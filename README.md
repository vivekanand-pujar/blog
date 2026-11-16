# vivekanand.dev

Source of [vivekanand.dev](https://vivekanand.dev) — Hugo, own theme, Cloudflare Pages.

```sh
hugo server -D                               # preview with drafts at http://localhost:1313
hugo new content deep-dives/my-post.md       # new post (draft)
hugo --gc --minify && npx -y pagefind@1.3.0 --site public   # production build + search index
```

Publish: set `draft = false`, commit, push to `main` — Cloudflare Pages builds and deploys.

## Writing in the humanities wing

```sh
hugo new marginalia/on-certainty.md        # essay or book review ([book] block for reviews)
hugo new translations/gita-2-47.md         # Sanskrit translation ([work] block + verse shortcode)
```

A verse: the original, the transliteration, your translation and an optional note, separated by lines containing only `---`:

```
{{</* verse n="2.47" */>}}
कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।
मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ ४७ ॥
---
karmaṇy evādhikāras te mā phaleṣu kadācana |
mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi || 47 ||
---
Your translation, in Markdown.
---
An optional note.
{{</* /verse */>}}
```
