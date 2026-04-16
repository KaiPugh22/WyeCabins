# Writing blog posts

Each post lives in this folder as a Markdown file named after its slug — e.g. `things-to-do.md` is served at `/blog.html?post=things-to-do`.

To add a post:

1. Create a new Markdown file here (slug must be lowercase kebab-case, e.g. `weekend-itinerary.md`).
2. Add an entry to `meta.json` in the same folder with the post's title, hero image, card image, excerpt, and meta description.
3. That's it — the blog listing picks it up automatically.

## Supported Markdown

Standard CommonMark — headings, paragraphs, bold/italic, links, lists — plus raw HTML for image layouts and the `{{map:"..."}}` shortcode below.

### Headings

```md
## Section heading           ← becomes an H2
### Sub-heading              ← becomes an H3
```

The post's title is set in `meta.json`, not in the body, so don't add an H1.

### Links

Standard Markdown links: `[label](https://example.com)`.
External links open in a new tab via the renderer automatically.

### Images — four layout variants

These need raw HTML (not Markdown image syntax) so the class name survives:

```html
<img class="blog-photo" src="assets/images/foo.jpg" alt="…" loading="lazy">
```

- `.blog-photo` — full-width landscape image (16:9 on mobile)
- `.blog-photo-left` — float-left portrait image, text wraps around it on desktop
- `.blog-photo-right` — float-right portrait image, text wraps around it on desktop
- `.blog-photo-wide` — oversized full-bleed image (21:9), best for landscape panoramas
- `<div class="blog-photo-pair">…</div>` — side-by-side pair of landscape images

Example pair:

```html
<div class="blog-photo-pair">
  <img src="assets/images/one.jpg" alt="…" loading="lazy">
  <img src="assets/images/two.jpg" alt="…" loading="lazy">
</div>
```

### Google Maps shortcode

```md
[Booths](https://boothbooks.co.uk/){{map:"Richard Booth Bookshop Hay-on-Wye"}}
```

The `{{map:"search query"}}` marker becomes a pin-emoji link to a Google Maps search for "<query> near Hay-on-Wye". Place it immediately after the text it should decorate.

## Image best practices

- Keep images under 300 KB. Run them through [Squoosh](https://squoosh.app) or `cwebp` first.
- Always set `alt` text. Describe what's in the image, not "image of…".
- Always set `loading="lazy"` (unless it's the very first image in the post).
- Landscape photos work best in `.blog-photo`, `.blog-photo-wide`, and `.blog-photo-pair`. Portrait photos work best in `.blog-photo-left` and `.blog-photo-right` (they're aspect-ratio 3:4 so landscape sources crop hard).
