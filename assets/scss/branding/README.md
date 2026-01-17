# Branding Generator - SCSS Styles

This folder contains all SCSS styles for the Branding Preview/Generator page.

## Files

- `branding.scss` - Main stylesheet containing all styles for the branding generator

## Architecture

The branding generator uses a glassmorphism-inspired design with the following components:

### Page Layout
- `.branding-page` - Main container with z-index isolation (above dock)
- `.branding-layout` - Flexbox layout (sidebar + preview area)

### Editor Sidebar
- `.branding-editor-sidebar` - Sticky sidebar with glass effect
- `.editor-section` - Collapsible sections (Template, Texts, Project, Technologies, Style)
- `.template-grid` / `.template-card` - Template selection grid
- `.tech-tabs` / `.tech-list` / `.tech-item` - Technology selector with tabs
- `.selected-techs` / `.selected-tech` - Selected technologies display with reorder buttons

### Preview Area
- `.branding-preview-area` - Main preview container
- `.branding-controls` - Top control bar (resolution, zoom, export)
- `.preview-container` / `.preview-canvas` - Scalable preview canvas

### Templates
- `.branding-template` - Base template container
- `.template-bg` - Gradient background layer
- `.template-content` - Content wrapper
- `.template-badge` / `.template-title` / `.template-subtitle` - Text elements
- `.template-features` - Feature list with checkmarks
- `.template-tech-stack` - Technology icons display
- `.template-author` - Author info section
- `.template-decoration` - Code snippet decoration

### Template-specific
- `.project-*` - Project Showcase template styles
- `.portfolio-*` - Portfolio Card template styles
- `.skill-*` - Skill Highlight template styles

## CSS Variables

All branding-specific variables are prefixed with `--branding-`:
- `--branding-primary` - Primary color
- `--branding-accent` - Accent color (cyan by default)
- `--branding-glass-bg` - Glass background
- `--branding-glass-border` - Glass border
- `--branding-text-primary` - Primary text color
- `--branding-text-secondary` - Secondary text color
- `--sidebar-width` - Editor sidebar width (380px)

## Future Improvements

Consider splitting into modular SCSS files following the modal pattern:
- `_base.scss` - Variables and page layout
- `_sidebar.scss` - Editor sidebar styles
- `_controls.scss` - Top control bar
- `_preview.scss` - Preview container
- `_templates.scss` - Template base styles
- `_template-service.scss` - Service Card template
- `_template-project.scss` - Project Showcase template
- `_template-portfolio.scss` - Portfolio Card template
- `_template-skill.scss` - Skill Highlight template
- `_responsive.scss` - Mobile adaptations
