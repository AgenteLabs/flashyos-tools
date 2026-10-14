#!/usr/bin/env node
// Build estate/orgs.json (mesh-roster/1) by MEASURING each repo's charter in a
// sibling checkout under a root, from the population list repos.tsv. A repo not
// checked out is reported present:false, roles:null, valid:null — unread, never
// counted as zero.
//
//   node build-roster.mjs <repos.tsv> <checkout-root> <aao-check.mjs> > orgs.json
//
// repos.tsv rows are `owner/name \t kind \t dir [\t reason]`. The optional
// fourth column is WHY a repository carries no charter on purpose — client work
// whose grant is not ours to make, an empty placeholder awaiting its first
// push, a dormant archive, the org profile. It is recorded as the org's
// `x-note` and surfaces only when the charter is genuinely absent, so the
// register names its exclusions rather than leaving a reader to guess whether a
// gap is "deliberately out" or "nobody looked" — the estate's own rule for
// every register it keeps.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const [tsvPath, root, aaoCheck] = process.argv.slice(2);
const rows = readFileSync(tsvPath, 'utf8').split('\n').filter(Boolean).map((l) => l.split('\t'));
const PRIVATE_KINDS = new Set(['client']);
const PRIVATE_REPOS = new Set(['second-brain', 'ritualos', 'FlashyMobileLegacy', 'FlashyGold', 'michaelgord', 'sarahgord', 'multibank-litigation', 'mystandard-website']);
const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const orgs = rows.map(([full, kind, dir, reason]) => {
  const [, name] = full.split('/');
  const d = join(root, dir === 'dot-github' ? '.github' : dir);
  const cp = join(d, 'flashyos.roles.json');
  let present = false, roles = null, valid = null;
  if (existsSync(cp)) {
    present = true;
    try {
      const c = JSON.parse(readFileSync(cp, 'utf8'));
      roles = Array.isArray(c.roles) ? c.roles.length : 0;
    } catch { roles = 0; }
    try { execFileSync('node', [aaoCheck, 'validate', cp], { stdio: 'pipe' }); valid = true; }
    catch { valid = false; }
  }
  const listing = (PRIVATE_KINDS.has(kind) || PRIVATE_REPOS.has(name)) ? 'private' : 'public';
  const org = {
    repo: full,
    org: slug(name),
    kind,
    charter: { present, roles, valid },
    listing,
    served: { domain: null, handshake: null },
    provision: 'pending',
  };
  // A charter that is genuinely absent is either deliberately out (the reason
  // column says why) or simply not checked out here. The two look identical
  // from a gap list and need opposite answers, so a reason, when given, is
  // carried only where the charter is absent — and a reason on a repo that DOES
  // carry a charter is a contradiction the build refuses rather than prints.
  if (reason) {
    if (present) throw new Error(`${full}: a reason-for-absence is set, but this repository carries a charter`);
    org['x-note'] = reason;
  }
  return org;
});

const doc = {
  $schema: './mesh-roster-1.schema.json',
  contract: 'mesh-roster/1',
  generated: new Date().toISOString().slice(0, 10),
  'x-note': 'Charter present/roles/valid are MEASURED from a sibling checkout when present, null when the repo is not checked out (unread, never zero). served.handshake is null everywhere: proving a domain serves the handshake needs a live fetch this survey does not make. provision is pending for all until a person runs provision-org-from-charter with DATABASE_URL.',
  orgs,
};
process.stdout.write(JSON.stringify(doc, null, 2) + '\n');
