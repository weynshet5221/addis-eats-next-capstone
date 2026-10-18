# Performance Notes

## Before Optimization

- Performance: 26
- Accessibility: 84
- Best Practices: 100
- SEO: 100

## Optimizations

- Converted dish images to `next/image`.
- Added real image dimensions.
- Added responsive `sizes`.
- Added `priority` only to the largest above-the-fold image.
- Replaced external font loading with `next/font`.
- Third-party scripts use lazy loading where needed.
- Added environment variable documentation.

## After Optimization

- Performance: 92
- Accessibility: 94
- Best Practices: 100
- SEO: 100

## Environment

Real secrets are stored in `.env.local`.
`.env*.local` files are ignored by Git.
`.env.example` contains only dummy values.