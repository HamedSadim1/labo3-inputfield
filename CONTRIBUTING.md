# Contributing

## Branches

Work from a dedicated branch created from `main`:

```bash
git switch -c feature/short-description
```

Keep pull requests focused and open them against `main`.

## Local setup

```bash
npm install
npm run dev
```

Husky is installed automatically through the `prepare` script. This branch
uses TypeScript `5.9.x` because the current `typescript-eslint` release does
not yet support TypeScript 7. The hooks run these checks:

- `pre-commit`: Prettier and ESLint through `lint-staged`
- `commit-msg`: Conventional Commits validation through Commitlint

## Quality checks

Run the complete local check before opening a pull request:

```bash
npm run validate
```

This runs formatting checks, ESLint, TypeScript checking and the production
build.

## Commit messages

Use the Conventional Commits format:

```text
<type>(optional-scope): short description
```

Examples:

```text
feat: add password visibility toggle
fix(validation): reject decimal ages
chore: update project tooling
```

Common types are `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`
and `ci`.

## Pull requests

Before opening a pull request:

1. Run `npm run validate`.
2. Push your branch to GitHub.
3. Open a pull request against `main`.
4. Wait for the **Pull Request Checks** workflow to pass.
5. Respond to review feedback before merging.
