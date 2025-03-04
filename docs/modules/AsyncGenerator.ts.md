---
title: AsyncGenerator.ts
nav_order: 1
parent: Modules
---

## AsyncGenerator overview

The AsyncGenerator module provides tools for working with AsyncGenerator<T> type in a functional way.

In functional jargon, this module provides a monadic interface over AsyncGenerator<T>.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [conversions](#conversions)
  - [fromAsyncIterable](#fromasynciterable)
  - [fromIterable](#fromiterable)
  - [fromLazyArg](#fromlazyarg)
  - [fromTask](#fromtask)

---

# conversions

## fromAsyncIterable

**Signature**

```ts
export declare function fromAsyncIterable<A>(fa: AsyncIterable<A>): AsyncGenerator<A>
```

Added in v1.0.0

## fromIterable

**Signature**

```ts
export declare function fromIterable<A>(fa: Iterable<A>): LazyArg<AsyncGenerator<A>>
```

Added in v1.0.0

## fromLazyArg

**Signature**

```ts
export declare function fromLazyArg<A>(f: () => A): AsyncGenerator<A>
```

Added in v1.0.0

## fromTask

**Signature**

```ts
export declare function fromTask<A>(f: Task<A>): AsyncGenerator<A>
```

Added in v1.0.0
