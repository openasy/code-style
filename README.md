# @openasy/code-style

One code style for every [OpenAsy](https://github.com/openasy) repository: the [Prettier](https://prettier.io) settings that format the code and the [oxlint](https://oxc.rs) rules that lint it ([ADR 0001](docs/decisions/0001-prettier-and-oxlint.md)).

## Use it in a repository

Each release attaches the package to its [GitHub release](https://github.com/openasy/code-style/releases); no registry or token is needed.

```bash
npm install --save-dev https://github.com/openasy/code-style/releases/download/v0.1.2/openasy-code-style-0.1.2.tgz prettier@3.9.9 oxlint@1.87.0
```

`package.json`:

```json
{
  "prettier": "@openasy/code-style/prettier",
  "scripts": {
    "lint": "oxlint",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

`.oxlintrc.json`:

```json
{
  "extends": ["./node_modules/@openasy/code-style/oxlint.json"]
}
```

oxlint skips what `.gitignore` lists. Generated files kept in the repository go in the repository's own
`.oxlintrc.json` as `"ignorePatterns"`, since patterns in an extended file do not apply. A `.prettierignore` lists what is generated, such as `dist`, `build` and `package-lock.json`, and `*.md`: Prettier pads each table row to its widest cell, which long tables in READMEs and decisions do not survive. CI runs `npm run lint` and `npm run format:check` next to the typecheck and the tests.

## What it sets

|          |                                                                                                             |
| -------- | ----------------------------------------------------------------------------------------------------------- |
| Prettier | 160 characters a line, double quotes, semicolons, trailing commas, LF line ends                             |
| oxlint   | Correctness rules, React hooks, `jsx-key` and accessibility; the rules turned off, and why, are in ADR 0001 |

## Develop

```bash
npm ci
npm run lint && npm run format:check && npm test
```

The tests format and lint the files in `test/fixtures`: `good.tsx` passes, and `bad.tsx` has a hook called conditionally and a list item without a key.

## Release

Set `version` in `package.json`, then push a tag `vX.Y.Z`. The release workflow checks, packs and attaches `openasy-code-style-X.Y.Z.tgz`.

## Licence

[Apache-2.0](LICENSE)
