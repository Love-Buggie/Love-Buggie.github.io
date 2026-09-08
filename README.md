# love-buggie.github.io

Personal portfolio for Brooke Stamps — Unreal Engine developer & technical artist.
Live at **https://love-buggie.github.io**

Plain HTML, CSS and JavaScript. No build step, no dependencies, no framework.
Edit a file, commit, push — the live site updates in about a minute.

## Files

```
index.html      the whole page: hero, projects, about, skills, résumé, contact
css/style.css   all styling; colors and fonts are CSS variables at the top
js/main.js      the project overlay + "expand all" on the résumé
favicon.svg     browser tab icon
assets/         images you add (projects/ is for screenshots)
.nojekyll       tells GitHub Pages to serve the files as-is
```

## Adding a project

Copy any `<article class="card">` block in `index.html` and edit it. The card
shows the title, kind, year, where, a one-line teaser and up to three tags.
The `<div class="card__detail" hidden>` underneath holds what the pop-up shows:
the full description, the complete tag list, and these attributes:

- `data-videos="ABC123,DEF456"` — YouTube video IDs (the part after `v=`).
  The first one becomes the card thumbnail; the rest appear as small buttons.
- `data-images="assets/projects/shot1.jpg,assets/projects/shot2.jpg"` — stills.
  Used when there's no video, and shown alongside videos when there are.
- `data-link` / `data-link-label` — the button in the pop-up. Leave both empty
  and no button appears.

Card order on the page is the order in the file. Accent colors and the slight
tilt cycle automatically by position — nothing to set per card.

## Adding your photo

Drop the file in `assets/`, then in `index.html` find `portrait__ph` and swap
the placeholder for the commented-out `<img>` line just above it.

## Changing colors or fonts

Everything lives in the `:root` block at the top of `css/style.css`. Change a
value once and it updates everywhere. Fonts load from Google Fonts via the
`<link>` in `index.html`.

## Working on it locally

Open `index.html` in a browser. For a closer match to the live site
(the overlay and relative paths behave the same either way):

```
python3 -m http.server 8000
```

then visit http://localhost:8000
