# WYE GLAMPING Site

Routes:
- `index.html` (homepage)
- `town.html`
- `country.html`
- `blog.html`
- `stay.html?unit=<unit-id>` (single reusable unit template)

Shared files:
- `styles.css`
- `script.js`
- `assets/images/`

## Edit Units Quickly
All listing content is in `script.js` inside `UNIT_DATA`.

Per unit fields:
- `title`, `meta`
- `introTitle`, `introText`
- `heroImage`
- `gallery` image array
- `details` list
- `mapQuery`

Then link cards to `stay.html?unit=<unit-id>`.

Run locally:

```bash
cd "/Users/kai/Documents/SideProjects/Cabin Sites"
python3 -m http.server 4174
```

Open:
- `http://127.0.0.1:4174/index.html`
