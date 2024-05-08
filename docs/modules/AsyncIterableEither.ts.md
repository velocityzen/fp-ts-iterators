---
title: AsyncIterableEither.ts
nav_order: 3
parent: Modules
---

## AsyncIterableEither overview

```ts
export interface AsyncIterableEither<E, A> extends AsyncIterable<Either<E, A>> {}
```

`AsyncIterableEither<E, A>` represents an asynchronous stream that yields either of type `A` or yields an
error of type `E`. If you want to represent an asynchronous stream that never fails, please see `AsyncIterable`.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [apply](#apply)
  - [ap](#ap)
  - [apFirst](#apfirst)
  - [apSecond](#apsecond)
- [combinators](#combinators)
  - [tap](#tap)
  - [tapEither](#tapeither)
  - [tapIO](#tapio)
  - [tapTask](#taptask)
- [constructors](#constructors)
  - [left](#left)
  - [leftAsyncIterable](#leftasynciterable)
  - [leftIO](#leftio)
  - [leftIterable](#leftiterable)
  - [leftTask](#lefttask)
  - [of](#of)
  - [right](#right)
  - [rightAsyncIterable](#rightasynciterable)
  - [rightIO](#rightio)
  - [rightIterable](#rightiterable)
  - [rightTask](#righttask)
- [conversions](#conversions)
  - [fromAsyncIterable](#fromasynciterable)
  - [fromAsyncIterableOption](#fromasynciterableoption)
  - [fromEither](#fromeither)
  - [fromIO](#fromio)
  - [fromIOEither](#fromioeither)
  - [fromIterable](#fromiterable)
  - [fromNullable](#fromnullable)
  - [fromOption](#fromoption)
  - [fromTask](#fromtask)
  - [fromTaskEither](#fromtaskeither)
  - [fromTaskOption](#fromtaskoption)
  - [toUnion](#tounion)
- [do notation](#do-notation)
  - [Do](#do)
  - [apS](#aps)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [let](#let)
- [error handling](#error-handling)
  - [getOrElse](#getorelse)
  - [getOrElseW](#getorelsew)
  - [mapBoth](#mapboth)
  - [mapError](#maperror)
  - [tapError](#taperror)
  - [tapErrorIO](#taperrorio)
  - [tapErrorTask](#taperrortask)
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
  - [tryCatchToError](#trycatchtoerror)
- [lifting](#lifting)
  - [fromEitherK](#fromeitherk)
  - [fromIOK](#fromiok)
  - [fromOptionK](#fromoptionk)
  - [fromPredicate](#frompredicate)
  - [fromTaskK](#fromtaskk)
- [mapping](#mapping)
  - [as](#as)
  - [asUnit](#asunit)
  - [flap](#flap)
  - [map](#map)
- [model](#model)
  - [AsyncIterableEither (interface)](#asynciterableeither-interface)
- [pattern matching](#pattern-matching)
  - [match](#match)
  - [matchE](#matche)
  - [matchEW](#matchew)
  - [matchW](#matchw)
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
  - [flatMapEither](#flatmapeither)
  - [flatMapOption](#flatmapoption)
  - [flatMapTask](#flatmaptask)
  - [flatMapTaskEither](#flatmaptaskeither)
  - [flatMapTaskOption](#flatmaptaskoption)
  - [flatten](#flatten)
  - [flattenW](#flattenw)
- [type lambdas](#type-lambdas)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
- [utils](#utils)
  - [apW](#apw)
  - [swap](#swap)

---

# apply

## ap

**Signature**

```ts
export declare const ap: <E, A>(
  fa: AsyncIterableEither<E, A>
) => <B>(fab: AsyncIterableEither<E, (a: A) => B>) => AsyncIterableEither<E, B>
```

Added in v1.0.0

## apFirst

**Signature**

```ts
export declare const apFirst: <E, B>(
  second: AsyncIterableEither<E, B>
) => <A>(first: AsyncIterableEither<E, A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## apSecond

**Signature**

```ts
export declare const apSecond: <E, B>(
  second: AsyncIterableEither<E, B>
) => <A>(first: AsyncIterableEither<E, A>) => AsyncIterableEither<E, B>
```

Added in v1.0.0

# combinators

## tap

Composes computations in sequence, using the return value of one computation to determine the next computation and
keeping only the result of the first.

**Signature**

```ts
export declare const tap: {
  <E1, A, E2, _>(self: AsyncIterableEither<E1, A>, f: (a: A) => AsyncIterableEither<E2, _>): AsyncIterableEither<
    E1 | E2,
    A
  >
  <A, E2, _>(f: (a: A) => AsyncIterableEither<E2, _>): <E1>(
    self: AsyncIterableEither<E1, A>
  ) => AsyncIterableEither<E2 | E1, A>
}
```

Added in v1.0.0

## tapEither

**Signature**

```ts
export declare const tapEither: {
  <A, E2, _>(f: (a: A) => E.Either<E2, _>): <E1>(self: AsyncIterableEither<E1, A>) => AsyncIterableEither<E2 | E1, A>
  <E1, A, E2, _>(self: AsyncIterableEither<E1, A>, f: (a: A) => E.Either<E2, _>): AsyncIterableEither<E1 | E2, A>
}
```

Added in v1.0.0

## tapIO

**Signature**

```ts
export declare const tapIO: {
  <A, _>(f: (a: A) => IO<_>): <E>(self: AsyncIterableEither<E, A>) => AsyncIterableEither<E, A>
  <E, A, _>(self: AsyncIterableEither<E, A>, f: (a: A) => IO<_>): AsyncIterableEither<E, A>
}
```

Added in v1.0.0

## tapTask

**Signature**

```ts
export declare const tapTask: {
  <A, _>(f: (a: A) => T.Task<_>): <E>(self: AsyncIterableEither<E, A>) => AsyncIterableEither<E, A>
  <E, A, _>(self: AsyncIterableEither<E, A>, f: (a: A) => T.Task<_>): AsyncIterableEither<E, A>
}
```

Added in v1.0.0

# constructors

## left

**Signature**

```ts
export declare const left: <E = never, A = never>(e: E) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## leftAsyncIterable

**Signature**

```ts
export declare const leftAsyncIterable: <E = never, A = never>(me: AsyncIterable<E>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## leftIO

**Signature**

```ts
export declare const leftIO: <E = never, A = never>(me: IO<E>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## leftIterable

**Signature**

```ts
export declare const leftIterable: <E = never, A = never>(ma: Iterable<E>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## leftTask

**Signature**

```ts
export declare const leftTask: <E = never, A = never>(me: T.Task<E>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## of

**Signature**

```ts
export declare const of: <E = never, A = never>(a: A) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## right

**Signature**

```ts
export declare const right: <E = never, A = never>(a: A) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## rightAsyncIterable

**Signature**

```ts
export declare const rightAsyncIterable: <E = never, A = never>(ma: AsyncIterable<A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## rightIO

**Signature**

```ts
export declare const rightIO: <E = never, A = never>(ma: IO<A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## rightIterable

**Signature**

```ts
export declare const rightIterable: <E = never, A = never>(ma: Iterable<A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## rightTask

**Signature**

```ts
export declare const rightTask: <E = never, A = never>(ma: T.Task<A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

# conversions

## fromAsyncIterable

**Signature**

```ts
export declare const fromAsyncIterable: <A, E = never>(fa: AsyncIterable<A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## fromAsyncIterableOption

**Signature**

```ts
export declare const fromAsyncIterableOption: <E>(
  onNone: LazyArg<E>
) => <A>(fa: AsyncIterableOption<A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## fromEither

**Signature**

```ts
export declare const fromEither: <E, A>(fa: E.Either<E, A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## fromIO

**Signature**

```ts
export declare const fromIO: <A, E = never>(fa: IO<A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## fromIOEither

**Signature**

```ts
export declare const fromIOEither: <E, A>(fa: IOEither<E, A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## fromIterable

**Signature**

```ts
export declare const fromIterable: <A, E = never>(fa: Iterable<A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## fromNullable

**Signature**

```ts
export declare const fromNullable: <E>(e: E) => <A>(a: A) => AsyncIterableEither<E, NonNullable<A>>
```

Added in v1.0.0

## fromOption

**Signature**

```ts
export declare const fromOption: <E>(onNone: LazyArg<E>) => <A>(fa: O.Option<A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## fromTask

**Signature**

```ts
export declare const fromTask: <E, A>(fa: T.Task<A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## fromTaskEither

**Signature**

```ts
export declare const fromTaskEither: <E, A>(fa: TE.TaskEither<E, A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## fromTaskOption

**Signature**

```ts
export declare const fromTaskOption: <E, A>(onNone: LazyArg<E>) => (fa: TO.TaskOption<A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## toUnion

**Signature**

```ts
export declare const toUnion: <E, A>(fa: AsyncIterableEither<E, A>) => AsyncIterable<E | A>
```

Added in v1.0.0

# do notation

## Do

**Signature**

```ts
export declare const Do: AsyncIterableEither<never, {}>
```

Added in v1.0.0

## apS

**Signature**

```ts
export declare const apS: <N, A, E, B>(
  name: Exclude<N, keyof A>,
  fb: AsyncIterableEither<E, B>
) => (
  fa: AsyncIterableEither<E, A>
) => AsyncIterableEither<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bind

**Signature**

```ts
export declare const bind: <N, A, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => AsyncIterableEither<E, B>
) => (
  ma: AsyncIterableEither<E, A>
) => AsyncIterableEither<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bindTo

**Signature**

```ts
export declare const bindTo: <N>(
  name: N
) => <E, A>(fa: AsyncIterableEither<E, A>) => AsyncIterableEither<E, { readonly [K in N]: A }>
```

Added in v1.0.0

## let

**Signature**

```ts
export declare const let: <N, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => <E>(
  fa: AsyncIterableEither<E, A>
) => AsyncIterableEither<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

# error handling

## getOrElse

**Signature**

```ts
export declare function getOrElse<E, A>(onLeft: (e: E) => A): (ma: AsyncIterableEither<E, A>) => AsyncIterable<A>
```

Added in v1.0.0

## getOrElseW

Less strict version of [`getOrElse`](#getorelse).

The `W` suffix (short for **W**idening) means that the handler return type will be merged.

**Signature**

```ts
export declare const getOrElseW: <E, B>(
  onLeft: (e: E) => B
) => <A>(ma: AsyncIterableEither<E, A>) => AsyncIterable<B | A>
```

Added in v1.0.0

## mapBoth

Returns a `AsyncIterableEither` whose failure and success channels have been mapped by the specified pair of functions, `f` and `g`.

**Signature**

```ts
export declare const mapBoth: {
  <E, G, A, B>(f: (e: E) => G, g: (a: A) => B): (self: AsyncIterableEither<E, A>) => AsyncIterableEither<G, B>
  <E, A, G, B>(self: AsyncIterableEither<E, A>, f: (e: E) => G, g: (a: A) => B): AsyncIterableEither<G, B>
}
```

Added in v1.0.0

## mapError

Returns a `AsyncIterableEither` with its error channel mapped using the specified function.

**Signature**

```ts
export declare const mapError: {
  <E, G>(f: (e: E) => G): <A>(self: AsyncIterableEither<E, A>) => AsyncIterableEither<G, A>
  <E, A, G>(self: AsyncIterableEither<E, A>, f: (e: E) => G): AsyncIterableEither<G, A>
}
```

Added in v1.0.0

## tapError

Returns an effect that effectfully "peeks" at the failure of this effect.

**Signature**

```ts
export declare const tapError: {
  <E1, E2, _>(onLeft: (e: E1) => AsyncIterableEither<E2, _>): <A>(
    self: AsyncIterableEither<E1, A>
  ) => AsyncIterableEither<E1 | E2, A>
  <E1, A, E2, _>(self: AsyncIterableEither<E1, A>, onLeft: (e: E1) => AsyncIterableEither<E2, _>): AsyncIterableEither<
    E1 | E2,
    A
  >
}
```

Added in v2.15.0

## tapErrorIO

**Signature**

```ts
export declare const tapErrorIO: <E, B>(
  onLeft: (e: E) => IO<B>
) => <A>(ma: AsyncIterableEither<E, A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## tapErrorTask

**Signature**

```ts
export declare const tapErrorTask: <E, B>(
  onLeft: (e: E) => T.Task<B>
) => <A>(ma: AsyncIterableEither<E, A>) => AsyncIterableEither<E, A>
```

Added in v1.0.0

# folding

## toArrayLimited

preserves the order of elements coming from async iterator and corresponding results

**Signature**

```ts
export declare function toArrayLimited<E, A>(limit: number)
```

Added in v1.0.0

## toArrayPar

**Signature**

```ts
export declare function toArrayPar<E, A>(limit: number)
```

Added in v1.0.0

## toArraySeq

**Signature**

```ts
export declare function toArraySeq<E, A>()
```

Added in v1.0.0

## toIterableLimited

the order of the results does not corresponds to the order of async iterator elements

**Signature**

```ts
export declare function toIterableLimited<E, A>(limit: number)
```

Added in v1.0.0

## toIterablePar

**Signature**

```ts
export declare function toIterablePar<E, A>(limit: number)
```

Added in v1.0.0

## toIterableSeq

**Signature**

```ts
export declare function toIterableSeq<E, A>()
```

Added in v1.0.0

# instances

## Applicative

**Signature**

```ts
export declare const Applicative: Applicative2<'AsyncIterableEither'>
```

Added in v1.0.0

## Apply

**Signature**

```ts
export declare const Apply: Apply2<'AsyncIterableEither'>
```

Added in v1.0.0

## Chain

**Signature**

```ts
export declare const Chain: chainable.Chain2<'AsyncIterableEither'>
```

Added in v1.0.0

## FromEither

**Signature**

```ts
export declare const FromEither: FromEither2<'AsyncIterableEither'>
```

Added in v1.0.0

## FromIO

**Signature**

```ts
export declare const FromIO: FromIO2<'AsyncIterableEither'>
```

Added in v1.0.0

## FromTask

**Signature**

```ts
export declare const FromTask: FromTask2<'AsyncIterableEither'>
```

Added in v1.0.0

## Functor

**Signature**

```ts
export declare const Functor: Functor2<'AsyncIterableEither'>
```

Added in v1.0.0

## Monad

/\*\*

**Signature**

```ts
export declare const Monad: Monad2<'AsyncIterableEither'>
```

Added in v1.0.0

## MonadIO

**Signature**

```ts
export declare const MonadIO: MonadIO2<'AsyncIterableEither'>
```

Added in v1.0.0

## MonadTask

**Signature**

```ts
export declare const MonadTask: MonadTask2<'AsyncIterableEither'>
```

Added in v1.0.0

## Pointed

**Signature**

```ts
export declare const Pointed: Pointed2<'AsyncIterableEither'>
```

Added in v1.0.0

# interop

## tryCatch

**Signature**

```ts
export declare function tryCatch<E, A>(onRejected: (cause: unknown) => E)
```

Added in v1.0.0

## tryCatchToError

**Signature**

```ts
export declare function tryCatchToError<A>()
```

Added in v1.0.0
alias for tryCatch(E.toError)

# lifting

## fromEitherK

**Signature**

```ts
export declare const fromEitherK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => E.Either<E, B>
) => (...a: A) => AsyncIterableEither<E, B>
```

Added in v1.0.0

## fromIOK

**Signature**

```ts
export declare const fromIOK: <A extends readonly unknown[], B>(
  f: (...a: A) => IO<B>
) => <E = never>(...a: A) => AsyncIterableEither<E, B>
```

Added in v1.0.0

## fromOptionK

**Signature**

```ts
export declare const fromOptionK: <E>(
  onNone: LazyArg<E>
) => <A extends readonly unknown[], B>(f: (...a: A) => O.Option<B>) => (...a: A) => AsyncIterableEither<E, B>
```

Added in v1.0.0

## fromPredicate

**Signature**

```ts
export declare const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => AsyncIterableEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <B extends A>(b: B) => AsyncIterableEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => AsyncIterableEither<E, A>
}
```

Added in v1.0.0

## fromTaskK

**Signature**

```ts
export declare const fromTaskK: <A extends readonly unknown[], B>(
  f: (...a: A) => T.Task<B>
) => <E = never>(...a: A) => AsyncIterableEither<E, B>
```

Added in v1.0.0

# mapping

## as

Maps the value to the specified constant value.

**Signature**

```ts
export declare const as: {
  <A>(a: A): <E, _>(self: AsyncIterableEither<E, _>) => AsyncIterableEither<E, A>
  <E, _, A>(self: AsyncIterableEither<E, _>, a: A): AsyncIterableEither<E, A>
}
```

Added in v1.0.0

## asUnit

Maps the value to the void constant value.

**Signature**

```ts
export declare const asUnit: <E, _>(self: AsyncIterableEither<E, _>) => AsyncIterableEither<E, void>
```

Added in v1.0.0

## flap

**Signature**

```ts
export declare const flap: <A>(a: A) => <E, B>(fab: AsyncIterableEither<E, (a: A) => B>) => AsyncIterableEither<E, B>
```

Added in v1.0.0

## map

`map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
use the type constructor `F` to represent some computational context.

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: AsyncIterableEither<E, A>) => AsyncIterableEither<E, B>
```

Added in v1.0.0

# model

## AsyncIterableEither (interface)

**Signature**

```ts
export interface AsyncIterableEither<E, A> extends AsyncIterable<Either<E, A>> {}
```

Added in v1.0.0

# pattern matching

## match

**Signature**

```ts
export declare const match: <E, B, A>(
  onLeft: (e: E) => B,
  onRight: (a: A) => B
) => (ma: AsyncIterableEither<E, A>) => AsyncIterable<B>
```

Added in v1.0.0

## matchE

The `E` suffix (short for **E**ffect) means that the handlers return an AsyncIterable.

**Signature**

```ts
export declare function matchE<E, A, B>(onLeft: (e: E) => T.Task<B>, onRight: (a: A) => T.Task<B>)
```

Added in v1.0.0

## matchEW

Less strict version of [`matchE`](#matche).

The `W` suffix (short for **W**idening) means that the handler return types will be merged.

**Signature**

```ts
export declare const matchEW: <E, B, A, C>(
  onLeft: (e: E) => T.Task<B>,
  onRight: (a: A) => T.Task<C>
) => (ma: AsyncIterableEither<E, A>) => AsyncIterable<B | C>
```

Added in v1.0.0

## matchW

Less strict version of [`match`](#match).

The `W` suffix (short for **W**idening) means that the handler return types will be merged.

**Signature**

```ts
export declare const matchW: <E, B, A, C>(
  onLeft: (e: E) => B,
  onRight: (a: A) => C
) => (ma: AsyncIterableEither<E, A>) => AsyncIterable<B | C>
```

Added in v1.0.0

# sequencing

## flatMap

**Signature**

```ts
export declare const flatMap: {
  <A, E2, B>(f: (a: A) => AsyncIterableEither<E2, B>): <E1>(
    ma: AsyncIterableEither<E1, A>
  ) => AsyncIterableEither<E2 | E1, B>
  <E1, A, E2, B>(ma: AsyncIterableEither<E1, A>, f: (a: A) => AsyncIterableEither<E2, B>): AsyncIterableEither<
    E1 | E2,
    B
  >
}
```

Added in v1.0.0

## flatMapEither

**Signature**

```ts
export declare const flatMapEither: <E1, E2, A, B>(
  f: (a: A) => E.Either<E2, B>
) => (fa: AsyncIterableEither<E1, A>) => AsyncIterableEither<E1 | E2, B>
```

Added in v1.0.0

## flatMapOption

**Signature**

```ts
export declare const flatMapOption: <E, A, B>(
  f: (a: A) => O.Option<B>,
  onNone: LazyArg<E>
) => (fa: AsyncIterableEither<E, A>) => AsyncIterableEither<E, B>
```

Added in v1.0.0

## flatMapTask

**Signature**

```ts
export declare const flatMapTask: <E, A, B>(
  f: (a: A) => T.Task<B>
) => (fa: AsyncIterableEither<E, A>) => AsyncIterableEither<E, B>
```

Added in v1.0.0

## flatMapTaskEither

**Signature**

```ts
export declare const flatMapTaskEither: <E1, E2, A, B>(
  f: (a: A) => TE.TaskEither<E2, B>
) => (fa: AsyncIterableEither<E1, A>) => AsyncIterableEither<E1 | E2, B>
```

Added in v1.0.0

## flatMapTaskOption

**Signature**

```ts
export declare const flatMapTaskOption: <E, A, B>(
  f: (a: A) => TO.TaskOption<B>,
  onNone: LazyArg<E>
) => (fa: AsyncIterableEither<E, A>) => AsyncIterableEither<E, B>
```

Added in v1.0.0

## flatten

**Signature**

```ts
export declare const flatten: <E, A>(
  mma: AsyncIterableEither<E, AsyncIterableEither<E, A>>
) => AsyncIterableEither<E, A>
```

Added in v1.0.0

## flattenW

Less strict version of [`flatten`](#flatten).

The `W` suffix (short for **W**idening) means that the error types will be merged.

**Signature**

```ts
export declare const flattenW: <E1, E2, A>(
  mma: AsyncIterableEither<E1, AsyncIterableEither<E2, A>>
) => AsyncIterableEither<E1 | E2, A>
```

Added in v1.0.0

# type lambdas

## URI

**Signature**

```ts
export declare const URI: 'AsyncIterableEither'
```

Added in v1.0.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v1.0.0

# utils

## apW

Less strict version of [`ap`](#ap).

The `W` suffix (short for **W**idening) means that the error types will be merged.

**Signature**

```ts
export declare const apW: <E2, A>(
  fa: AsyncIterableEither<E2, A>
) => <E1, B>(fab: AsyncIterableEither<E1, (a: A) => B>) => AsyncIterableEither<E2 | E1, B>
```

Added in v1.0.0

## swap

**Signature**

```ts
export declare const swap: <E, A>(ma: AsyncIterableEither<E, A>) => AsyncIterableEither<A, E>
```

Added in v1.0.0
