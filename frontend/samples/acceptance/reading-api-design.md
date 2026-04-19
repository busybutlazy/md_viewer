---
title: API Design Notes
author: Phase 1 Acceptance
date: 2026-04-19
tags: [api, design, review]
---

# API Design Notes

## Constraints

- Keep contracts explicit
- Prefer additive changes
- Document breaking changes

## Example

```ts
interface ApiEnvelope<T> {
  data: T;
  requestId: string;
}
```

> Stable contracts reduce coordination cost.
