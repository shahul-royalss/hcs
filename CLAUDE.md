# Instructions for Claude Code in this repository

## Git commit identity (mandatory)

- Every commit MUST use the repository's configured Git identity:
  `Reshikadara <reshikadara@gmail.com>`.
- Never author or commit as Claude (`Claude <noreply@anthropic.com>` or any
  Anthropic identity), and never add `Co-Authored-By: Claude` trailers or
  Claude session links to commit messages.
- Do not override the Git author with `--author`, environment variables
  (`GIT_AUTHOR_*` / `GIT_COMMITTER_*`), or global config.
- If `git config user.name` / `user.email` are missing or differ from the
  identity above, STOP and ask the owner before committing — do not fall back
  to the Claude identity.

## Project conventions

Read `PROJECT_GUIDELINES.md` before making changes — it is the living document
for architecture, structure, and conventions, and must be updated whenever a
significant structural or architectural change is made.
