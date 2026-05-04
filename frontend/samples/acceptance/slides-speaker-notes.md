---
type: slides
title: Notes Deck
theme: default
aspectRatio: "16:9"
---

# Notes Deck

### Build reliable docs — ship with confidence

*Engineering All-Hands · May 2026*

<!-- speaker: greet the audience, mention this is a 15-min talk with Q&A at the end -->

---

## Agenda

1. Why docs break
2. The three risks we face
3. Mitigation strategies
4. Acceptance coverage

<!-- speaker: keep it tight — each section is about 3 minutes -->

---

## Why Docs Break

> Documentation drifts when it lives outside the feedback loop of shipping code.

![Code and docs side by side](https://picsum.photos/seed/codedocs/900/400)

Every deploy that skips a docs review adds technical debt to your README.

<!-- speaker: ask the audience how many have shipped a feature that broke an existing guide -->

---

## The Three Risks

| Risk | Impact | Likelihood |
|---|---|---|
| **Parser drift** | Renders incorrectly | High |
| **State mismatch** | Stale UI snapshots | Medium |
| **Missing docs** | Onboarding friction | High |

<!-- speaker: emphasize that parser drift is the silent killer — it fails quietly -->

---

## Parser Drift

### What goes wrong

```md
---
type: slides
---

## My Slide

---   ← extra spaces break some parsers
```

### What we fixed

- Trim trailing whitespace before divider check
- Reject partial fence matches inside code blocks

<!-- speaker: show the real bug from last sprint if time allows -->

---

## State Mismatch

![State diagram](https://picsum.photos/seed/statemachine/900/400)

When the UI component re-renders before the parser flushes, slides arrive **out of order**.

**Fix:** batch parser output behind a `flushSlide()` guard.

<!-- speaker: the diagram shows the race condition — three states, one bad transition -->

---

## Missing Docs

- No onboarding guide → 2× longer ramp time
- Outdated API reference → support tickets spike
- No acceptance samples → regressions slip through

> A test suite that doesn't cover your samples is a promise you can't keep.

<!-- speaker: show the support ticket data — 34 tickets last quarter traced back to stale docs -->

---

## Mitigation Strategy

### Short-term

1. Add acceptance sample for every new feature
2. Run parser tests against all samples in CI

### Long-term

- Lint markdown on save
- Auto-generate type reference from source

<!-- speaker: the short-term items are already tracked — link the Linear tickets after the talk -->

---

## Coverage Today

| Area | Samples | Tests passing |
|---|---|---|
| Reading | 4 | ✅ |
| Slides | 3 | ✅ |
| Quiz | 4 | ✅ |
| **Total** | **11** | **✅** |

<!-- speaker: we went from 0 to 11 acceptance samples this sprint — huge win -->

---

# Thank You

**Questions?**

*Slides live at `/slides` — speaker notes visible in presenter mode*

<!-- speaker: open the floor, remind them to check the repo for the acceptance samples -->
