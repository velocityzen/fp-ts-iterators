---
title: AsyncIterable.ts
nav_order: 2
parent: Modules
---

## AsyncIterable overview

The AsyncIterable module provides tools for working with AsyncIterable<T> type in a functional way.

In functional jargon, this module provides a monadic interface over AsyncIterable<T>.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [apply](#apply)
  - [ap](#ap)
  - [apFirst](#apfirst)
  - [apSecond](#apsecond)
  - [apTask](#aptask)
- [combinators](#combinators)
  - [tap](#tap)
  - [tapIO](#tapio)
  - [tapTask](#taptask)
- [constructors](#constructors)
  - [makeBy](#makeby)
  - [makeByTask](#makebytask)
  - [makeByTaskWithIndex](#makebytaskwithindex)
  - [makeByWithIndex](#makebywithindex)
  - [of](#of)
  - [unfold](#unfold)
  - [unfoldTask](#unfoldtask)
- [conversions](#conversions)
  - [fromAsyncGenerator](#fromasyncgenerator)
  - [fromIO](#fromio)
  - [fromIterable](#fromiterable)
  - [fromLazyArg](#fromlazyarg)
  - [fromTask](#fromtask)
- [do notation](#do-notation)
  - [Do](#do)
  - [apS](#aps)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [let](#let)
- [filtering](#filtering)
  - [PredicateTask (interface)](#predicatetask-interface)
  - [PredicateTaskWithIndex (interface)](#predicatetaskwithindex-interface)
  - [compact](#compact)
  - [filter](#filter)
  - [filterMap](#filtermap)
  - [filterMapTask](#filtermaptask)
  - [filterMapTaskWithIndex](#filtermaptaskwithindex)
  - [filterMapWithIndex](#filtermapwithindex)
  - [filterTask](#filtertask)
  - [filterTaskWithIndex](#filtertaskwithindex)
  - [filterWithIndex](#filterwithindex)
  - [lefts](#lefts)
  - [rights](#rights)
  - [uniq](#uniq)
- [folding](#folding)
  - [foldMapPar](#foldmappar)
  - [foldMapSeq](#foldmapseq)
  - [foldMapWithIndexPar](#foldmapwithindexpar)
  - [toArrayLimited](#toarraylimited)
  - [toArrayPar](#toarraypar)
  - [toArraySeq](#toarrayseq)
  - [toIterableLimited](#toiterablelimited)
  - [toIterablePar](#toiterablepar)
  - [toIterableSeq](#toiterableseq)
- [instances](#instances)
  - [Applicative](#applicative)
  - [Apply](#apply)
  - [Chain](#chain)
  - [FromIO](#fromio)
  - [FromTask](#fromtask)
  - [Functor](#functor)
  - [FunctorWithIndex](#functorwithindex)
  - [Monad](#monad)
  - [MonadIO](#monadio)
  - [Pointed](#pointed)
  - [Unfoldable](#unfoldable)
- [mapping](#mapping)
  - [as](#as)
  - [asUnit](#asunit)
  - [flap](#flap)
  - [map](#map)
  - [mapWithIndex](#mapwithindex)
  - [transform](#transform)
  - [transformTask](#transformtask)
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
  - [flatMapIterable](#flatmapiterable)
  - [flatMapTask](#flatmaptask)
  - [flatMapTaskWithIndex](#flatmaptaskwithindex)
  - [flatten](#flatten)
- [type lambdas](#type-lambdas)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)

---

# apply

## ap

**Signature**

```ts
export declare const ap: <A>(fa: AsyncIterable<A>) => <B>(fab: AsyncIterable<(a: A) => B>) => AsyncIterable<B>
```

Added in v1.0.0

## apFirst

**Signature**

```ts
export declare const apFirst: <B>(second: AsyncIterable<B>) => <A>(first: AsyncIterable<A>) => AsyncIterable<A>
```

Added in v1.0.0

## apSecond

**Signature**

```ts
export declare const apSecond: <B>(second: AsyncIterable<B>) => <A>(first: AsyncIterable<A>) => AsyncIterable<B>
```

Added in v1.0.0

## apTask

**Signature**

```ts
export declare const apTask: <A>(
  fa: AsyncIterable<A>
) => <B>(fab: AsyncIterable<(a: A) => T.Task<B>>) => AsyncIterable<B>
```

Added in v1.0.0

# combinators

## tap

Composes computations in sequence, using the return value of one computation to determine the next computation and
keeping only the result of the first.

**Signature**

```ts
export declare const tap: {
  <A, _>(self: AsyncIterable<A>, f: (a: A) => AsyncIterable<_>): AsyncIterable<A>
  <A, _>(f: (a: A) => AsyncIterable<_>): (self: AsyncIterable<A>) => AsyncIterable<A>
}
```

Added in v1.0.0

## tapIO

**Signature**

```ts
export declare const tapIO: {
  <A, _>(f: (a: A) => IO<_>): (self: AsyncIterable<A>) => AsyncIterable<A>
  <A, _>(self: AsyncIterable<A>, f: (a: A) => IO<_>): AsyncIterable<A>
}
```

Added in v1.0.0

## tapTask

**Signature**

```ts
export declare const tapTask: {
  <A, _>(f: (a: A) => T.Task<_>): (self: AsyncIterable<A>) => AsyncIterable<A>
  <A, _>(self: AsyncIterable<A>, f: (a: A) => T.Task<_>): AsyncIterable<A>
}
```

Added in v1.0.0

# constructors

## makeBy

**Signature**

```ts
export declare const makeBy: <A>(f: () => O.Option<A>) => AsyncIterable<A>
```

Added in v1.0.0

## makeByTask

**Signature**

```ts
export declare const makeByTask: <A>(f: () => T.Task<O.Option<A>>) => AsyncIterable<A>
```

Added in v1.0.0

## makeByTaskWithIndex

Return a `AsyncIterable` with elements initialized with `f(i)`.

Iterable stops when f return O.none

**Signature**

```ts
export declare const makeByTaskWithIndex: <A>(f: (i: number) => T.Task<O.Option<A>>) => AsyncIterable<A>
```

Added in v1.0.0

## makeByWithIndex

Return a `AsyncIterable` with elements initialized with `f(i)`.

Iterable stops when f return O.none

**Signature**

```ts
export declare const makeByWithIndex: <A>(f: (i: number) => O.Option<A>) => AsyncIterable<A>
```

Added in v1.0.0

## of

**Signature**

```ts
export declare const of: <A>(a: A) => AsyncIterable<A>
```

Added in v1.0.0

## unfold

**Signature**

```ts
export declare const unfold: <A, B>(b: B, f: (b: B) => O.Option<readonly [A, B]>) => AsyncIterable<A>
```

Added in v1.0.0

## unfoldTask

**Signature**

```ts
export declare const unfoldTask: <A, B>(b: B, f: (b: B) => T.Task<O.Option<readonly [A, B]>>) => AsyncIterable<A>
```

Added in v1.0.0

# conversions

## fromAsyncGenerator

**Signature**

```ts
export declare function fromAsyncGenerator<A, R, N>(fa: LazyArg<AsyncGenerator<A, R, N>>)
```

Added in v1.0.0

## fromIO

**Signature**

```ts
export declare const fromIO: <A>(fa: IO<A>) => AsyncIterable<A>
```

Added in v1.0.0

## fromIterable

**Signature**

```ts
export declare const fromIterable: <A>(fa: Iterable<A>) => AsyncIterable<A>
```

Added in v1.0.0

## fromLazyArg

**Signature**

```ts
export declare const fromLazyArg: <A>(fa: LazyArg<A>) => AsyncIterable<A>
```

Added in v1.0.0

## fromTask

**Signature**

```ts
export declare const fromTask: <A>(fa: T.Task<A>) => AsyncIterable<A>
```

Added in v1.0.0

# do notation

## Do

**Signature**

```ts
export declare const Do: AsyncIterable<{}>
```

Added in v1.0.0

## apS

**Signature**

```ts
export declare const apS: <N, A, B>(
  name: Exclude<N, keyof A>,
  fb: AsyncIterable<B>
) => (fa: AsyncIterable<A>) => AsyncIterable<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bind

**Signature**

```ts
export declare const bind: <N, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => AsyncIterable<B>
) => (ma: AsyncIterable<A>) => AsyncIterable<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bindTo

**Signature**

```ts
export declare const bindTo: <N>(name: N) => <A>(fa: AsyncIterable<A>) => AsyncIterable<{ readonly [K in N]: A }>
```

Added in v1.0.0

## let

**Signature**

```ts
export declare const let: <N, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (fa: AsyncIterable<A>) => AsyncIterable<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

# filtering

## PredicateTask (interface)

**Signature**

```ts
export interface PredicateTask<A> {
  (a: A): Task<boolean>
}
```

Added in v1.0.0

## PredicateTaskWithIndex (interface)

**Signature**

```ts
export interface PredicateTaskWithIndex<I, A> {
  (i: I, a: A): Task<boolean>
}
```

Added in v1.0.0

## compact

Compacts an AsyncIterable of `Option`s discarding the `None` values and
keeping the `Some` values. It returns a new array containing the values of
the `Some` options.

**Signature**

```ts
export declare const compact: <A>(fa: AsyncIterable<O.Option<A>>) => AsyncIterable<A>
```

Added in v1.0.0

## filter

**Signature**

```ts
export declare const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: AsyncIterable<A>) => AsyncIterable<B>
  <A>(predicate: Predicate<A>): <B extends A>(fb: AsyncIterable<B>) => AsyncIterable<B>
  <A>(predicate: Predicate<A>): (fa: AsyncIterable<A>) => AsyncIterable<A>
}
```

Added in v1.0.0

## filterMap

**Signature**

```ts
export declare const filterMap: <A, B>(f: (a: A) => O.Option<B>) => (fa: AsyncIterable<A>) => AsyncIterable<B>
```

Added in v1.0.0

## filterMapTask

**Signature**

```ts
export declare const filterMapTask: <A, B>(
  f: (a: A) => T.Task<O.Option<B>>
) => (fa: AsyncIterable<A>) => AsyncIterable<B>
```

Added in v1.0.0

## filterMapTaskWithIndex

**Signature**

```ts
export declare const filterMapTaskWithIndex: <A, B>(
  f: (i: number, a: A) => T.Task<O.Option<B>>
) => (fa: AsyncIterable<A>) => AsyncIterable<B>
```

Added in v1.0.0

## filterMapWithIndex

**Signature**

```ts
export declare const filterMapWithIndex: <A, B>(
  f: (i: number, a: A) => O.Option<B>
) => (fa: AsyncIterable<A>) => AsyncIterable<B>
```

Added in v1.0.0

## filterTask

**Signature**

```ts
export declare const filterTask: {
  <A>(predicate: PredicateTask<A>): <B extends A>(fb: AsyncIterable<B>) => AsyncIterable<B>
  <A>(predicate: PredicateTask<A>): (fa: AsyncIterable<A>) => AsyncIterable<A>
}
```

Added in v1.0.0

## filterTaskWithIndex

**Signature**

```ts
export declare const filterTaskWithIndex: {
  <A>(predicateWithIndex: PredicateTaskWithIndex<number, A>): <B extends A>(fb: AsyncIterable<B>) => AsyncIterable<B>
  <A>(predicateWithIndex: PredicateTaskWithIndex<number, A>): (fa: AsyncIterable<A>) => AsyncIterable<A>
}
```

Added in v1.0.0

## filterWithIndex

Same as [`filter`](#filter), but passing also the index to the iterating function.

**Signature**

```ts
export declare const filterWithIndex: {
  <A, B extends A>(refinementWithIndex: RefinementWithIndex<number, A, B>): (fa: AsyncIterable<A>) => AsyncIterable<B>
  <A>(predicateWithIndex: PredicateWithIndex<number, A>): <B extends A>(fb: AsyncIterable<A>) => AsyncIterable<B>
  <A>(predicateWithIndex: PredicateWithIndex<number, A>): (fa: AsyncIterable<A>) => AsyncIterable<A>
}
```

Added in v1.0.0

## lefts

**Signature**

```ts
export declare const lefts: <E, A>(fa: AsyncIterable<Either<E, A>>) => AsyncIterable<E>
```

Added in v1.0.0

## rights

**Signature**

```ts
export declare const rights: <E, A>(fa: AsyncIterable<Either<E, A>>) => AsyncIterable<A>
```

Added in v1.0.0

## uniq

Creates a new `AsyncIterable` removing duplicate elements, keeping the first occurrence of an element, based on a `Eq<A>`.

**Signature**

```ts
export declare const uniq: <A>(E: Eq<A>) => (fa: AsyncIterable<A>) => AsyncIterable<A>
```

Added in v1.0.0

# folding

## foldMapPar

**Signature**

```ts
export declare const foldMapPar: <M>(
  M: Monoid<M>,
  limit: number
) => <A>(f: (a: A) => M) => (fa: AsyncIterable<A>) => T.Task<M>
```

Added in v1.0.0

## foldMapSeq

**Signature**

```ts
export declare const foldMapSeq: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: AsyncIterable<A>) => T.Task<M>
```

Added in v1.0.0

## foldMapWithIndexPar

**Signature**

```ts
export declare const foldMapWithIndexPar: <M>(
  M: Monoid<M>,
  limit: number
) => <A>(f: (i: number, a: A) => M) => (fa: AsyncIterable<A>) => T.Task<M>
```

Added in v1.0.0

## toArrayLimited

preserves the order of elements coming from async iterator and corresponding results

**Signature**

```ts
export declare function toArrayLimited<A>(limit: number)
```

Added in v1.0.0

## toArrayPar

**Signature**

```ts
export declare function toArrayPar<A>(limit: number)
```

Added in v1.0.0

## toArraySeq

**Signature**

```ts
export declare function toArraySeq<A>()
```

Added in v1.0.0

## toIterableLimited

the order of results does not corresponds to order of async iterator elements

**Signature**

```ts
export declare function toIterableLimited<A>(limit: number)
```

Added in v1.0.0

## toIterablePar

**Signature**

```ts
export declare function toIterablePar<A>(limit: number)
```

Added in v1.0.0

## toIterableSeq

**Signature**

```ts
export declare function toIterableSeq<A>()
```

Added in v1.0.0

# instances

## Applicative

**Signature**

```ts
export declare const Applicative: Applicative1<'AsyncIterable'>
```

Added in v1.0.0

## Apply

**Signature**

```ts
export declare const Apply: Apply1<'AsyncIterable'>
```

Added in v1.0.0

## Chain

**Signature**

```ts
export declare const Chain: chainable.Chain1<'AsyncIterable'>
```

Added in v1.0.0

## FromIO

**Signature**

```ts
export declare const FromIO: FromIO1<'AsyncIterable'>
```

Added in v1.0.0

## FromTask

**Signature**

```ts
export declare const FromTask: FromTask1<'AsyncIterable'>
```

Added in v1.0.0

## Functor

**Signature**

```ts
export declare const Functor: Functor1<'AsyncIterable'>
```

Added in v1.0.0

## FunctorWithIndex

**Signature**

```ts
export declare const FunctorWithIndex: FunctorWithIndex1<'AsyncIterable', number>
```

Added in v1.0.0

## Monad

**Signature**

```ts
export declare const Monad: Monad1<'AsyncIterable'>
```

Added in v1.0.0

## MonadIO

**Signature**

```ts
export declare const MonadIO: MonadIO1<'AsyncIterable'>
```

Added in v1.0.0

## Pointed

**Signature**

```ts
export declare const Pointed: Pointed1<'AsyncIterable'>
```

Added in v1.0.0

## Unfoldable

**Signature**

```ts
export declare const Unfoldable: Unfoldable1<'AsyncIterable'>
```

Added in v1.0.0

# mapping

## as

Maps every value to the specified constant value.

**Signature**

```ts
export declare const as: {
  <A>(a: A): <_>(self: AsyncIterable<_>) => AsyncIterable<A>
  <_, A>(self: AsyncIterable<_>, a: A): AsyncIterable<A>
}
```

Added in v1.0.0

## asUnit

Maps every value to the void constant value.

**Signature**

```ts
export declare const asUnit: <_>(self: AsyncIterable<_>) => AsyncIterable<void>
```

Added in v1.0.0

## flap

**Signature**

```ts
export declare const flap: <A>(a: A) => <B>(fab: AsyncIterable<(a: A) => B>) => AsyncIterable<B>
```

Added in v1.0.0

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (fa: AsyncIterable<A>) => AsyncIterable<B>
```

Added in v1.0.0

## mapWithIndex

**Signature**

```ts
export declare const mapWithIndex: <A, B>(f: (index: number, a: A) => B) => (fa: AsyncIterable<A>) => AsyncIterable<B>
```

Added in v1.0.0

## transform

**Signature**

```ts
export declare function transform<A, B>(transform: (a: A) => Option<B>, flush?: () => B)
```

Added in v1.0.0

## transformTask

**Signature**

```ts
export declare function transformTask<A, B>(transform: (a: A) => Task<Option<B>>, flush?: () => Task<B>)
```

Added in v1.0.0

# sequencing

## flatMap

**Signature**

```ts
export declare const flatMap: <A, B>(f: (a: A) => AsyncIterable<B>) => (fa: AsyncIterable<A>) => AsyncIterable<B>
```

Added in v1.0.0

## flatMapIterable

**Signature**

```ts
export declare const flatMapIterable: <A, B>(f: (a: A) => Iterable<B>) => (fa: AsyncIterable<A>) => AsyncIterable<B>
```

Added in v1.0.0

## flatMapTask

**Signature**

```ts
export declare const flatMapTask: <A, B>(f: (a: A) => T.Task<B>) => (fa: AsyncIterable<A>) => AsyncIterable<B>
```

Added in v1.0.0

## flatMapTaskWithIndex

**Signature**

```ts
export declare const flatMapTaskWithIndex: <A, B>(
  f: (index: number, a: A) => T.Task<B>
) => (fa: AsyncIterable<A>) => AsyncIterable<B>
```

Added in v1.0.0

## flatten

**Signature**

```ts
export declare const flatten: <A>(mma: AsyncIterable<AsyncIterable<A>>) => AsyncIterable<A>
```

Added in v1.0.0

# type lambdas

## URI

**Signature**

```ts
export declare const URI: 'AsyncIterable'
```

Added in v1.0.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v1.0.0
