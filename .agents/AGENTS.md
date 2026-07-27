# Project Rules

## Automatic Prompt & Result Logging Rule

Every time the user provides a proper coding or task-related prompt that involves project changes/deliverables, automatically add an entry to `prompts.md` in the following format:

```markdown
## [Date] - [Task]
**Prompt:** the prompt I gave you
**Result:** what you produced or did
**Correction (if any):** anything I had to fix or ask you to change
```

Do NOT log entries for simple meta-instructions, clarifications, rules, or queries that do not result in codebase changes/deliverables.
