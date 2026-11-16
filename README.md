# vivekanand.dev

Source of [vivekanand.dev](https://vivekanand.dev) — Hugo, own theme, Cloudflare Pages.

```sh
hugo server -D                               # preview with drafts at http://localhost:1313
hugo new content deep-dives/my-post.md       # new post (draft)
hugo --gc --minify && npx -y pagefind@1.3.0 --site public   # production build + search index
```

Publish: set `draft = false`, commit, push to `main` — Cloudflare Pages builds and deploys.
