# Partials Structure

This directory contains all Hugo partial templates organized by function.

## Directory Structure

```
partials/
├── cards/              # Reusable card components
│   ├── person-link.html
│   ├── project-card-unified.html
│   └── project-tile.html
│
├── components/         # UI components (navigation, layout elements)
│   ├── dock.html
│   ├── footer.html
│   ├── hero-background.html
│   ├── menu.html
│   ├── mobile-menu.html
│   ├── profile-badge.html
│   └── right-dock.html
│
├── cv/                 # CV/Resume specific partials
│   ├── cv-project-item.html
│   └── cv-projects-selection.html
│
├── data/               # Data loading and embedding partials
│   └── portfolio-data.html
│
├── demo/               # Demo page partials for testing components
│   ├── demo-section-*.html
│   └── modals-unified/
│
├── forms/              # Form components
│   ├── contact-form.html
│   └── contact-info.html
│
├── head/               # HTML head section partials
│   ├── css.html
│   ├── head.html
│   └── js.html
│
├── helpers/            # Utility partials for data processing
│   ├── experience-data.html
│   ├── format-number.html
│   ├── get-optimized-image.html
│   ├── get-person.html
│   ├── load-css.html
│   ├── load-css-pattern.html
│   ├── load-scss.html
│   ├── skill-block.html
│   └── skill-tags.html
│
├── modals/             # Modal dialog components
│   ├── auto-person-modal.html
│   ├── person-modal.html
│   ├── person-modal-loader.html
│   └── skill-modal.html
│
├── projects/           # Project-specific partials
│   ├── sector-badge.html
│   └── widgets/        # Project detail page widgets
│       ├── awards.html
│       ├── contributors.html
│       ├── development-time.html
│       ├── downloads.html
│       ├── gallery.html
│       ├── grade.html
│       ├── ranking.html
│       ├── soft-skills.html
│       ├── specialties.html
│       ├── technical-specs.html
│       ├── testimonials.html
│       ├── tools.html
│       ├── widget-sorter.html
│       ├── youtube-gallery.html
│       ├── youtube-single.html
│       ├── youtube-videos.html
│       └── modal/      # Modal variants of widgets
│
├── sections/           # Homepage and main page sections
│   ├── blog.html
│   ├── contact.html
│   ├── education.html
│   ├── experience.html
│   ├── profile.html
│   ├── projects.html
│   ├── skills.html
│   ├── skills-full.html
│   ├── terms.html
│   └── testimonials.html
│
├── social/             # Social media components
│   └── social-links.html
│
├── tech/               # Technology display components
│   ├── combined-technologies.html
│   ├── get-all-technologies.html
│   ├── project-tech-specs.html
│   ├── project-technologies-detailed.html
│   └── tech-icon.html
│
├── get-localized-data.html    # Localization helper (root level)
├── icon.html                   # SVG icon helper (root level)
└── README.md
```

## Usage Conventions

### Calling Partials

Always use the full path from the `partials/` directory:

```go-html-template
{{ partial "sections/profile.html" . }}
{{ partial "components/dock.html" . }}
{{ partial "helpers/get-person.html" (dict "context" $ "personId" "john-doe") }}
```

### Adding New Partials

1. Identify the appropriate category folder
2. Create your partial in that folder
3. Use descriptive names with kebab-case
4. Document complex partials with Hugo comments at the top

### Category Guidelines

| Category | Use For |
|----------|---------|
| `cards/` | Reusable card-style components that display content items |
| `components/` | Layout and navigation elements (header, footer, menus) |
| `data/` | Data embedding and JSON generation for JavaScript |
| `forms/` | Form elements and contact components |
| `head/` | HTML `<head>` content (CSS, JS, meta tags) |
| `helpers/` | Utility functions for data processing, image optimization |
| `modals/` | Modal dialog components |
| `projects/` | Project-specific partials and widgets |
| `sections/` | Main page sections (homepage, skills page, etc.) |
| `social/` | Social media links and sharing components |
| `tech/` | Technology icons and skill display components |
