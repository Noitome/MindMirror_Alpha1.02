
---

# 📜 Final `CHANGELOG.md`

```markdown
# 📜 CHANGELOG

All notable changes to **Mindmap-App** will be documented here.  
This log is the single source of truth for what has changed between versions.

---

## [Unreleased]
- Placeholder for upcoming features.  
- All changes here will eventually roll into the next tagged release.  

---

## [1.0.0] – 2025-08-18
### Added
- Initial **Mindmap View** with nodes.
- **Mirror View** with time-scaled bubbles.
- **Task Timers** with subnode → parent aggregation.
- **Alignment Score** updated dynamically.
- **Combined View** (mindmap + mirror in single interface).

### Changed
- Established core file system layout (`src/components`, `src/store`, `src/data`, `src/lib`, `src/tests`).
- Set up environment handling and fallback local adapter (documented in README).

### Fixed
- Baseline dev/preview stability.
- Guardrails to prevent feature regressions or silent deletions.

---

## Contribution Rules
- Never remove or regress baseline functionality.  
- Only **add** features or enhancements in future versions.  
- Each release must document changes here under **Added / Changed / Fixed**.  
