# Shared design system

Apple-inspired visual language for every page under `https://codyshen0000.github.io/`: clarity, deference to content, and depth (frosted chrome, layered surfaces, restrained motion).

The system is a single dependency-free stylesheet:

```html
<link rel="stylesheet" href="https://codyshen0000.github.io/assets/ds.css">
```

Local / same-origin pages may also use a relative path: `assets/ds.css`.

Tokens are global CSS custom properties on `:root`. Component rules are prefixed `ds-` so importing the sheet does not restyle foreign markup. Document chrome (background, body type, selection, focus) is **opt-in** via `class="ds-page"` on `<html>` or `<body>`.

## Theme

Light and dark resolve from `prefers-color-scheme` **and** an explicit override:

```html
<html class="ds-page" data-theme="dark">  <!-- or "light" -->
```

| Source | Wins when |
| --- | --- |
| `prefers-color-scheme` | no `data-theme`, or it is unset |
| `[data-theme="dark"]` | always dark, even if the OS is light |
| `[data-theme="light"]` | always light, even if the OS is dark |

Set `data-theme` before first paint (inline script + `localStorage`) to avoid a flash. Native form controls follow `color-scheme` on `:root`.

## Tokens

### Type

Stack (system first; no webfont required):

`"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Inter", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Helvetica Neue", sans-serif`

| Token | Value | Use |
| --- | --- | --- |
| `--ds-text-xs` | 12px | nav, captions, chips |
| `--ds-text-sm` | 14px | secondary UI, footer |
| `--ds-text-body` | **17px** | body / `.ds-prose` |
| `--ds-text-lg` | 21px | hero subhead, quotes |
| `--ds-text-xl` | 28px | h3 |
| `--ds-text-2xl` | 40px | section titles |
| `--ds-text-3xl` | 56px | article h1 |
| `--ds-text-display` | `clamp(40px, 7vw, 80px)` | hero |
| `--ds-tracking-display` | `-0.03em` | large headlines |
| `--ds-tracking-tight` | `-0.022em` | titles / body |
| `--ds-leading-body` | `1.47059` | 17px body |

Mono: `--ds-font-mono` → `"SF Mono", ui-monospace, Menlo, Consolas, …`

### Color

One accent. Neutrals only besides that.

| Token | Light | Dark |
| --- | --- | --- |
| `--ds-bg` | `#f5f5f7` | `#000000` |
| `--ds-bg-elevated` / `--ds-surface-2` | `#ffffff` | `#1c1c1e` |
| `--ds-surface` | `#f5f5f7` | `#1c1c1e` |
| `--ds-surface-3` | `#e8e8ed` | `#2c2c2e` |
| `--ds-text` | `#1d1d1f` | `#f5f5f7` |
| `--ds-text-secondary` | `#6e6e73` | `#a1a1a6` |
| `--ds-text-tertiary` | `#86868b` | `#86868b` |
| `--ds-accent` | `#0071e3` | `#2997ff` |
| `--ds-accent-ink` | `#ffffff` | `#000000` |
| `--ds-link-pill-bg` | `rgba(0,0,0,.05)` | `rgba(255,255,255,.08)` |
| `--ds-link-pill-bg-hover` | `rgba(0,0,0,.09)` | `rgba(255,255,255,.14)` |
| `--ds-hairline` | `rgba(0,0,0,.08)` | `rgba(255,255,255,.12)` |
| `--ds-nav-bg` | `rgba(245,245,247,.72)` | `rgba(0,0,0,.72)` |

### Radius, shadow, space, motion

| Token | Value |
| --- | --- |
| `--ds-radius-sm` / `md` / `lg` | **12 / 18 / 28** |
| `--ds-radius-pill` | 980px |
| `--ds-shadow-1` … `--ds-shadow-lift` | soft layered stacks |
| `--ds-space-1` … `--ds-space-10` | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 |
| `--ds-duration` | 250ms |
| `--ds-ease` / `--ds-ease-out` | ease / ease-out |
| `--ds-max` | 980px (1080px at ≥1440) |
| `--ds-prose` | 70ch |
| `--ds-nav-h` | 52px |

`prefers-reduced-motion: reduce` collapses `--ds-duration` to `0.01ms` and disables animations on `.ds-page`.

## Components

Prefix every class `ds-`. Compose; do not restyle these selectors from a generated page unless you are extending a variant.

| Class | Role |
| --- | --- |
| `.ds-page` | opt-in document chrome |
| `.ds-wrap` | centered column |
| `.ds-skip` | skip link |
| `.ds-nav` + `.ds-nav-inner` + `.ds-nav-brand` + `.ds-nav-links` + `.ds-nav-tools` + `.ds-nav-menu` | frosted sticky top bar (blur + translucent bg + hairline when `.scrolled` / `.is-open`) |
| `.ds-hero` + `.ds-hero-title` + `.ds-hero-sub` + `.ds-hero-actions` | product-style intro |
| `.ds-section` + `.ds-section-header` + `.ds-section-title` | page blocks |
| `.ds-card` / `.ds-tile` | large rounded surfaces; hover lifts |
| `.ds-btn` / `.ds-btn-fill` | filled pill |
| `.ds-btn-link` | text + `›` |
| `.ds-btn-ghost` | outlined pill |
| `.ds-link-pills` + `.ds-link-pill` / `.link-pill` | soft-fill icon+label chips; `.ds-link-pill-accent` is the primary (blue fill, white text) |
| `.ds-tag` / `.ds-chip` / `.ds-tag-outline` | chips |
| `.ds-table-wrap` + `.ds-table` | tables |
| `.ds-code` / `.ds-pre` | inline / block code |
| `.ds-quote` | blockquote |
| `.ds-prose` | article measure (~70ch) |
| `.ds-footer` + `.ds-footer-inner` | footer |
| `.ds-muted` / `.ds-dim` | secondary / tertiary text |

### Link pills

Soft filled chips for a row of icon + label links (homepage contact/outbound row, or any similar strip). Do **not** reuse `.ds-btn-ghost` for this — that outlined control is a different weight.

```html
<ul class="ds-link-pills">
  <li><a class="ds-link-pill" href="mailto:…">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">…</svg>
    <span>Email</span>
  </a></li>
  <li><a class="ds-link-pill ds-link-pill-accent" href="/ai-frontier-trends/">…</a></li>
</ul>
```

| Rule | Spec |
| --- | --- |
| Row | `flex-wrap`, `gap: 10px`, aligns with the text column it sits in |
| Pill | height **36px**, padding `0 16px`, radius `--ds-radius-pill` (980px), **no border** |
| Fill | `--ds-link-pill-bg` — `rgba(0,0,0,.05)` light / `rgba(255,255,255,.08)` dark |
| Type | 15px / 500 / `--ds-font-sans` (SF Pro / -apple-system / PingFang SC) |
| Icon | 16×16 SVG, `currentColor`, stroke **1.75**, `inline-flex` + `align-items: center` + `gap: 6px` |
| Hover | 150ms; slightly darker fill + text → `--ds-accent` (`#0071e3` / `#2997ff`) |
| Focus | `:focus-visible` 2px accent ring, 3px offset |
| Active | `scale(.98)` |
| Accent | `.ds-link-pill-accent` — accent fill, white text; hover uses `--ds-accent-hover` |

`.link-pill` / `.link-pill-accent` are aliases of the `ds-` names so generated pages can use either.

Icons should be one consistent Lucide / SF-like line set (mail, graduation-cap, github, file-text, trending-up). Do not mix filled marks with stroke icons.

Mobile nav: `.ds-nav-menu` appears below 734px. Toggle `.is-open` on `.ds-nav` and `aria-expanded` on the button.

## Homepage vs. shared sheet

`index.html` loads `assets/ds.css` then `assets/style.css`. The latter is **page-specific** (language toggle, avatar, publication grid, timeline, lightbox). Do not import `style.css` from `/blog/` or `/ai-frontier-trends/`.

`studio/index.html` is published by a separate script and is **not** restyled here.

## Embedding in generated single-file pages

For a page that is one HTML file (RSS-to-page, paper notes, dashboards):

1. Put the stylesheet in `<head>` as an absolute same-origin URL so the file stays portable when copied:
   ```html
   <link rel="stylesheet" href="https://codyshen0000.github.io/assets/ds.css">
   ```
2. Add `class="ds-page"` on `<html>`. Optionally set `data-theme` from a 4-line inline script (same pattern as the homepage).
3. Wrap the column in `.ds-wrap`. Use `.ds-nav` for chrome, `.ds-hero` or `.ds-section-title` for titles, `.ds-prose` for long text, `.ds-card` for tiles, `.ds-footer` for the close.
4. Do **not** inline a fork of `ds.css` into the generated file. Link the shared sheet so token changes propagate. Offline / email-export is the only exception — then snapshot the current `ds.css` into a `<style>` block and record the commit.
5. Do **not** redefine `--ds-*` unless you are adding a local token. Never override `--ds-accent` to a second brand color on a page that shares this origin.
6. Keep any page-private CSS after the shared link, and prefix those selectors (`blog-`, `trend-`, …) so they cannot collide with `ds-`.
7. System fonts only. Do not add Google Fonts / CDN `@font-face` on pages that consume this system; CJK falls back to PingFang / Hiragino / Noto Sans SC already in the stack.
8. Images: set `width`/`height` or `aspect-ratio` to avoid layout shift. Prefer `loading="lazy"` below the fold.

## Minimal page

```html
<!DOCTYPE html>
<html lang="en" class="ds-page">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Title</title>
  <link rel="stylesheet" href="https://codyshen0000.github.io/assets/ds.css">
</head>
<body>
  <header class="ds-nav"><div class="ds-nav-inner">
    <a class="ds-nav-brand" href="/">Shen Sheng</a>
    <nav class="ds-nav-links">
      <a href="/blog/">Blog</a>
      <a class="ds-btn-link" href="/">Home</a>
    </nav>
  </div></header>
  <main class="ds-wrap ds-section">
    <h1 class="ds-hero-title">Title</h1>
    <article class="ds-prose">
      <p>Body at 17px, ~70ch.</p>
    </article>
  </main>
  <footer class="ds-footer"><div class="ds-wrap ds-footer-inner">
    <p>© Shen Sheng</p>
  </div></footer>
</body>
</html>
```
