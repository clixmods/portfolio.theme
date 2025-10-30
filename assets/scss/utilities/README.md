# Utilities Directory

This directory is reserved for utility SCSS files that contain:
- Mixins
- Functions
- Variables (if not using CSS custom properties)
- Helper classes
- Common reusable patterns

## Purpose

The utilities directory should contain code that:
- Is used across multiple components/pages
- Provides functional helpers (not visual components)
- Can be imported where needed without side effects

## Examples

Potential utility files could include:
- `_mixins.scss` - Reusable SCSS mixins
- `_functions.scss` - SCSS functions
- `_helpers.scss` - Helper classes (e.g., `.visually-hidden`, `.clearfix`)
- `_animations.scss` - Global animation definitions
- `_breakpoints.scss` - Media query helpers

## Current Status

Currently empty - utilities can be added as needed when patterns emerge that should be shared across multiple features.
