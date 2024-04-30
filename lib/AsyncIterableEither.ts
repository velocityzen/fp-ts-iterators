import { Applicative2 } from "fp-ts/Applicative";
import {
  Apply2,
  apFirst as apFirst_,
  apS as apS_,
  apSecond as apSecond_,
} from "fp-ts/Apply";
import * as A from "fp-ts/Array";
import * as chainable from "fp-ts/Chain";
import * as E from "fp-ts/Either";
import { Either } from "fp-ts/Either";
import * as ET from "fp-ts/EitherT";
import { FromEither2 } from "fp-ts/FromEither";
import { FromIO2 } from "fp-ts/FromIO";
import { FromTask2 } from "fp-ts/FromTask";
import {
  Functor2,
  bindTo as bindTo_,
  flap as flap_,
  let as let_,
} from "fp-ts/Functor";
import { IO } from "fp-ts/IO";
import { IOEither } from "fp-ts/IOEither";
import { Monad2 } from "fp-ts/Monad";
import { MonadIO2 } from "fp-ts/MonadIO";
import * as O from "fp-ts/Option";
import { Pointed2 } from "fp-ts/Pointed";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import * as TO from "fp-ts/TaskOption";
import { LazyArg, flow, identity, pipe } from "fp-ts/function";
import * as AI from "./AsyncIterable";
import { AsyncIterableOption } from "./AsyncIterableOption";
import { reduceUntilWithIndexLimited } from "./AsyncIterableReduce";
import * as I from "./Iterable";
import {
  asUnit as asUnit_,
  as as as_,
  dual,
  tapEither as tapEither_,
  tapIO as tapIO_,
  tapTask as tapTask_,
  tap as tap_,
} from "./internal";

/**
 * @category model
 */
export interface AsyncIterableEither<E, A>
  extends AsyncIterable<Either<E, A>> {}

/**
 * @category type lambdas
 */
export const URI = "AsyncIterableEither";

/**
 * @category type lambdas
 */
export type URI = typeof URI;

declare module "fp-ts/HKT" {
  interface URItoKind2<E, A> {
    readonly [URI]: AsyncIterableEither<E, A>;
  }
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 */
export const left: <E = never, A = never>(e: E) => AsyncIterableEither<E, A> =
  /*#__PURE__*/ ET.left(AI.Pointed);

/**
 * @category constructors
 */
export const right: <E = never, A = never>(a: A) => AsyncIterableEither<E, A> =
  /*#__PURE__*/ ET.right(AI.Pointed);

/**
 * @category constructors
 */
export const rightTask: <E = never, A = never>(
  ma: T.Task<A>,
) => AsyncIterableEither<E, A> = (ma) => ({
  async *[Symbol.asyncIterator]() {
    yield await pipe(ma, T.map(E.right))();
  },
});

/**
 * @category constructors
 */
export const leftTask: <E = never, A = never>(
  me: T.Task<E>,
) => AsyncIterableEither<E, A> = (ma) => ({
  async *[Symbol.asyncIterator]() {
    yield await pipe(ma, T.map(E.left))();
  },
});

/**
 * @category constructors
 */
export const of: <E = never, A = never>(a: A) => AsyncIterableEither<E, A> =
  right;

/**
 * @category constructors
 */
export const rightAsyncIterable: <E = never, A = never>(
  ma: AsyncIterable<A>,
) => AsyncIterableEither<E, A> = /*#__PURE__*/ ET.rightF(AI.Functor);

/**
 * @category constructors
 */
export const leftAsyncIterable: <E = never, A = never>(
  me: AsyncIterable<E>,
) => AsyncIterableEither<E, A> = /*#__PURE__*/ ET.leftF(AI.Functor);

/**
 * @category constructors
 */
export const rightIO: <E = never, A = never>(
  ma: IO<A>,
) => AsyncIterableEither<E, A> = /*#__PURE__*/ flow(
  AI.fromIO,
  rightAsyncIterable,
);

/**
 * @category constructors
 */
export const leftIO: <E = never, A = never>(
  me: IO<E>,
) => AsyncIterableEither<E, A> = /*#__PURE__*/ flow(
  AI.fromIO,
  leftAsyncIterable,
);

// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------

/**
 * @category conversions
 */
export const fromIO: <A, E = never>(fa: IO<A>) => AsyncIterableEither<E, A> =
  rightIO;

/**
 * @category conversions
 */
export const fromTask: <E, A>(fa: T.Task<A>) => AsyncIterableEither<E, A> =
  rightTask;

/**
 * @category conversions
 */
export const fromTaskEither: <E, A>(
  fa: TE.TaskEither<E, A>,
) => AsyncIterableEither<E, A> = (ma) => ({
  async *[Symbol.asyncIterator]() {
    yield await ma();
  },
});

/**
 * @category conversions
 */
export const fromAsyncIterable: <A, E = never>(
  fa: AsyncIterable<A>,
) => AsyncIterableEither<E, A> = rightAsyncIterable;

/**
 * @category conversions
 */
export const fromEither: <E, A>(fa: Either<E, A>) => AsyncIterableEither<E, A> =
  AI.of;

/**
 * @category conversions
 */
export const fromIOEither: <E, A>(
  fa: IOEither<E, A>,
) => AsyncIterableEither<E, A> = AI.fromIO;

/**
 * @category conversions
 */
export const fromAsyncIterableOption: <E>(
  onNone: LazyArg<E>,
) => <A>(fa: AsyncIterableOption<A>) => AsyncIterableEither<E, A> = (onNone) =>
  AI.map(E.fromOption(onNone));

/**
 * @category pattern matching
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
 */
/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
export const matchW: <E, B, A, C>(
  onLeft: (e: E) => B,
  onRight: (a: A) => C,
) => (ma: AsyncIterableEither<E, A>) => AsyncIterable<B | C> = match as any;

/**
 * The `E` suffix (short for **E**ffect) means that the handlers return an AsyncIterable.
 *
 * @category pattern matching
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
 */
/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
export const matchEW: <E, B, A, C>(
  onLeft: (e: E) => T.Task<B>,
  onRight: (a: A) => T.Task<C>,
) => (ma: AsyncIterableEither<E, A>) => AsyncIterable<B | C> = matchE as any;

/**
 * @category error handling
 */
export function getOrElse<E, A>(
  onLeft: (e: E) => A,
): (ma: AsyncIterableEither<E, A>) => AsyncIterable<A> {
  return AI.map(E.match(onLeft, identity));
}

/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 */
/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
export const getOrElseW: <E, B>(
  onLeft: (e: E) => B,
) => <A>(ma: AsyncIterableEither<E, A>) => AsyncIterable<A | B> =
  getOrElse as any;

/**
 * @category error handling
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
 * @category error handling
 * alias for tryCatch(E.toError)
 */
export function tryCatchToError<A>() {
  return tryCatch<Error, A>(E.toError);
}

/**
 * @category conversions
 */
export const toUnion: <E, A>(
  fa: AsyncIterableEither<E, A>,
) => AsyncIterable<E | A> = /*#__PURE__*/ ET.toUnion(AI.Functor);

/**
 * @category conversions
 */
export const fromNullable: <E>(
  e: E,
) => <A>(a: A) => AsyncIterableEither<E, NonNullable<A>> =
  /*#__PURE__*/ ET.fromNullable(AI.Pointed);

/**
 */
export const swap: <E, A>(
  ma: AsyncIterableEither<E, A>,
) => AsyncIterableEither<A, E> = /*#__PURE__*/ ET.swap(AI.Functor);

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 */
export const map: <A, B>(
  f: (a: A) => B,
) => <E>(fa: AsyncIterableEither<E, A>) => AsyncIterableEither<E, B> =
  /*#__PURE__*/ ET.map(AI.Functor);

/**
 * Returns a `AsyncIterableEither` whose failure and success channels have been mapped by the specified pair of functions, `f` and `g`.
 *
 * @category error handling
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
} = /*#__PURE__*/ dual(3, ET.bimap(AI.Functor));

/**
 * Returns a `AsyncIterableEither` with its error channel mapped using the specified function.
 *
 * @category error handling
 */
export const mapError: {
  <E, G>(
    f: (e: E) => G,
  ): <A>(self: AsyncIterableEither<E, A>) => AsyncIterableEither<G, A>;
  <E, A, G>(
    self: AsyncIterableEither<E, A>,
    f: (e: E) => G,
  ): AsyncIterableEither<G, A>;
} = /*#__PURE__*/ dual(2, ET.mapLeft(AI.Functor));

/**
 * @category apply
 */
export const ap: <E, A>(
  fa: AsyncIterableEither<E, A>,
) => <B>(
  fab: AsyncIterableEither<E, (a: A) => B>,
) => AsyncIterableEither<E, B> = /*#__PURE__*/ ET.ap(AI.Apply);

/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 */
/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
export const apW: <E2, A>(
  fa: AsyncIterableEither<E2, A>,
) => <E1, B>(
  fab: AsyncIterableEither<E1, (a: A) => B>,
) => AsyncIterableEither<E1 | E2, B> = ap as any;

/**
 * @category sequencing
 */
export const flatMap: {
  <A, E2, B>(
    f: (a: A) => AsyncIterableEither<E2, B>,
  ): <E1>(ma: AsyncIterableEither<E1, A>) => AsyncIterableEither<E1 | E2, B>;
  <E1, A, E2, B>(
    ma: AsyncIterableEither<E1, A>,
    f: (a: A) => AsyncIterableEither<E2, B>,
  ): AsyncIterableEither<E1 | E2, B>;
} = /*#__PURE__*/ dual(2, ET.chain(AI.Monad));

/**
 * @category sequencing
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
 */
export const Pointed: Pointed2<URI> = { URI, of };

/**
 * @category instances
 */
export const Functor: Functor2<URI> = {
  URI,
  map: (fa, f) => map(f)(fa),
};

/**
 * Maps the value to the specified constant value.
 *
 * @category mapping
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
 */
export const asUnit: <E, _>(
  self: AsyncIterableEither<E, _>,
) => AsyncIterableEither<E, void> = asUnit_(Functor);

/**
 * @category mapping
 */
export const flap = flap_(Functor);

/**
 * @category instances
 */
export const Apply: Apply2<URI> = {
  ...Functor,
  ap: (fab, fa) => ap(fa)(fab),
};

/**
 * @category apply
 */
export const apFirst = apFirst_(Apply);

/**
 * @category apply
 */
export const apSecond = apSecond_(Apply);

/**
 * @category instances
 */
export const Applicative: Applicative2<URI> = {
  ...Pointed,
  ...Apply,
};

/**
 * @category instances
 */
export const Chain: chainable.Chain2<URI> = {
  ...Apply,
  chain: (fab, fa) => flatMap(fa)(fab),
};

/**
 * @category instances
 */
export const Monad: Monad2<URI> = {
  ...Pointed,
  ...Chain,
};

/**
 * @category instances
 */
export const FromIO: FromIO2<URI> = {
  URI,
  fromIO,
};

/**
 * @category instances
 */
export const FromTask: FromTask2<URI> = {
  URI,
  fromIO,
  fromTask,
};

/**
 * @category instances
 */
export const FromEither: FromEither2<URI> = {
  URI,
  fromEither,
};

/**
 * @category instances
 */
export const MonadIO: MonadIO2<URI> = {
  ...Monad,
  fromIO,
};

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 */
export const tap: {
  <E1, A, E2, _>(
    self: AsyncIterableEither<E1, A>,
    f: (a: A) => AsyncIterableEither<E2, _>,
  ): AsyncIterableEither<E1 | E2, A>;
  <A, E2, _>(
    f: (a: A) => AsyncIterableEither<E2, _>,
  ): <E1>(self: AsyncIterableEither<E1, A>) => AsyncIterableEither<E2 | E1, A>;
} = /*#__PURE__*/ dual(2, tap_(Chain));

/**
 * @category combinators
 */
export const tapTask: {
  <A, _>(
    f: (a: A) => T.Task<_>,
  ): <E>(self: AsyncIterableEither<E, A>) => AsyncIterableEither<E, A>;
  <E, A, _>(
    self: AsyncIterableEither<E, A>,
    f: (a: A) => T.Task<_>,
  ): AsyncIterableEither<E, A>;
} = /*#__PURE__*/ dual(2, tapTask_(FromTask, Chain));

/**
 * @category combinators
 */
export const tapIO: {
  <A, _>(
    f: (a: A) => IO<_>,
  ): <E>(self: AsyncIterableEither<E, A>) => AsyncIterableEither<E, A>;
  <E, A, _>(
    self: AsyncIterableEither<E, A>,
    f: (a: A) => IO<_>,
  ): AsyncIterableEither<E, A>;
} = /*#__PURE__*/ dual(2, tapIO_(FromIO, Chain));

/**
 * @category combinators
 */
export const tapEither: {
  <A, E2, _>(
    f: (a: A) => Either<E2, _>,
  ): <E1>(self: AsyncIterableEither<E1, A>) => AsyncIterableEither<E2 | E1, A>;
  <E1, A, E2, _>(
    self: AsyncIterableEither<E1, A>,
    f: (a: A) => Either<E2, _>,
  ): AsyncIterableEither<E1 | E2, A>;
} = /*#__PURE__*/ dual(2, tapEither_(FromEither, Chain));

/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 */
export const flattenW: <E1, E2, A>(
  mma: AsyncIterableEither<E1, AsyncIterableEither<E2, A>>,
) => AsyncIterableEither<E1 | E2, A> = /*#__PURE__*/ flatMap(identity);

/**
 * @category sequencing
 */
export const flatten: <E, A>(
  mma: AsyncIterableEither<E, AsyncIterableEither<E, A>>,
) => AsyncIterableEither<E, A> = flattenW;

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 */
export const Do: AsyncIterableEither<never, {}> = /*#__PURE__*/ of({});

/**
 * @category do notation
 */
export const bind = chainable.bind(Chain);

/**
 * @category do notation
 */
export const bindTo = bindTo_(Functor);
const _let = let_(Functor);
export {
  /**
   * @category do notation
   */
  _let as let,
};

/**
 * @category do notation
 */
export const apS = /*#__PURE__*/ apS_(Apply);

/**
 * the order of the results does not corresponds to the order of async iterator elements
 * @category folding
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
 */
export function toIterablePar<E, A>(limit: number) {
  return toIterableLimited<E, A>(limit);
}

/**
 * @category folding
 */
export function toIterableSeq<E, A>() {
  return toIterableLimited<E, A>(1);
}

/**
 * preserves the order of elements coming from async iterator and corresponding results
 * @category folding
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
 */
export function toArrayPar<E, A>(limit: number) {
  return toArrayLimited<E, A>(limit);
}

/**
 * @category folding
 */
export function toArraySeq<E, A>() {
  return toArrayLimited<E, A>(1);
}
