---
title: Iterable.ts
nav_order: 8
parent: Modules
---

## Iterable overview

The Iterable module provides tools for working with Typescript's Iterable<T> type in a functional way.

In functional jargon, this module provides a monadic interface over Typescript's Iterable<T>.

This nodule does not implements fuctions that would lead to degrading perfomance of Iterable. Any Iterable can be easly converted to Array

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [apply](#apply)
  - [ap](#ap)
  - [apFirst](#apfirst)
  - [apSecond](#apsecond)
- [combinators](#combinators)
  - [tap](#tap)
  - [tapIO](#tapio)
- [constructors](#constructors)
  - [makeBy](#makeby)
  - [makeByWithIndex](#makebywithindex)
  - [of](#of)
  - [unfold](#unfold)
- [conversions](#conversions)
  - [fromIO](#fromio)
  - [fromReadonlyArray](#fromreadonlyarray)
  - [toArray](#toarray)
- [do notation](#do-notation)
  - [Do](#do)
  - [apS](#aps)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [let](#let)
- [filtering](#filtering)
  - [compact](#compact)
  - [filter](#filter)
  - [filterMap](#filtermap)
  - [filterMapWithIndex](#filtermapwithindex)
  - [filterWithIndex](#filterwithindex)
  - [lefts](#lefts)
  - [rights](#rights)
- [folding](#folding)
  - [foldMap](#foldmap)
  - [foldMapWithIndex](#foldmapwithindex)
  - [reduce](#reduce)
  - [reduceWithIndex](#reducewithindex)
- [instances](#instances)
  - [Applicative](#applicative)
  - [Apply](#apply)
  - [Chain](#chain)
  - [FromIO](#fromio)
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
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
  - [flatten](#flatten)
- [type lambdas](#type-lambdas)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
- [utils](#utils)
  - [uniq](#uniq)

---

# apply

## ap

**Signature**

```ts
export declare const ap: <A>(fa: Iterable<A>) => <B>(fab: Iterable<(a: A) => B>) => Iterable<B>
```

Added in v1.0.0

## apFirst

**Signature**

```ts
export declare const apFirst: <B>(second: Iterable<B>) => <A>(first: Iterable<A>) => Iterable<A>
```

Added in v1.0.0

## apSecond

**Signature**

```ts
export declare const apSecond: <B>(second: Iterable<B>) => <A>(first: Iterable<A>) => Iterable<B>
```

Added in v1.0.0

# combinators

## tap

Composes computations in sequence, using the return value of one computation to determine the next computation and
keeping only the result of the first.

**Signature**

```ts
export declare const tap: {
  <A, _>(self: Iterable<A>, f: (a: A) => Iterable<_>): Iterable<A>
  <A, _>(f: (a: A) => Iterable<_>): (self: Iterable<A>) => Iterable<A>
}
```

Added in v1.0.0

## tapIO

**Signature**

```ts
export declare const tapIO: {
  <A, _>(f: (a: A) => IO<_>): (self: Iterable<A>) => Iterable<A>
  <A, _>(self: Iterable<A>, f: (a: A) => IO<_>): Iterable<A>
}
```

Added in v1.0.0

# constructors

## makeBy

**Signature**

```ts
export declare const makeBy: <A>(f: () => O.Option<A>) => Iterable<A>
```

Added in v1.0.0

## makeByWithIndex

Return a `Iterable` with elements initialized with `f(i)`.
Iterable stops when f return O.none

**Signature**

```ts
export declare const makeByWithIndex: <A>(f: (i: number) => O.Option<A>) => Iterable<A>
```

Added in v1.0.0

## of

**Signature**

```ts
export declare const of: <A>(a: A) => Iterable<A>
```

Added in v1.0.0

## unfold

**Signature**

```ts
export declare const unfold: <A, B>(b: B, f: (b: B) => O.Option<readonly [A, B]>) => Iterable<A>
```

Added in v1.0.0

# conversions

## fromIO

**Signature**

```ts
export declare const fromIO: <A>(fa: IO<A>) => Iterable<A>
```

Added in v1.0.0

## fromReadonlyArray

**Signature**

```ts
export declare const fromReadonlyArray: NaturalTransformation11<'ReadonlyArray', 'Iterable'>
```

Added in v1.0.0
isn't it weird? all arrays are iterables

## toArray

**Signature**

```ts
export declare const toArray: <A>(fa: Iterable<A>) => A[]
```

Added in v1.0.0

# do notation

## Do

**Signature**

```ts
export declare const Do: Iterable<{}>
```

Added in v1.0.0

## apS

**Signature**

```ts
export declare const apS: <N, A, B>(
  name: Exclude<N, keyof A>,
  fb: Iterable<B>
) => (fa: Iterable<A>) => Iterable<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bind

**Signature**

```ts
export declare const bind: <N, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Iterable<B>
) => (ma: Iterable<A>) => Iterable<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bindTo

**Signature**

```ts
export declare const bindTo: <N>(name: N) => <A>(fa: Iterable<A>) => Iterable<{ readonly [K in N]: A }>
```

Added in v1.0.0

## let

**Signature**

```ts
export declare const let: <N, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (fa: Iterable<A>) => Iterable<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

# filtering

## compact

Compacts an Iterable of `Option`s discarding the `None` values and
keeping the `Some` values. It returns a new array containing the values of
the `Some` options.

**Signature**

```ts
export declare const compact: <A>(fa: Iterable<O.Option<A>>) => Iterable<A>
```

Added in v1.0.0

## filter

**Signature**

```ts
export declare const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: Iterable<A>) => Iterable<B>
  <A>(predicate: Predicate<A>): <B extends A>(fb: Iterable<B>) => Iterable<B>
  <A>(predicate: Predicate<A>): (fa: Iterable<A>) => Iterable<A>
}
```

Added in v1.0.0

## filterMap

**Signature**

```ts
export declare const filterMap: <A, B>(f: (a: A) => O.Option<B>) => (fa: Iterable<A>) => Iterable<B>
```

Added in v1.0.0

## filterMapWithIndex

**Signature**

```ts
export declare const filterMapWithIndex: <A, B>(f: (i: number, a: A) => O.Option<B>) => (fa: Iterable<A>) => Iterable<B>
```

Added in v1.0.0

## filterWithIndex

Same as [`filter`](#filter), but passing also the index to the iterating function.

**Signature**

```ts
export declare const filterWithIndex: {
  <A, B extends A>(refinementWithIndex: RefinementWithIndex<number, A, B>): (fa: Iterable<A>) => Iterable<B>
  <A>(predicateWithIndex: PredicateWithIndex<number, A>): <B extends A>(fb: Iterable<A>) => Iterable<B>
  <A>(predicateWithIndex: PredicateWithIndex<number, A>): (fa: Iterable<A>) => Iterable<A>
}
```

Added in v1.0.0

## lefts

**Signature**

```ts
export declare const lefts: <E, A>(ai: Iterable<Either<E, A>>) => Iterable<E>
```

Added in v1.0.0

## rights

**Signature**

```ts
export declare const rights: <E, A>(fa: Iterable<Either<E, A>>) => Iterable<A>
```

Added in v1.0.0

# folding

## foldMap

**Signature**

```ts
export declare const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: readonly A[]) => M
```

Added in v1.0.0

## foldMapWithIndex

**Signature**

```ts
export declare const foldMapWithIndex: <M>(M: Monoid<M>) => <A>(f: (i: number, a: A) => M) => (fa: Iterable<A>) => M
```

Added in v1.0.0

## reduce

**Signature**

```ts
export declare const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (fa: Iterable<A>) => B
```

Added in v1.0.0

## reduceWithIndex

**Signature**

```ts
export declare const reduceWithIndex: <A, B>(b: B, f: (i: number, b: B, a: A) => B) => (fa: Iterable<A>) => B
```

Added in v1.0.0

# instances

## Applicative

**Signature**

```ts
export declare const Applicative: Applicative1<'Iterable'>
```

Added in v1.0.0

## Apply

**Signature**

```ts
export declare const Apply: Apply1<'Iterable'>
```

Added in v1.0.0

## Chain

**Signature**

```ts
export declare const Chain: chainable.Chain1<'Iterable'>
```

Added in v1.0.0

## FromIO

**Signature**

```ts
export declare const FromIO: FromIO1<'Iterable'>
```

Added in v1.0.0

## Functor

**Signature**

```ts
export declare const Functor: Functor1<'Iterable'>
```

Added in v1.0.0

## FunctorWithIndex

**Signature**

```ts
export declare const FunctorWithIndex: FunctorWithIndex1<'Iterable', number>
```

Added in v1.0.0

## Monad

**Signature**

```ts
export declare const Monad: Monad1<'Iterable'>
```

Added in v1.0.0

## MonadIO

**Signature**

```ts
export declare const MonadIO: MonadIO1<'Iterable'>
```

Added in v1.0.0

## Pointed

**Signature**

```ts
export declare const Pointed: Pointed1<'Iterable'>
```

Added in v1.0.0

## Unfoldable

**Signature**

```ts
export declare const Unfoldable: Unfoldable1<'Iterable'>
```

Added in v1.0.0

# mapping

## as

Maps the value to the specified constant value.

**Signature**

```ts
export declare const as: {
  <A>(a: A): <_>(self: Iterable<_>) => Iterable<A>
  <_, A>(self: Iterable<_>, a: A): Iterable<A>
}
```

Added in v1.0.0

## asUnit

Maps the value to the void constant value.

**Signature**

```ts
export declare const asUnit: <_>(self: Iterable<_>) => Iterable<void>
```

Added in v1.0.0

## flap

**Signature**

```ts
export declare const flap: <A>(a: A) => <B>(fab: Iterable<(a: A) => B>) => Iterable<B>
```

Added in v1.0.0

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (fa: Iterable<A>) => Iterable<B>
```

Added in v1.0.0

## mapWithIndex

**Signature**

```ts
export declare const mapWithIndex: <A, B>(f: (index: number, a: A) => B) => (fa: Iterable<A>) => Iterable<B>
```

Added in v1.0.0

## transform

**Signature**

```ts
export declare function transform<A, B>(transform: (a: A) => Option<B>, flush?: () => B)
```

Added in v1.0.0

# sequencing

## flatMap

**Signature**

```ts
export declare const flatMap: <A, B>(f: (a: A) => Iterable<B>) => (fa: Iterable<A>) => Iterable<B>
```

Added in v1.0.0

## flatten

**Signature**

```ts
export declare const flatten: <A>(mma: Iterable<Iterable<A>>) => Iterable<A>
```

Added in v1.0.0

# type lambdas

## URI

**Signature**

```ts
export declare const URI: 'Iterable'
```

Added in v1.0.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v1.0.0

# utils

## uniq

Creates a new `Iterable` removing duplicate elements, keeping the first occurrence of an element,
based on a `Eq<A>`.

**Signature**

```ts
export declare const uniq: <A>(E: Eq<A>) => (fa: Iterable<A>) => Iterable<A>
```

Added in v1.0.0
