/**
 * ```ts
 * export interface AsyncIterableEither<E, A> extends AsyncIterable<Either<E, A>> {}
 * ```
 *
 * `AsyncIterableEither<E, A>` represents an asynchronous stream that yields either of type `A` or yields an
 * error of type `E`. If you want to represent an asynchronous stream that never fails, please see `AsyncIterable`.
 *
 * @since 1.0.0
 */
import { Applicative2 } from "fp-ts/lib/Applicative";
import {
  Apply2,
  apFirst as apFirst_,
  apS as apS_,
  apSecond as apSecond_,
} from "fp-ts/lib/Apply";
import * as A from "fp-ts/lib/Array";
import * as chainable from "fp-ts/lib/Chain";
import * as E from "fp-ts/lib/Either";
import { Either } from "fp-ts/lib/Either";
import * as ET from "fp-ts/lib/EitherT";
import {
  PredicateWithIndex,
  RefinementWithIndex,
} from "fp-ts/lib/FilterableWithIndex";
import {
  FromEither2,
  fromEitherK as fromEitherK_,
  fromOptionK as fromOptionK_,
  fromOption as fromOption_,
  fromPredicate as fromPredicate_,
} from "fp-ts/lib/FromEither";
import { FromIO2, fromIOK as fromIOK_ } from "fp-ts/lib/FromIO";
import { FromTask2, fromTaskK as fromTaskK_ } from "fp-ts/lib/FromTask";
import {
  Functor2,
  bindTo as bindTo_,
  flap as flap_,
  let as let_,
} from "fp-ts/lib/Functor";
import { IO } from "fp-ts/lib/IO";
import { IOEither } from "fp-ts/lib/IOEither";
import { Monad2 } from "fp-ts/lib/Monad";
import { MonadIO2 } from "fp-ts/lib/MonadIO";
import { MonadThrow2 } from "fp-ts/lib/MonadThrow";
import * as O from "fp-ts/lib/Option";
import { Pointed2 } from "fp-ts/lib/Pointed";
import { Predicate } from "fp-ts/lib/Predicate";
import { Refinement } from "fp-ts/lib/Refinement";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import * as TO from "fp-ts/lib/TaskOption";
import { LazyArg, flow, identity, pipe } from "fp-ts/lib/function";
import { MonadTask2 } from "fp-ts/lib/MonadTask";
import * as AI from "./AsyncIterable";
import { AsyncIterableOption } from "./AsyncIterableOption";
import {
  getAsyncIteratorNextTask,
  reduceUntilWithIndexLimited,
} from "./AsyncIterableReduce";
import * as I from "./Iterable";
import {
  asUnit as asUnit_,
  as as as_,
  dual,
  tapIO as tapIO_,
  tapTask as tapTask_,
  tap as tap_,
} from "./internal";

import {
  flatMap as flatMap_,
  mapBoth as mapBoth_,
  mapError as mapError_,
  tapEither as tapEither_,
  tapError as tapError_,
} from "./internalEither";

/**
 * @category model
 * @since 1.0.0
 */
export interface AsyncIterableEither<E, A>
  extends AsyncIterable<Either<E, A>> {}

/**
 * @category type lambdas
 * @since 1.0.0
 */
export const URI = "AsyncIterableEither";

/**
 * @category type lambdas
 * @since 1.0.0
 */
export type URI = typeof URI;

declare module "fp-ts/lib/HKT" {
  interface URItoKind2<E, A> {
    readonly [URI]: AsyncIterableEither<E, A>;
  }
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 1.0.0
 */
export const left: <E = never, A = never>(e: E) => AsyncIterableEither<E, A> =
  ET.left(AI.Pointed);

/**
 * @category constructors
 * @since 1.0.0
 */
export const right: <E = never, A = never>(a: A) => AsyncIterableEither<E, A> =
  ET.right(AI.Pointed);

/**
 * @category constructors
 * @since 1.0.0
 */
export const rightIterable: <E = never, A = never>(
  ma: Iterable<A>,
) => AsyncIterableEither<E, A> = (ma) =>
  AI.fromIterable(pipe(ma, I.map(E.right)));

/**
 * @category constructors
 * @since 1.0.0
 */
export const leftIterable: <E = never, A = never>(
  ma: Iterable<E>,
) => AsyncIterableEither<E, A> = (ma) =>
  AI.fromIterable(pipe(ma, I.map(E.left)));

/**
 * @category constructors
 * @since 1.0.0
 */
export const rightTask: <E = never, A = never>(
  ma: T.Task<A>,
) => AsyncIterableEither<E, A> = (ma) => AI.fromTask(pipe(ma, T.map(E.right)));

/**
 * @category constructors
 * @since 1.0.0
 */
export const leftTask: <E = never, A = never>(
  me: T.Task<E>,
) => AsyncIterableEither<E, A> = (ma) => AI.fromTask(pipe(ma, T.map(E.left)));

/**
 * @category constructors
 * @since 1.0.0
 */
export const of: <E = never, A = never>(a: A) => AsyncIterableEither<E, A> =
  right;

/**
 * @category constructors
 * @since 1.0.0
 */
export const rightAsyncIterable: <E = never, A = never>(
  ma: AsyncIterable<A>,
) => AsyncIterableEither<E, A> = ET.rightF(AI.Functor);

/**
 * @category constructors
 * @since 1.0.0
 */
export const leftAsyncIterable: <E = never, A = never>(
  me: AsyncIterable<E>,
) => AsyncIterableEither<E, A> = ET.leftF(AI.Functor);

/**
 * @category constructors
 * @since 1.0.0
 */
export const rightIO: <E = never, A = never>(
  ma: IO<A>,
) => AsyncIterableEither<E, A> = flow(AI.fromIO, rightAsyncIterable);

/**
 * @category constructors
 * @since 1.0.0
 */
export const leftIO: <E = never, A = never>(
  me: IO<E>,
) => AsyncIterableEither<E, A> = flow(AI.fromIO, leftAsyncIterable);

// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromIO: <A, E = never>(fa: IO<A>) => AsyncIterableEither<E, A> =
  rightIO;

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromTask: <E, A>(fa: T.Task<A>) => AsyncIterableEither<E, A> =
  rightTask;

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromTaskEither: <E, A>(
  fa: TE.TaskEither<E, A>,
) => AsyncIterableEither<E, A> = AI.fromTask;

/**
 * @category lifting
 * @since 1.0.0
 */
export const fromTaskEitherK = <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => TE.TaskEither<E, B>,
): ((...a: A) => AsyncIterableEither<E, B>) => flow(f, fromTaskEither);

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromTaskOption =
  <E, A>(onNone: LazyArg<E>) =>
  (fa: TO.TaskOption<A>): AsyncIterableEither<E, A> =>
    AI.fromTask(pipe(fa, T.map(E.fromOption(onNone))));

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromIterable: <A, E = never>(
  fa: Iterable<A>,
) => AsyncIterableEither<E, A> = rightIterable;

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromAsyncIterable: <A, E = never>(
  fa: AsyncIterable<A>,
) => AsyncIterableEither<E, A> = rightAsyncIterable;

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromEither: <E, A>(fa: Either<E, A>) => AsyncIterableEither<E, A> =
  AI.of;

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromIOEither: <E, A>(
  fa: IOEither<E, A>,
) => AsyncIterableEither<E, A> = AI.fromIO;

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromAsyncIterableOption: <E>(
  onNone: LazyArg<E>,
) => <A>(fa: AsyncIterableOption<A>) => AsyncIterableEither<E, A> = (onNone) =>
  AI.map(E.fromOption(onNone));

/**
 * @category pattern matching
 * @since 1.0.0
 */
export const match: <E, B, A>(
  onLeft: (e: E) => B,
  onRight: (a: A) => B,
) => (ma: AsyncIterableEither<E, A>) => AsyncIterable<B> = ET.match(AI.Functor);

/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 1.0.0
 */
/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
export const matchW: <E, B, A, C>(
  onLeft: (e: E) => B,
  onRight: (a: A) => C,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
) => (ma: AsyncIterableEither<E, A>) => AsyncIterable<B | C> = match as any;

/**
 * The `E` suffix (short for **E**ffect) means that the handlers return an AsyncIterable.
 *
 * @category pattern matching
 * @since 1.0.0
 */
export function matchE<E, A, B>(
  onLeft: (e: E) => T.Task<B>,
  onRight: (a: A) => T.Task<B>,
) {
  return AI.flatMapTask<Either<E, A>, B>(E.match(onLeft, onRight));
}

/**
 * Less strict version of [`matchE`](#matche).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 1.0.0
 */
/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
export const matchEW: <E, B, A, C>(
  onLeft: (e: E) => T.Task<B>,
  onRight: (a: A) => T.Task<C>,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
) => (ma: AsyncIterableEither<E, A>) => AsyncIterable<B | C> = matchE as any;

/**
 * @category error handling
 * @since 1.0.0
 */
export function getOrElse<E, A>(
  onLeft: (e: E) => A,
): (ma: AsyncIterableEither<E, A>) => AsyncIterable<A> {
  return match(onLeft, identity);
  // return AI.map(E.match(onLeft, identity));
}

/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 1.0.0
 */
/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
export const getOrElseW: <E, B>(
  onLeft: (e: E) => B,
) => <A>(ma: AsyncIterableEither<E, A>) => AsyncIterable<A | B> =
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  getOrElse as any;

/**
 * @category interop
 * @since 1.0.0
 */
export function tryCatch<E, A>(onRejected: (cause: unknown) => E) {
  return (fa: AsyncIterable<A>): AsyncIterableEither<E, A> => ({
    async *[Symbol.asyncIterator]() {
      try {
        for await (const a of fa) {
          yield E.right(a);
        }
      } catch (e) {
        yield pipe(e, onRejected, E.left);
      }
    },
  });
}

/**
 * @category interop
 * @since 1.0.0
 * alias for tryCatch(E.toError)
 */
export function tryCatchToError<A>() {
  return tryCatch<Error, A>(E.toError);
}

/**
 * @category conversions
 * @since 1.0.0
 */
export const toUnion: <E, A>(
  fa: AsyncIterableEither<E, A>,
) => AsyncIterable<E | A> = ET.toUnion(AI.Functor);

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromNullable: <E>(
  e: E,
) => <A>(a: A) => AsyncIterableEither<E, NonNullable<A>> = ET.fromNullable(
  AI.Pointed,
);

/**
 * @since 1.0.0
 */
export const swap: <E, A>(
  ma: AsyncIterableEither<E, A>,
) => AsyncIterableEither<A, E> = ET.swap(AI.Functor);

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 1.0.0
 */
export const map: <A, B>(
  f: (a: A) => B,
) => <E>(fa: AsyncIterableEither<E, A>) => AsyncIterableEither<E, B> = ET.map(
  AI.Functor,
);

/**
 * Returns a `AsyncIterableEither` whose failure and success channels have been mapped by the specified pair of functions, `f` and `g`.
 *
 * @category error handling
 * @since 1.0.0
 */
export const mapBoth: {
  <E, G, A, B>(
    f: (e: E) => G,
    g: (a: A) => B,
  ): (self: AsyncIterableEither<E, A>) => AsyncIterableEither<G, B>;

  <E, A, G, B>(
    self: AsyncIterableEither<E, A>,
    f: (e: E) => G,
    g: (a: A) => B,
  ): AsyncIterableEither<G, B>;
} = dual(3, mapBoth_(AI.Functor));

/**
 * Returns a `AsyncIterableEither` with its error channel mapped using the specified function.
 *
 * @category error handling
 * @since 1.0.0
 */
export const mapError: {
  <E, G>(
    f: (e: E) => G,
  ): <A>(self: AsyncIterableEither<E, A>) => AsyncIterableEither<G, A>;
  <E, A, G>(
    self: AsyncIterableEither<E, A>,
    f: (e: E) => G,
  ): AsyncIterableEither<G, A>;
} = dual(2, mapError_(AI.Functor));

/**
 * @category apply
 * @since 1.0.0
 */
export const ap: <E, A>(
  fa: AsyncIterableEither<E, A>,
) => <B>(
  fab: AsyncIterableEither<E, (a: A) => B>,
) => AsyncIterableEither<E, B> = ET.ap(AI.Apply);

/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category apply
 * @since 1.0.0
 */
/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
export const apW: <E2, A>(
  fa: AsyncIterableEither<E2, A>,
) => <E1, B>(
  fab: AsyncIterableEither<E1, (a: A) => B>,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
) => AsyncIterableEither<E1 | E2, B> = ap as any;

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMap: {
  <A, E2, B>(
    f: (a: A) => AsyncIterableEither<E2, B>,
  ): <E1>(ma: AsyncIterableEither<E1, A>) => AsyncIterableEither<E1 | E2, B>;
  <E1, A, E2, B>(
    ma: AsyncIterableEither<E1, A>,
    f: (a: A) => AsyncIterableEither<E2, B>,
  ): AsyncIterableEither<E1 | E2, B>;
} = dual(2, flatMap_(AI.Monad));

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapIterable = <E, A, B>(f: (a: A) => Iterable<B>) => {
  const aief = (a: A): AsyncIterableEither<E, B> => pipe(a, f, fromIterable);
  return flatMap(aief);
};

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapEither =
  <E1, E2, A, B>(f: (a: A) => E.Either<E2, B>) =>
  (fa: AsyncIterableEither<E1, A>): AsyncIterableEither<E1 | E2, B> => ({
    async *[Symbol.asyncIterator]() {
      for await (const a of fa) {
        yield pipe(a, E.flatMap(f));
      }
    },
  });

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapOption =
  <E, A, B>(f: (a: A) => O.Option<B>, onNone: LazyArg<E>) =>
  (fa: AsyncIterableEither<E, A>): AsyncIterableEither<E, B> => ({
    async *[Symbol.asyncIterator]() {
      for await (const a of fa) {
        yield pipe(a, E.flatMapOption(f, onNone));
      }
    },
  });

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapTask =
  <E, A, B>(f: (a: A) => T.Task<B>) =>
  (fa: AsyncIterableEither<E, A>): AsyncIterableEither<E, B> => ({
    async *[Symbol.asyncIterator]() {
      for await (const a of fa) {
        yield await pipe(a, TE.fromEither, TE.flatMapTask(f))();
      }
    },
  });

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapTaskEither =
  <E1, E2, A, B>(f: (a: A) => TE.TaskEither<E2, B>) =>
  (fa: AsyncIterableEither<E1, A>): AsyncIterableEither<E1 | E2, B> => ({
    async *[Symbol.asyncIterator]() {
      for await (const a of fa) {
        yield await pipe(a, TE.fromEither, TE.flatMap(f))();
      }
    },
  });

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapTaskOption =
  <E, A, B>(f: (a: A) => TO.TaskOption<B>, onNone: LazyArg<E>) =>
  (fa: AsyncIterableEither<E, A>): AsyncIterableEither<E, B> => ({
    async *[Symbol.asyncIterator]() {
      for await (const a of fa) {
        yield await pipe(
          a,
          TO.fromEither,
          TO.flatMap(f),
          TE.fromTaskOption(onNone),
        )();
      }
    },
  });

/**
 * @category instances
 * @since 1.0.0
 */
export const Pointed: Pointed2<URI> = { URI, of };

/**
 * @category instances
 * @since 1.0.0
 */
export const Functor: Functor2<URI> = {
  URI,
  map: (fa, f) => map(f)(fa),
};

/**
 * Maps the value to the specified constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const as: {
  <A>(
    a: A,
  ): <E, _>(self: AsyncIterableEither<E, _>) => AsyncIterableEither<E, A>;
  <E, _, A>(self: AsyncIterableEither<E, _>, a: A): AsyncIterableEither<E, A>;
} = dual(2, as_(Functor));

/**
 * Maps the value to the void constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const asUnit: <E, _>(
  self: AsyncIterableEither<E, _>,
) => AsyncIterableEither<E, void> = asUnit_(Functor);

/**
 * @category mapping
 * @since 1.0.0
 */
export const flap = flap_(Functor);

/**
 * @category instances
 * @since 1.0.0
 */
export const Apply: Apply2<URI> = {
  ...Functor,
  ap: (fab, fa) => ap(fa)(fab),
};

/**
 * @category apply
 * @since 1.0.0
 */
export const apFirst = apFirst_(Apply);

/**
 * @category apply
 * @since 1.0.0
 */
export const apSecond = apSecond_(Apply);

/**
 * @category instances
 * @since 1.0.0
 */
export const Applicative: Applicative2<URI> = {
  ...Pointed,
  ...Apply,
};

/**
 * @category instances
 * @since 1.0.0
 */
export const Chain: chainable.Chain2<URI> = {
  ...Apply,
  chain: (fab, fa) => flatMap(fa)(fab),
};

/**
 * @category instances
 * @since 1.0.0
 */
export const FromIO: FromIO2<URI> = {
  URI,
  fromIO,
};

/**
 * @category lifting
 * @since 1.0.0
 */
export const fromIOK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IO<B>,
) => <E = never>(...a: A) => AsyncIterableEither<E, B> = fromIOK_(FromIO);

/**
 * @category instances
 * @since 1.0.0
 */
export const FromTask: FromTask2<URI> = {
  URI,
  fromIO,
  fromTask,
};

/**
 * @category lifting
 * @since 1.0.0
 */
export const fromTaskK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => T.Task<B>,
) => <E = never>(...a: A) => AsyncIterableEither<E, B> = fromTaskK_(FromTask);

/**
 * @category instances
 * @since 1.0.0
 */
export const FromEither: FromEither2<URI> = {
  URI,
  fromEither,
};

/**
 * @category lifting
 * @since 1.0.0
 */
export const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => E.Either<E, B>,
) => (...a: A) => AsyncIterableEither<E, B> = fromEitherK_(FromEither);

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromOption: <E>(
  onNone: LazyArg<E>,
) => <A>(fa: O.Option<A>) => AsyncIterableEither<E, A> =
  fromOption_(FromEither);

/**
 * @category lifting
 * @since 1.0.0
 */
export const fromOptionK: <E>(
  onNone: LazyArg<E>,
) => <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => O.Option<B>,
) => (...a: A) => AsyncIterableEither<E, B> = fromOptionK_(FromEither);

/**
 * @category lifting
 * @since 1.0.0
 */
export const fromPredicate: {
  <E, A, B extends A>(
    refinement: Refinement<A, B>,
    onFalse: (a: A) => E,
  ): (a: A) => AsyncIterableEither<E, B>;
  <E, A>(
    predicate: Predicate<A>,
    onFalse: (a: A) => E,
  ): <B extends A>(b: B) => AsyncIterableEither<E, B>;
  <E, A>(
    predicate: Predicate<A>,
    onFalse: (a: A) => E,
  ): (a: A) => AsyncIterableEither<E, A>;
} = fromPredicate_(FromEither);

/**

/**
 * @category instances
 * @since 1.0.0
 */
export const Monad: Monad2<URI> = {
  ...Pointed,
  ...Chain,
};

/**
 * @category instances
 * @since 1.0.0
 */
export const throwError: MonadThrow2<URI>["throwError"] = left;

/**
 * @category instances
 * @since 1.0.0
 */
export const MonadThrow: MonadThrow2<URI> = {
  ...Monad,
  throwError,
};

/**
 * @category instances
 * @since 1.0.0
 */
export const MonadIO: MonadIO2<URI> = {
  ...Monad,
  fromIO,
};

/**
 * @category instances
 * @since 1.0.0
 */
export const MonadTask: MonadTask2<URI> = {
  ...MonadIO,
  fromTask,
};

/**
 * Same as [`filter`](#filter), but passing also the index to the iterating function.
 *
 * @category filtering
 * @since 1.0.0
 */
export const filterWithIndex: {
  <E, A, B extends A>(
    refinementWithIndex: RefinementWithIndex<number, A, B>,
  ): (fa: AsyncIterableEither<E, A>) => AsyncIterableEither<E, B>;
  <E, A>(
    predicateWithIndex: PredicateWithIndex<number, A>,
  ): <B extends A>(fb: AsyncIterableEither<E, A>) => AsyncIterableEither<E, B>;
  <E, A>(
    predicateWithIndex: PredicateWithIndex<number, A>,
  ): (fa: AsyncIterableEither<E, A>) => AsyncIterableEither<E, A>;
} = <E, A>(predicateWithIndex: PredicateWithIndex<number, A>) =>
  AI.filterWithIndex((i, a: E.Either<E, A>) => {
    if (E.isLeft(a)) {
      return true;
    }

    return predicateWithIndex(i, a.right);
  });

/**
 * @category filtering
 * @since 1.0.0
 */
export const filter: {
  <E, A, B extends A>(
    refinement: Refinement<A, B>,
  ): (fa: AsyncIterableEither<E, A>) => AsyncIterableEither<E, B>;
  <E, A>(
    predicate: Predicate<A>,
  ): <B extends A>(fb: AsyncIterableEither<E, B>) => AsyncIterableEither<E, B>;
  <E, A>(
    predicate: Predicate<A>,
  ): (fa: AsyncIterableEither<E, A>) => AsyncIterableEither<E, A>;
} = <E, A>(predicate: Predicate<A>) =>
  filterWithIndex<E, A>((_, a) => predicate(a));

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterTaskWithIndex: {
  <E, A>(
    predicateWithIndex: AI.PredicateTaskWithIndex<number, A>,
  ): <B extends A>(fb: AsyncIterableEither<E, B>) => AsyncIterableEither<E, B>;
  <E, A>(
    predicateWithIndex: AI.PredicateTaskWithIndex<number, A>,
  ): (fa: AsyncIterableEither<E, A>) => AsyncIterableEither<E, A>;
  /* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters */
} = <E, A>(predicateWithIndex: AI.PredicateTaskWithIndex<number, A>) =>
  AI.filterTaskWithIndex<E.Either<E, A>>((i, a) => {
    if (E.isLeft(a)) {
      return T.of(true);
    }

    return predicateWithIndex(i, a.right);
  });

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterTask: {
  <E, A>(
    predicate: AI.PredicateTask<A>,
  ): <B extends A>(fb: AsyncIterableEither<E, B>) => AsyncIterableEither<E, B>;
  <E, A>(
    predicate: AI.PredicateTask<A>,
  ): (fa: AsyncIterableEither<E, A>) => AsyncIterableEither<E, A>;
} = <E, A>(predicate: AI.PredicateTask<A>) =>
  filterTaskWithIndex<E, A>((_, a) => predicate(a));

/**
 * @category filtering
 * @since 1.0.0
 */
export interface PredicateTaskEitherWithIndex<I, E, A> {
  (i: I, a: A): TE.TaskEither<E, boolean>;
}

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterTaskEitherWithIndex: {
  <E, A>(
    predicateWithIndex: PredicateTaskEitherWithIndex<number, E, A>,
  ): <B extends A>(fb: AsyncIterableEither<E, B>) => AsyncIterableEither<E, B>;
  <E, A>(
    predicateWithIndex: PredicateTaskEitherWithIndex<number, E, A>,
  ): (fa: AsyncIterableEither<E, A>) => AsyncIterableEither<E, A>;
} =
  <E, A>(predicateWithIndex: PredicateTaskEitherWithIndex<number, E, A>) =>
  (fa: AsyncIterableEither<E, A>) => {
    let i = 0;

    async function* next(): AsyncGenerator<E.Either<E, A>> {
      for await (const a of fa) {
        if (E.isLeft(a)) {
          yield a;
        } else {
          const predicateEither = await predicateWithIndex(i++, a.right)();
          if (E.isLeft(predicateEither)) {
            yield predicateEither;
          } else if (predicateEither.right) {
            yield a;
          } else {
            yield* next();
          }
        }
      }
    }

    return AI.fromAsyncGenerator(next);
  };

/**
 * @category filtering
 * @since 1.0.0
 */
export interface PredicateTaskEither<E, A> {
  (a: A): TE.TaskEither<E, boolean>;
}

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterTaskEither: {
  <E, A>(
    predicate: PredicateTaskEither<E, A>,
  ): <B extends A>(fb: AsyncIterableEither<E, B>) => AsyncIterableEither<E, B>;
  <E, A>(
    predicate: PredicateTaskEither<E, A>,
  ): (fa: AsyncIterableEither<E, A>) => AsyncIterable<A>;
} = <E, A>(predicate: PredicateTaskEither<E, A>) =>
  filterTaskEitherWithIndex<E, A>((_, a) => predicate(a));

/**
 * Same as [`filter`](#filter), but passing also the index to the iterating function.
 *
 * @category filtering
 * @since 1.0.0
 */
export const filterMapWithIndex =
  <E, A, B>(f: (i: number, a: A) => O.Option<B>) =>
  (fa: AsyncIterableEither<E, A>): AsyncIterableEither<E, B> => {
    let i = 0;

    async function* next(): AsyncGenerator<E.Either<E, B>> {
      for await (const a of fa) {
        if (E.isLeft(a)) {
          yield a;
        } else {
          const optionB = f(i++, a.right);
          if (O.isSome(optionB)) {
            yield E.right(optionB.value);
          } else {
            yield* next();
          }
        }
      }
    }

    return AI.fromAsyncGenerator(next);
  };

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMap = <E, A, B>(f: (a: A) => O.Option<B>) =>
  filterMapWithIndex<E, A, B>((_, a) => f(a));

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMapTaskWithIndex =
  <E, A, B>(f: (i: number, a: A) => T.Task<O.Option<B>>) =>
  (fa: AsyncIterableEither<E, A>): AsyncIterableEither<E, B> => {
    let i = 0;

    async function* next(): AsyncGenerator<E.Either<E, B>> {
      for await (const a of fa) {
        if (E.isLeft(a)) {
          yield a;
        } else {
          const optionB = await f(i++, a.right)();
          if (O.isSome(optionB)) {
            yield E.right(optionB.value);
          } else {
            yield* next();
          }
        }
      }
    }

    return AI.fromAsyncGenerator(next);
  };

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMapTask = <E, A, B>(f: (a: A) => T.Task<O.Option<B>>) =>
  filterMapTaskWithIndex<E, A, B>((_, a) => f(a));

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMapTaskEitherWithIndex =
  <E, A, B>(f: (i: number, a: A) => TE.TaskEither<E, O.Option<B>>) =>
  (fa: AsyncIterableEither<E, A>): AsyncIterableEither<E, B> => {
    let i = 0;

    async function* next(): AsyncGenerator<E.Either<E, B>> {
      for await (const a of fa) {
        if (E.isLeft(a)) {
          yield a;
        } else {
          const eitherOptionB = await f(i++, a.right)();

          if (E.isLeft(eitherOptionB)) {
            yield eitherOptionB;
          } else if (O.isSome(eitherOptionB.right)) {
            yield E.right(eitherOptionB.right.value);
          } else {
            yield* next();
          }
        }
      }
    }

    return AI.fromAsyncGenerator(next);
  };

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMapTaskEither = <E, A, B>(
  f: (a: A) => TE.TaskEither<E, O.Option<B>>,
) => filterMapTaskEitherWithIndex<E, A, B>((_, a) => f(a));

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 1.0.0
 */
export const tap: {
  <E1, A, E2, _>(
    self: AsyncIterableEither<E1, A>,
    f: (a: A) => AsyncIterableEither<E2, _>,
  ): AsyncIterableEither<E1 | E2, A>;
  <A, E2, _>(
    f: (a: A) => AsyncIterableEither<E2, _>,
  ): <E1>(self: AsyncIterableEither<E1, A>) => AsyncIterableEither<E2 | E1, A>;
} = dual(2, tap_(Chain));

/**
 * @category combinators
 * @since 1.0.0
 */
export const tapTask: {
  <A, _>(
    f: (a: A) => T.Task<_>,
  ): <E>(self: AsyncIterableEither<E, A>) => AsyncIterableEither<E, A>;
  <E, A, _>(
    self: AsyncIterableEither<E, A>,
    f: (a: A) => T.Task<_>,
  ): AsyncIterableEither<E, A>;
} = dual(2, tapTask_(FromTask, Chain));

/**
 * @category combinators
 * @since 1.0.0
 */
export const tapTaskEither: {
  <A, E2, _>(
    f: (a: A) => TE.TaskEither<E2, _>,
  ): <E1>(self: AsyncIterableEither<E1, A>) => AsyncIterableEither<E1 | E2, A>;
  <E1, A, E2, _>(
    self: AsyncIterableEither<E1, A>,
    f: (a: A) => TE.TaskEither<E2, _>,
  ): AsyncIterableEither<E1 | E2, A>;
} = /*#__PURE__*/ dual(
  2,
  <E1, A, E2, _>(
    self: AsyncIterableEither<E1, A>,
    f: (a: A) => TE.TaskEither<E2, _>,
  ): AsyncIterableEither<E1 | E2, A> => tap(self, fromTaskEitherK(f)),
);

/**
 * @category combinators
 * @since 1.0.0
 */
export const tapIO: {
  <A, _>(
    f: (a: A) => IO<_>,
  ): <E>(self: AsyncIterableEither<E, A>) => AsyncIterableEither<E, A>;
  <E, A, _>(
    self: AsyncIterableEither<E, A>,
    f: (a: A) => IO<_>,
  ): AsyncIterableEither<E, A>;
} = dual(2, tapIO_(FromIO, Chain));

/**
 * @category combinators
 * @since 1.0.0
 */
export const tapEither: {
  <A, E2, _>(
    f: (a: A) => Either<E2, _>,
  ): <E1>(self: AsyncIterableEither<E1, A>) => AsyncIterableEither<E2 | E1, A>;
  <E1, A, E2, _>(
    self: AsyncIterableEither<E1, A>,
    f: (a: A) => Either<E2, _>,
  ): AsyncIterableEither<E1 | E2, A>;
} = dual(2, tapEither_(FromEither, Chain));

/**
 * Returns an effect that effectfully "peeks" at the failure of this effect.
 *
 * @category error handling
 * @since 1.0.0
 */
export const tapError: {
  <E1, E2, _>(
    onLeft: (e: E1) => AsyncIterableEither<E2, _>,
  ): <A>(self: AsyncIterableEither<E1, A>) => AsyncIterableEither<E1 | E2, A>;
  <E1, A, E2, _>(
    self: AsyncIterableEither<E1, A>,
    onLeft: (e: E1) => AsyncIterableEither<E2, _>,
  ): AsyncIterableEither<E1 | E2, A>;
} = dual(2, tapError_(AI.Monad));

/**
 * @category error handling
 * @since 1.0.0
 */
export const tapErrorIO: <E, B>(
  onLeft: (e: E) => IO<B>,
) => <A>(ma: AsyncIterableEither<E, A>) => AsyncIterableEither<E, A> = (
  onLeft,
) => tapError(fromIOK(onLeft));

/**
 * @category error handling
 * @since 1.0.0
 */
export const tapErrorTask: <E, B>(
  onLeft: (e: E) => T.Task<B>,
) => <A>(ma: AsyncIterableEither<E, A>) => AsyncIterableEither<E, A> = (
  onLeft,
) => tapError(fromTaskK(onLeft));

/**
 * @category error handling
 * @since 1.0.0
 */
export const tapErrorTaskEither: <E1, E2, B>(
  onLeft: (e: E1) => TE.TaskEither<E2, B>,
) => <A>(ma: AsyncIterableEither<E1, A>) => AsyncIterableEither<E1 | E2, A> = (
  onLeft,
) => tapError(fromTaskEitherK(onLeft));

/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 1.0.0
 */
export const flattenW: <E1, E2, A>(
  mma: AsyncIterableEither<E1, AsyncIterableEither<E2, A>>,
) => AsyncIterableEither<E1 | E2, A> = flatMap(identity);

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatten: <E, A>(
  mma: AsyncIterableEither<E, AsyncIterableEither<E, A>>,
) => AsyncIterableEither<E, A> = flattenW;

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flattenIterable: <E, A>(
  mma: AsyncIterableEither<E, Iterable<A>>,
) => AsyncIterableEither<E, A> = flatMapIterable(identity);

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 1.0.0
 */
export const Do: AsyncIterableEither<never, {}> = of({});

/**
 * @category do notation
 * @since 1.0.0
 */
export const bind = chainable.bind(Chain);

/**
 * @category do notation
 * @since 1.0.0
 */
export const bindTo = bindTo_(Functor);
const _let = let_(Functor);
export {
  /**
   * @category do notation
   * @since 1.0.0
   */
  _let as let,
};

/**
 * @category do notation
 * @since 1.0.0
 */
export const apS = apS_(Apply);

/**
 * the order of the results does not corresponds to the order of async iterator elements
 * @category folding
 * @since 1.0.0
 */
export function toIterableLimited<E, A>(limit: number) {
  return flow(
    reduceUntilWithIndexLimited<Either<E, A>, Either<E, Array<A>>>(
      limit,
      E.isRight,
      E.right(A.zero<A>()),
      (_, b, a) => {
        if (E.isLeft(a)) {
          return a;
        }

        if (E.isLeft(b)) {
          return b;
        }

        b.right.push(a.right);
        return b;
      },
    ),
    TE.map(I.fromReadonlyArray),
  );
}

/**
 * @category folding
 * @since 1.0.0
 */
export function toIterablePar<E, A>(limit: number) {
  return toIterableLimited<E, A>(limit);
}

/**
 * @category folding
 * @since 1.0.0
 */
export function toIterableSeq<E, A>() {
  return toIterableLimited<E, A>(1);
}

/**
 * preserves the order of elements coming from async iterator and corresponding results
 * @category folding
 * @since 1.0.0
 */
export function toArrayLimited<E, A>(limit: number) {
  return reduceUntilWithIndexLimited<Either<E, A>, Either<E, Array<A>>>(
    limit,
    E.isRight,
    E.right(A.zero<A>()),
    (i, b, a) => {
      if (E.isLeft(a)) {
        return a;
      }

      if (E.isLeft(b)) {
        return b;
      }

      b.right[i] = a.right;
      return b;
    },
  );
}

/**
 * @category folding
 * @since 1.0.0
 */
export function toArrayPar<E, A>(limit: number) {
  return toArrayLimited<E, A>(limit);
}

/**
 * @category folding
 * @since 1.0.0
 */
export function toArraySeq<E, A>() {
  return toArrayLimited<E, A>(1);
}
