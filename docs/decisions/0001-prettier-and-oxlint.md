# 0001. Prettier formats and oxlint lints every repository

- **Decision:** Accepted
- **Implementation:** Implemented
- **Where:** `prettier.json`, `oxlint.json`, and each repository's `package.json`, `.oxlintrc.json` and CI
- **Area:** Code style

## Context

The OpenAsy repositories were formatted by hand and by editors set up differently, so one file could wrap at 100 characters and the next at 200, and a change to a line often reformatted its neighbours. Nothing checked for mistakes a linter finds, such as a hook called conditionally or a list item without a key.

## Decision

- **One package, `@openasy/code-style`, holds the settings.** Every repository installs it, with `prettier` and `oxlint`, as development dependencies. A change to the style is a release of this package and a dependency update in each repository.
- **Prettier formats.** Lines wrap at 160 characters; double quotes, semicolons and trailing commas, as the code was already written. A repository points at the settings with `"prettier": "@openasy/code-style/prettier"` in its `package.json`. Markdown is left out in `.prettierignore`: READMEs and decisions are prose wrapped by hand, and Prettier pads every table row to its widest cell, which makes long tables unreadable as text.
- **oxlint lints.** The repositories compile with TypeScript 7, which has no JavaScript API, so typescript-eslint cannot read them; oxlint needs no TypeScript and runs in well under a second. A repository's `.oxlintrc.json` extends `node_modules/@openasy/code-style/oxlint.json`. oxlint skips what `.gitignore` lists; generated files kept in a repository are ignored in its own `.oxlintrc.json`, because an extended file's ignore patterns do not apply.
- **The rules are the ones that find mistakes.** oxlint's correctness rules, the React hook rules and `jsx-key`, with these off:
  - `no-unused-expressions`: `a && b()` and `(a(), b())` are how the code is written.
  - `no-control-regex`: the expressions it finds strip control characters on purpose.
  - `react/set-state-in-effect`, `react/refs`, `react/preserve-manual-memoization`: advice for the React Compiler, which the products do not use.
  - `jsx-a11y/prefer-tag-over-role`, and `jsx-a11y/no-noninteractive-tabindex`, since a scrollable region needs `tabIndex={0}` to be reached by keyboard.
  - `react/rules-of-hooks` in Storybook stories, whose `render` functions call hooks as components do.
- **A label may hold its text a few elements deep.** `label-has-associated-control` looks five levels into a `<label>`, as the forms wrap the title and the hint of a choice in spans of their own.
- **CI runs both.** `npm run lint` and `npm run format:check` run next to the typecheck and the tests, and a failure stops the change.

## Consequences

- A diff shows what changed, not how an editor wrapped it.
- Each repository has one formatting commit when it starts.
- Rules that need type information, such as floating promises, are not available until oxlint's type-aware mode or TypeScript 7's API is.
