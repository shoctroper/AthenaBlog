# Graph Report - blog  (2026-08-12)

## Corpus Check
- 51 files · ~369,047 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 136 nodes · 128 edges · 31 communities (23 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4429e645`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [...slug].astro
- package.json
- generate-social-cards.mjs
- exporter.mjs
- BaseLayout.astro
- scripts
- index.astro
- devDependencies
- Staging y rollback del blog
- from-case.mjs
- check-card-titles.mjs
- check-public-html.mjs
- content.config.ts
- case-e5-sleep.md
- tsconfig.json
- check-social-cards.mjs
- verify-prod.sh
- CONTENT_CONTRACT.md
- verify-preview.sh

## God Nodes (most connected - your core abstractions)
1. `scripts` - 8 edges
2. `Staging y rollback del blog` - 5 edges
3. `toPost()` - 4 edges
4. `transformJson()` - 3 edges
5. `svg()` - 3 edges
6. `configuredSocials` - 3 edges
7. `@astrojs/rss` - 2 edges
8. `@astrojs/sitemap` - 2 edges
9. `astro` - 2 edges
10. `@astrojs/check` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (31 total, 8 thin omitted)

### Community 0 - "[...slug].astro"
Cohesion: 0.14
Nodes (6): articleJsonLd, currentIndex, posts, related, posts, tags

### Community 1 - "package.json"
Cohesion: 0.17
Nodes (11): astro, @astrojs/rss, @astrojs/sitemap, dependencies, astro, @astrojs/rss, @astrojs/sitemap, name (+3 more)

### Community 2 - "generate-social-cards.mjs"
Cohesion: 0.21
Nodes (10): colors, destination, escapeXml(), exec, png(), root, source, svg() (+2 more)

### Community 3 - "exporter.mjs"
Cohesion: 0.25
Nodes (8): quote(), required, metadata, toPost(), transformJson(), args, caseData, target

### Community 4 - "BaseLayout.astro"
Cohesion: 0.27
Nodes (4): configuredSocials, site, publishedVideos, videos

### Community 5 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, check:public, dev, generate:social, preview, test, verify:preview

### Community 7 - "devDependencies"
Cohesion: 0.29
Nodes (7): @astrojs/check, @lhci/cli, devDependencies, @astrojs/check, @lhci/cli, typescript, typescript

### Community 8 - "Staging y rollback del blog"
Cohesion: 0.33
Nodes (5): Ensayo de fallo, Frontera, Previsualización, Rollback, Staging y rollback del blog

### Community 9 - "from-case.mjs"
Cohesion: 0.40
Nodes (4): args, data, source, tags

### Community 12 - "content.config.ts"
Cohesion: 0.50
Nodes (3): collections, posts, videos

### Community 13 - "case-e5-sleep.md"
Cohesion: 0.50
Nodes (3): El descanso tiene estructura, Lo que cambia cuando falta, Proteger el tiempo de descanso

## Knowledge Gaps
- **61 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `[...slug].astro` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._