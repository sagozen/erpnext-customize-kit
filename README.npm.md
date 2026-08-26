# pankit

Agent skills for the software delivery lifecycle. One skill, nine commands, one reference file per stage.

This package ships a skeleton. The command references are placeholders meant to be replaced with your own instructions; the routing, build, and tests around them work as shipped.

## Install the skills

```bash
npx pankit skills install
```

Installs the compiled skill into whichever agent harnesses it finds: Claude Code, Cursor, and Codex.

## Commands

Once installed, one skill named `pankit` carries nine sub-commands:

| Stage | Commands |
|---|---|
| Define | `spec`, `plan`, `design` |
| Build | `code` |
| Verify | `test`, `review` |
| Ship | `docs`, `release`, `retro` |

Type `/pankit` with no argument for a context-aware menu, or `/pankit spec add rate limiting` to go straight to a stage.

## CLI

```bash
npx pankit skills install     # install the skills
npx pankit --help             # show all commands
```

## Source

https://github.com/pankit/pankit-community

Apache 2.0.
