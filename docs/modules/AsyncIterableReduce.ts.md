---
title: AsyncIterableReduce.ts
nav_order: 4
parent: Modules
---

## AsyncIterableReduce overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [sequencing](#sequencing)
  - [getAsyncIteratorNextTask](#getasynciteratornexttask)
  - [reduceUntilWithIndexLimited](#reduceuntilwithindexlimited)

---

# sequencing

## getAsyncIteratorNextTask

**Signature**

```ts
export declare function getAsyncIteratorNextTask<A>(iterable: AsyncIterable<A>): T.Task<O.Option<A>>
```

Added in v1.0.0

## reduceUntilWithIndexLimited

generic async iterable reducer.

- limit: how many values pull in parallel.
- until: predicate if the function should keep pulling values from the iterator
- b: reducer accumulator initial value.
- f: reducer function.

**Signature**

```ts
export declare function reduceUntilWithIndexLimited<A, B>(
  limit: number,
  until: (a: A) => boolean,
  b: B,
  f: (i: number, b: B, a: A) => B
): (iterable: AsyncIterable<A>) => T.Task<B>
```

Added in v1.0.0
