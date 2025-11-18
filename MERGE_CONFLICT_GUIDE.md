# Merge conflict guide for Tel Aviv branding updates

This branch carries the Tel Aviv flavor challenge wording and refreshed vector assets. If GitHub reports conflicts when merging, keep the Tel Aviv branding versions from this branch.

## Files reported in conflict
- `category-selection.tsx`
- `client/src/pages/category-selection.tsx`
- `public/logo-game.svg`
- `client/public/logo-game.svg`
- `public/social-card.svg`
- `client/public/social-card.svg`

## Recommended resolutions (GitHub editor)
1. **Open each conflicted file** in the GitHub web editor and choose the version that uses the "Tel Aviv flavor challenge" subtitle and the updated Wolt-style gradients.
2. **For both `category-selection.tsx` files**, keep the hero subtitle text as "Tel Aviv flavor challenge" and the supporting description "Test your knowledge of Tel Aviv's best restaurants!".
3. **For both logo SVGs**, keep the version without the "Glassmorphic" label—only the Wolt wordmark and icon remain.
4. **For both social card SVGs**, keep the Tel Aviv-branded title/subtitle pair and gradient background, without any Glassmorphic wording.
5. After resolving all files, click **Mark as resolved** on GitHub and commit the merge resolution.

## Verification
- Run `npm run build -- --clearScreen false` locally (or via CI) to confirm the assets and text compile without issues.
