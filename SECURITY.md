<!-- estate-hygiene:begin — emitted by tools/estate-hygiene-files.mjs in AgenteLabs/flashyos; regenerate, never edit -->
# Security

## Reporting a vulnerability

Report it privately, never in a public issue, pull request or chat channel.
Two routes, and both reach the same people:

- **Email michael@flashygroup.com** — the estate's one disclosure address, the same one
  published at https://flashynetwork.com/security/
  and in https://flashynetwork.com/.well-known/security.txt.
  One route across every repository is deliberate: a researcher who finds two
  addresses and picks the worse one has been failed by us, not by their choice.
- **GitHub → Security → Report a vulnerability** on this repository, which
  opens a private advisory only the maintainers can read. If that button is
  missing, private vulnerability reporting has not been enabled on this
  repository yet; use the email route and say so in the report.

Include what you found, how to reproduce it and what you believe the impact
is. Do not include real credentials, private keys or production data: nothing
here needs them to reproduce a finding.

## What to expect

| | |
|---|---|
| Acknowledgement | within 72 hours |
| An assessment, and what we are doing | agreed with you, in writing |
| Publication | a window agreed with you, never imposed |

If we miss the acknowledgement window, say so publicly. A window nobody is
held to is worse than none, because it asks a reporter to wait on a promise
that was never load-bearing.

## Supported versions

The default branch only. There is no maintained release line behind it: a
finding against the default branch is in scope, a finding against an older
tag or a fork is a reason to update.

## A committed credential is rotated, never removed

If a report is that a secret reached this repository, the fix is rotation at
the issuer. Deleting the file, rewriting history or force-pushing is not a
fix: the value is burned the moment it lands and stays burned, because
history, forks, caches and mirrors keep it. Say which secret, and we rotate
it before anything else.

## About this document

The sections above are emitted by [`tools/estate-hygiene-files.mjs`](https://github.com/AgenteLabs/flashyos/blob/main/tools/estate-hygiene-files.mjs)
in AgenteLabs/flashyos from one template the whole estate shares, and
`--check` fails when they drift.
Regenerate them; never edit them here. Anything below the marker is this
repository's own and is kept as written.
<!-- estate-hygiene:end — everything below is this repository’s own -->

## Scope

This repository's code and the documents it publishes. A vulnerability in a
dependency belongs to that dependency; tell us anyway if it reaches users
through us.

## What is not a vulnerability here

A specification that permits something you consider unwise is a specification
disagreement — open an issue, because that is a conversation worth having in
public. A published file proving less than a reader assumes is **the stated
design**: publishing a file at a domain proves that somebody can write to that
host, and it never proves an organisation is who it says it is.
