---
title: AsyncIterableOption.ts
nav_order: 4
parent: Modules
---

## AsyncIterableOption overview

```ts
export interface AsyncIterableOption<A> extends AsyncIterable<Option<A>> {}
```

`AsyncIterableOption<A>` represents an asynchronous stream that yields and optional values of type `A`.
If you want to represent an asynchronous stream that never fails, please see `AsyncIterable`.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [apply](#apply)
  - [apFirst](#apfirst)
  - [apSecond](#apsecond)
- [combinators](#combinators)
  - [tap](#tap)
  - [tapEither](#tapeither)
  - [tapIO](#tapio)
  - [tapTask](#taptask)
- [constructors](#constructors)
  - [of](#of)
  - [some](#some)
  - [someTask](#sometask)
- [conversions](#conversions)
  - [fromEither](#fromeither)
  - [fromIO](#fromio)
  - [fromNullable](#fromnullable)
  - [fromOption](#fromoption)
  - [fromTask](#fromtask)
  - [fromTaskEither](#fromtaskeither)
- [do notation](#do-notation)
  - [Do](#do)
  - [apS](#aps)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [let](#let)
- [error handling](#error-handling)
  - [getOrElse](#getorelse)
  - [getOrElseW](#getorelsew)
- [filtering](#filtering)
  - [compact](#compact)
  - [filter](#filter)
  - [filterMap](#filtermap)
- [folding](#folding)
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
  - [FromEither](#fromeither)
  - [FromIO](#fromio)
  - [FromTask](#fromtask)
  - [Functor](#functor)
  - [Monad](#monad)
  - [MonadIO](#monadio)
  - [MonadTask](#monadtask)
  - [Pointed](#pointed)
- [interop](#interop)
  - [tryCatch](#trycatch)
- [lifting](#lifting)
  - [fromPredicate](#frompredicate)
- [mapping](#mapping)
  - [as](#as)
  - [asUnit](#asunit)
  - [flap](#flap)
  - [map](#map)
- [model](#model)
  - [AsyncIterableOption (interface)](#asynciterableoption-interface)
- [pattern matching](#pattern-matching)
  - [match](#match)
  - [matchE](#matche)
  - [matchEW](#matchew)
  - [matchW](#matchw)
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
  - [flatMapTask](#flatmaptask)
  - [flatMapTaskOption](#flatmaptaskoption)
  - [flatten](#flatten)
- [type lambdas](#type-lambdas)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
- [utils](#utils)
  - [ap](#ap)

---

# apply

## apFirst

**Signature**

```ts
export declare const apFirst: <B>(
  second: AsyncIterableOption<B>
) => <A>(first: AsyncIterableOption<A>) => AsyncIterableOption<A>
```

Added in v1.0.0

## apSecond

**Signature**

```ts
export declare const apSecond: <B>(
  second: AsyncIterableOption<B>
) => <A>(first: AsyncIterableOption<A>) => AsyncIterableOption<B>
```

Added in v1.0.0

# combinators

## tap

Composes computations in sequence, using the return value of one computation to determine the next computation and
keeping only the result of the first.

**Signature**

```ts
export declare const tap: {
  <A, _>(self: AsyncIterableOption<A>, f: (a: A) => AsyncIterableOption<_>): AsyncIterableOption<A>
  <A, _>(f: (a: A) => AsyncIterableOption<_>): (self: AsyncIterableOption<A>) => AsyncIterableOption<A>
}
```

Added in v1.0.0

## tapEither

**Signature**

```ts
export declare const tapEither: {
  <A, E, _>(f: (a: A) => Either<E, _>): (self: AsyncIterableOption<A>) => AsyncIterableOption<A>
  <A, E, _>(self: AsyncIterableOption<A>, f: (a: A) => Either<E, _>): AsyncIterableOption<A>
}
```

Added in v1.0.0

## tapIO

**Signature**

```ts
export declare const tapIO: {
  <A, _>(f: (a: A) => IO<_>): (self: AsyncIterableOption<A>) => AsyncIterableOption<A>
  <A, _>(self: AsyncIterableOption<A>, f: (a: A) => IO<_>): AsyncIterableOption<A>
}
```

Added in v1.0.0

## tapTask

**Signature**

```ts
export declare const tapTask: {
  <A, _>(f: (a: A) => T.Task<_>): (self: AsyncIterableOption<A>) => AsyncIterableOption<A>
  <A, _>(self: AsyncIterableOption<A>, f: (a: A) => T.Task<_>): AsyncIterableOption<A>
}
```

Added in v1.0.0

# constructors

## of

**Signature**

```ts
export declare const of: <A>(a: A) => AsyncIterableOption<A>
```

Added in v1.0.0

## some

**Signature**

```ts
export declare const some: <A>(a: A) => AsyncIterableOption<A>
```

Added in v1.0.0

## someTask

**Signature**

```ts
export declare const someTask: <A>(a: T.Task<A>) => AsyncIterableOption<A>
```

Added in v1.0.0

# conversions

## fromEither

**Signature**

```ts
export declare const fromEither: <A>(fa: Either<unknown, A>) => AsyncIterableOption<A>
```

Added in v1.0.0

## fromIO

**Signature**

```ts
export declare const fromIO: <A>(fa: IO<A>) => AsyncIterableOption<A>
```

Added in v1.0.0

## fromNullable

**Signature**

```ts
export declare const fromNullable: <A>(a: A) => AsyncIterableOption<NonNullable<A>>
```

Added in v1.0.0

## fromOption

**Signature**

```ts
export declare const fromOption: <A>(fa: O.Option<A>) => AsyncIterableOption<A>
```

Added in v1.0.0

## fromTask

**Signature**

```ts
export declare const fromTask: <A>(fa: T.Task<A>) => AsyncIterableOption<A>
```

Added in v1.0.0

## fromTaskEither

**Signature**

```ts
export declare const fromTaskEither: <A>(fa: TaskEither<unknown, A>) => AsyncIterableOption<A>
```

Added in v1.0.0

# do notation

## Do

**Signature**

```ts
export declare const Do: AsyncIterableOption<{}>
```

Added in v1.0.0

## apS

**Signature**

```ts
export declare const apS: <N, A, B>(
  name: Exclude<N, keyof A>,
  fb: AsyncIterableOption<B>
) => (fa: AsyncIterableOption<A>) => AsyncIterableOption<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bind

**Signature**

```ts
export declare const bind: <N, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => AsyncIterableOption<B>
) => (ma: AsyncIterableOption<A>) => AsyncIterableOption<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bindTo

**Signature**

```ts
export declare const bindTo: <N>(
  name: N
) => <A>(fa: AsyncIterableOption<A>) => AsyncIterableOption<{ readonly [K in N]: A }>
```

Added in v1.0.0

## let

**Signature**

```ts
export declare const let: <N, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (fa: AsyncIterableOption<A>) => AsyncIterableOption<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

# error handling

## getOrElse

**Signature**

```ts
export declare function getOrElse<A>(onNone: LazyArg<A>): (fa: AsyncIterableOption<A>) => AsyncIterable<A>
```

Added in v1.0.0

## getOrElseW

Less strict version of [`getOrElse`](#getorelse).

The `W` suffix (short for **W**idening) means that the handler return type will be merged.

**Signature**

```ts
export declare const getOrElseW: <B>(onNone: LazyArg<B>) => <A>(ma: AsyncIterableOption<A>) => AsyncIterable<B | A>
```

Added in v1.0.0

# filtering

## compact

**Signature**

```ts
export declare const compact: <A>(fa: AsyncIterableOption<O.Option<A>>) => AsyncIterableOption<A>
```

Added in v1.0.0

## filter

**Signature**

```ts
export declare const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (fb: AsyncIterableOption<A>) => AsyncIterableOption<B>
  <A>(predicate: Predicate<A>): <B extends A>(fb: AsyncIterableOption<B>) => AsyncIterableOption<B>
  <A>(predicate: Predicate<A>): (fa: AsyncIterableOption<A>) => AsyncIterableOption<A>
}
```

Added in v1.0.0

## filterMap

**Signature**

```ts
export declare const filterMap: <A, B>(
  f: (a: A) => O.Option<B>
) => (fga: AsyncIterableOption<A>) => AsyncIterableOption<B>
```

Added in v1.0.0

# folding

## toArrayLimited

returns compacted Array
the order of the results does not corresponds to the order of async iterator elements
if you need to keep the order use AsyncIterator version of this function

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

returns compacted Iterable
the order of the results does not corresponds to the order of async iterator elements

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
export declare const Applicative: Applicative1<'AsyncIterableOption'>
```

Added in v1.0.0

## Apply

**Signature**

```ts
export declare const Apply: Apply1<'AsyncIterableOption'>
```

Added in v1.0.0

## Chain

**Signature**

```ts
export declare const Chain: chainable.Chain1<'AsyncIterableOption'>
```

Added in v1.0.0

## FromEither

**Signature**

```ts
export declare const FromEither: FromEither1<'AsyncIterableOption'>
```

Added in v1.0.0

## FromIO

**Signature**

```ts
export declare const FromIO: FromIO1<'AsyncIterableOption'>
```

Added in v1.0.0

## FromTask

**Signature**

```ts
export declare const FromTask: FromTask1<'AsyncIterableOption'>
```

Added in v1.0.0

## Functor

**Signature**

```ts
export declare const Functor: Functor1<'AsyncIterableOption'>
```

Added in v1.0.0

## Monad

**Signature**

```ts
export declare const Monad: Monad1<'AsyncIterableOption'>
```

Added in v1.0.0

## MonadIO

**Signature**

```ts
export declare const MonadIO: MonadIO1<'AsyncIterableOption'>
```

Added in v1.0.0

## MonadTask

**Signature**

```ts
export declare const MonadTask: MonadTask1<'AsyncIterableOption'>
```

Added in v1.0.0

## Pointed

**Signature**

```ts
export declare const Pointed: Pointed1<'AsyncIterableOption'>
```

Added in v1.0.0

# interop

## tryCatch

**Signature**

```ts
export declare function tryCatch<A>(fa: AsyncIterable<A>): AsyncIterableOption<A>
```

Added in v1.0.0

# lifting

## fromPredicate

**Signature**

```ts
export declare const fromPredicate: {
  <A, B extends A>(refinement: Refinement<A, B>): (a: A) => AsyncIterableOption<B>
  <A>(predicate: Predicate<A>): <B extends A>(b: B) => AsyncIterableOption<B>
  <A>(predicate: Predicate<A>): (a: A) => AsyncIterableOption<A>
}
```

Added in v1.0.0

# mapping

## as

Maps the value to the specified constant value.

**Signature**

```ts
export declare const as: {
  <A>(a: A): <_>(self: AsyncIterableOption<_>) => AsyncIterableOption<A>
  <_, A>(self: AsyncIterableOption<_>, a: A): AsyncIterableOption<A>
}
```

Added in v1.0.0

## asUnit

Maps the `Some` value of this `TaskOption` to the void constant value.

**Signature**

```ts
export declare const asUnit: <_>(self: AsyncIterableOption<_>) => AsyncIterableOption<void>
```

Added in v1.0.0

## flap

**Signature**

```ts
export declare const flap: <A>(a: A) => <B>(fab: AsyncIterableOption<(a: A) => B>) => AsyncIterableOption<B>
```

Added in v1.0.0

## map

`map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
use the type constructor `F` to represent some computational context.

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (fa: AsyncIterableOption<A>) => AsyncIterableOption<B>
```

Added in v1.0.0

# model

## AsyncIterableOption (interface)

**Signature**

```ts
export interface AsyncIterableOption<A> extends AsyncIterable<Option<A>> {}
```

Added in v1.0.0

# pattern matching

## match

**Signature**

```ts
export declare const match: <B, A>(
  onNone: () => B,
  onSome: (a: A) => B
) => (ma: AsyncIterableOption<A>) => AsyncIterable<B>
```

Added in v1.0.0

## matchE

The `E` suffix (short for **E**ffect) means that the handlers return an effect (`Task`).

**Signature**

```ts
export declare function matchE<A, B>(onNone: () => T.Task<B>, onSome: (a: A) => Task<B>)
```

Added in v1.0.0

## matchEW

Less strict version of [`matchE`](#matche).

The `W` suffix (short for **W**idening) means that the handler return types will be merged.

**Signature**

```ts
export declare const matchEW: <B, C, A>(
  onNone: () => T.Task<B>,
  onSome: (a: A) => T.Task<C>
) => (fa: AsyncIterableOption<A>) => AsyncIterable<B | C>
```

Added in v1.0.0

## matchW

Less strict version of [`match`](#match).

The `W` suffix (short for **W**idening) means that the handler return types will be merged.

**Signature**

```ts
export declare const matchW: <B, A, C>(
  onNone: () => B,
  onSome: (a: A) => C
) => (ma: AsyncIterableOption<A>) => AsyncIterable<B | C>
```

Added in v1.0.0

# sequencing

## flatMap

**Signature**

```ts
export declare const flatMap: {
  <A, B>(f: (a: A) => AsyncIterableOption<B>): (ma: AsyncIterableOption<A>) => AsyncIterableOption<B>
  <A, B>(ma: AsyncIterableOption<A>, f: (a: A) => AsyncIterableOption<B>): AsyncIterableOption<B>
}
```

Added in v1.0.0

## flatMapTask

**Signature**

```ts
export declare const flatMapTask: <A, B>(
  f: (a: A) => T.Task<B>
) => (fa: AsyncIterableOption<A>) => AsyncIterableOption<B>
```

Added in v1.0.0

## flatMapTaskOption

**Signature**

```ts
export declare const flatMapTaskOption: <A, B>(
  f: (a: A) => TO.TaskOption<B>
) => (fa: AsyncIterableOption<A>) => AsyncIterableOption<B>
```

Added in v1.0.0

## flatten

**Signature**

```ts
export declare const flatten: <A>(mma: AsyncIterableOption<AsyncIterableOption<A>>) => AsyncIterableOption<A>
```

Added in v1.0.0

# type lambdas

## URI

**Signature**

```ts
export declare const URI: 'AsyncIterableOption'
```

Added in v1.0.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v1.0.0

# utils

## ap

**Signature**

```ts
export declare const ap: <A>(
  fa: AsyncIterableOption<A>
) => <B>(fab: AsyncIterableOption<(a: A) => B>) => AsyncIterableOption<B>
```

Added in v1.0.0
