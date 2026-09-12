# love-buggie.github.io

Personal portfolio for Brooke Stamps — Unreal Engine developer & technical artist.
Live at **https://love-buggie.github.io**

Plain HTML, CSS and JavaScript. No build step, no dependencies, no framework.
Edit a file, commit, push — the live site updates in about a minute.

## Files

```
index.html             the whole page: hero, projects, about, skills, résumé, contact
benched-projects.html  parked project cards — not loaded by anything, just a shelf
css/style.css          all styling; colors and fonts are CSS variables at the top
js/main.js             the project overlay + "expand all" on the résumé
favicon.svg            browser tab icon
assets/                images you add (projects/ is for screenshots)
.nojekyll              tells GitHub Pages to serve the files as-is
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

## The featured card

One card carries `class="card card--featured"` and is twice as wide, with a
silent looping clip over its poster image:

```html
<video class="card__loop" autoplay muted loop playsinline poster="...">
  <source src="assets/projects/singapore-loop.mp4" type="video/mp4">
</video>
```

The clip only fades in once it is genuinely playing, so if the file is missing,
slow, or the visitor has asked for reduced motion, the poster image just stays.
Nothing breaks if you never add a video.

For the clip: 5–10 seconds, silent, around 1280x720, H.264 MP4, under ~3MB.

To feature a different project, move the `card--featured` class and the
`<video>` block onto that project's card.

## Parking a project

`benched-projects.html` is a shelf, not a page — nothing loads it. Move an
`<article>` block between it and the grid in `index.html` to take a project off
the site or put it back. The grid shows cards in the order they appear, and the
accent colour and tilt follow position automatically.

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
