---
trigger: always_on
---

## Git Rules

- **Never commit to `main` directly**
- **Never commit secrets, API keys, or `.env` files**
- Commit messages follow Conventional Commits:
  - `feat: add VPN service restart on boot`
  - `fix: correct keyword detection on WhatsApp`
  - `docs: update database schema`
  - `chore: upgrade dependencies`
  - `test: add unit tests for blocklist matching`
  - `refactor: extract VPN builder to factory`
- PR title = commit message format
- Each PR resolves one issue
- PR must have description explaining what changed and why
- Squash merge into `develop`
- `main` merges from `develop` only — via release PR
- Branch names: `feature/`, `fix/`, `refactor/`, `docs/`, `release/`
- No WIP commits on `develop` — use draft PRs
