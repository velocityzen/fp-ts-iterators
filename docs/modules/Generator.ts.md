---
title: Generator.ts
nav_order: 6
parent: Modules
---

## Generator overview

The Generator module provides tools for working with Generator<T> type in a functional way.

In functional jargon, this module provides a monadic interface over Generator<T>.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [conversions](#conversions)
  - [fromIterable](#fromiterable)

---

# conversions

## fromIterable

**Signature**

```ts
export declare function fromIterable<A>(fa: Iterable<A>): Generator<A>
```

Added in v1.0.0
