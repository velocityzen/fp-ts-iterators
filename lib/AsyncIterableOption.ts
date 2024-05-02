/**
 * ```ts
 * export interface AsyncIterableOption<A> extends AsyncIterable<Option<A>> {}
 * ```
 *
 * `AsyncIterableOption<A>` represents an asynchronous stream that yields and optional values of type `A`.
 * If you want to represent an asynchronous stream that never fails, please see `AsyncIterable`.
 *
 * @since 1.0.0
 */
import { Applicative1 } from "fp-ts/Applicative";
import {
  Apply1,
  apFirst as apFirst_,
  apS as apS_,
  apSecond as apSecond_,
} from "fp-ts/Apply";
import * as A from "fp-ts/Array";
import * as chainable from "fp-ts/Chain";
import { Compactable1, compact as compact_ } from "fp-ts/Compactable";
import { Either } from "fp-ts/Either";
import { filterMap as filterMap_, filter as filter_ } from "fp-ts/Filterable";
import { FromEither1 } from "fp-ts/FromEither";
import { FromIO1 } from "fp-ts/FromIO";
import { FromTask1 } from "fp-ts/FromTask";
import {
  Functor1,
  bindTo as bindTo_,
  flap as flap_,
  let as let_,
} from "fp-ts/Functor";
import { IO } from "fp-ts/IO";
import { Monad1 } from "fp-ts/Monad";
import { MonadIO1 } from "fp-ts/MonadIO";
import { MonadTask1 } from "fp-ts/MonadTask";
import * as O from "fp-ts/Option";
import { Option } from "fp-ts/Option";
import * as OT from "fp-ts/OptionT";
import { Pointed1 } from "fp-ts/Pointed";
import { Predicate } from "fp-ts/Predicate";
import { Refinement } from "fp-ts/Refinement";
import * as T from "fp-ts/Task";
import { Task } from "fp-ts/Task";
import { TaskEither } from "fp-ts/TaskEither";
import * as TO from "fp-ts/TaskOption";
import { LazyArg, flow, identity, pipe } from "fp-ts/function";
import * as AI from "./AsyncIterable";
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
 * @since 1.0.0
 */
export interface AsyncIterableOption<A> extends AsyncIterable<Option<A>> {}

/**
 * @category type lambdas
 * @since 1.0.0
 */
export const URI = "AsyncIterableOption";

/**
 * @category type lambdas
 * @since 1.0.0
 */
export type URI = typeof URI;

declare module "fp-ts/HKT" {
  interface URItoKind<A> {
    readonly [URI]: AsyncIterableOption<A>;
  }
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const some: <A>(a: A) => AsyncIterableOption<A> = OT.some(AI.Pointed);

/**
 * @category constructors
 * @since 1.0.0
 */
export const of: <A>(a: A) => AsyncIterableOption<A> = some;

/**
 * @category constructors
 * @since 1.0.0
 */
export const someTask: <A>(a: Task<A>) => AsyncIterableOption<A> = (a) => ({
  async *[Symbol.asyncIterator]() {
    yield await pipe(a, T.map(O.some))();
  },
});

/**
 * @category lifting
 * @since 1.0.0
 */
export const fromPredicate: {
  <A, B extends A>(
    refinement: Refinement<A, B>,
  ): (a: A) => AsyncIterableOption<B>;
  <A>(predicate: Predicate<A>): <B extends A>(b: B) => AsyncIterableOption<B>;
  <A>(predicate: Predicate<A>): (a: A) => AsyncIterableOption<A>;
} = OT.fromPredicate(AI.Pointed);

// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromOption: <A>(fa: Option<A>) => AsyncIterableOption<A> = AI.of;

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromEither: <A>(fa: Either<unknown, A>) => AsyncIterableOption<A> =
  OT.fromEither(AI.Pointed);

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromIO: <A>(fa: IO<A>) => AsyncIterableOption<A> = (fa) => ({
  async *[Symbol.asyncIterator]() {
    yield O.some(fa());
  },
});

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromTask: <A>(fa: Task<A>) => AsyncIterableOption<A> = someTask;

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromTaskEither: <A>(
  fa: TaskEither<unknown, A>,
) => AsyncIterableOption<A> = (fa) => ({
  async *[Symbol.asyncIterator]() {
    yield await pipe(fa, T.map(O.fromEither))();
  },
});

/**
 * @category pattern matching
 * @since 1.0.0
 */
export const match: <B, A>(
  onNone: () => B,
  onSome: (a: A) => B,
) => (ma: AsyncIterableOption<A>) => AsyncIterable<B> = OT.match(AI.Functor);

/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 1.0.0
 */
/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
export const matchW: <B, A, C>(
  onNone: () => B,
  onSome: (a: A) => C,
) => (ma: AsyncIterableOption<A>) => AsyncIterable<B | C> = match as any;

/**
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`Task`).
 *
 * @category pattern matching
 * @since 1.0.0
 */
export function matchE<A, B>(
  onNone: () => T.Task<B>,
  onSome: (a: A) => Task<B>,
) {
  return AI.flatMapTask<Option<A>, B>(O.match(onNone, onSome));
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
export const matchEW: <B, C, A>(
  onNone: () => Task<B>,
  onSome: (a: A) => Task<C>,
) => (fa: AsyncIterableOption<A>) => AsyncIterable<B | C> = matchE as any;

/**
 * @category error handling
 * @since 1.0.0
 */
export function getOrElse<A>(
  onNone: LazyArg<A>,
): (fa: AsyncIterableOption<A>) => AsyncIterable<A> {
  return AI.map(O.getOrElse(onNone));
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
export const getOrElseW: <B>(
  onNone: LazyArg<B>,
) => <A>(ma: AsyncIterableOption<A>) => AsyncIterable<A | B> = getOrElse as any;

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromNullable: <A>(a: A) => AsyncIterableOption<NonNullable<A>> =
  OT.fromNullable(AI.Pointed);

/**
 * @category interop
 * @since 1.0.0
 */
export function tryCatch<A>(fa: AsyncIterable<A>): AsyncIterableOption<A> {
  return {
    async *[Symbol.asyncIterator]() {
      try {
        for await (const a of fa) {
          yield O.some(a);
        }
      } catch (e) {
        yield O.none;
      }
    },
  };
}

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 1.0.0
 */
export const map: <A, B>(
  f: (a: A) => B,
) => (fa: AsyncIterableOption<A>) => AsyncIterableOption<B> = OT.map(
  AI.Functor,
);

/**
 * @since 1.0.0
 */
export const ap: <A>(
  fa: AsyncIterableOption<A>,
) => <B>(fab: AsyncIterableOption<(a: A) => B>) => AsyncIterableOption<B> =
  OT.ap(AI.Apply);

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMap: {
  <A, B>(
    f: (a: A) => AsyncIterableOption<B>,
  ): (ma: AsyncIterableOption<A>) => AsyncIterableOption<B>;
  <A, B>(
    ma: AsyncIterableOption<A>,
    f: (a: A) => AsyncIterableOption<B>,
  ): AsyncIterableOption<B>;
} = dual(2, OT.chain(AI.Monad));

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapTask =
  <A, B>(f: (a: A) => T.Task<B>) =>
  (fa: AsyncIterableOption<A>): AsyncIterableOption<B> => ({
    async *[Symbol.asyncIterator]() {
      for await (const a of fa) {
        yield await pipe(a, TO.fromOption, TO.flatMapTask(f))();
      }
    },
  });

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapTaskOption =
  <A, B>(f: (a: A) => TO.TaskOption<B>) =>
  (fa: AsyncIterableOption<A>): AsyncIterableOption<B> => ({
    async *[Symbol.asyncIterator]() {
      for await (const a of fa) {
        yield await pipe(a, TO.fromOption, TO.flatMap(f))();
      }
    },
  });

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatten: <A>(
  mma: AsyncIterableOption<AsyncIterableOption<A>>,
) => AsyncIterableOption<A> = flatMap(identity);

/**
 * @category filtering
 * @since 1.0.0
 */
export const compact: Compactable1<URI>["compact"] = compact_(
  AI.Functor,
  O.Compactable,
);

/**
 * @category filtering
 * @since 1.0.0
 */
export const filter: {
  <A, B extends A>(
    refinement: Refinement<A, B>,
  ): (fb: AsyncIterableOption<A>) => AsyncIterableOption<B>;
  <A>(
    predicate: Predicate<A>,
  ): <B extends A>(fb: AsyncIterableOption<B>) => AsyncIterableOption<B>;
  <A>(
    predicate: Predicate<A>,
  ): (fa: AsyncIterableOption<A>) => AsyncIterableOption<A>;
} = filter_(AI.Functor, O.Filterable);

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMap: <A, B>(
  f: (a: A) => Option<B>,
) => (fga: AsyncIterableOption<A>) => AsyncIterableOption<B> = filterMap_(
  AI.Functor,
  O.Filterable,
);

/**
 * @category instances
 * @since 1.0.0
 */
export const Pointed: Pointed1<URI> = { URI, of };

/**
 * @category instances
 * @since 1.0.0
 */
export const Functor: Functor1<URI> = {
  URI,
  map: (fa, f) => pipe(fa, map(f)),
};

/**
 * Maps the value to the specified constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const as: {
  <A>(a: A): <_>(self: AsyncIterableOption<_>) => AsyncIterableOption<A>;
  <_, A>(self: AsyncIterableOption<_>, a: A): AsyncIterableOption<A>;
} = dual(2, as_(Functor));

/**
 * Maps the `Some` value of this `TaskOption` to the void constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const asUnit: <_>(
  self: AsyncIterableOption<_>,
) => AsyncIterableOption<void> = asUnit_(Functor);

/**
 * @category mapping
 * @since 1.0.0
 */
export const flap = /*#__PURE__*/ flap_(Functor);

/**
 * @category instances
 * @since 1.0.0
 */
export const Apply: Apply1<URI> = {
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
export const Applicative: Applicative1<URI> = {
  ...Pointed,
  ...Apply,
};

/**
 * @category instances
 * @since 1.0.0
 */
export const Chain: chainable.Chain1<URI> = {
  ...Apply,
  chain: (fab, fa) => flatMap(fa)(fab),
};

/**
 * @category instances
 * @since 1.0.0
 */
export const FromEither: FromEither1<URI> = {
  URI,
  fromEither,
};

/**
 * @category instances
 * @since 1.0.0
 */
export const FromIO: FromIO1<URI> = {
  URI,
  fromIO,
};

/**
 * @category instances
 * @since 1.0.0
 */
export const FromTask: FromTask1<URI> = {
  URI,
  fromIO,
  fromTask,
};

/**
 * @category instances
 * @since 1.0.0
 */
export const Monad: Monad1<URI> = {
  ...Pointed,
  ...Chain,
};

/**
 * @category instances
 * @since 1.0.0
 */
export const MonadIO: MonadIO1<URI> = {
  ...Monad,
  fromIO,
};

/**
 * @category instances
 * @since 1.0.0
 */
export const MonadTask: MonadTask1<URI> = {
  ...MonadIO,
  fromTask,
};

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 1.0.0
 */
export const tap: {
  <A, _>(
    self: AsyncIterableOption<A>,
    f: (a: A) => AsyncIterableOption<_>,
  ): AsyncIterableOption<A>;
  <A, _>(
    f: (a: A) => AsyncIterableOption<_>,
  ): (self: AsyncIterableOption<A>) => AsyncIterableOption<A>;
} = /*#__PURE__*/ dual(2, tap_(Chain));

/**
 * @category combinators
 * @since 1.0.0
 */
export const tapTask: {
  <A, _>(
    f: (a: A) => Task<_>,
  ): (self: AsyncIterableOption<A>) => AsyncIterableOption<A>;
  <A, _>(
    self: AsyncIterableOption<A>,
    f: (a: A) => Task<_>,
  ): AsyncIterableOption<A>;
} = /*#__PURE__*/ dual(2, tapTask_(FromTask, Chain));

/**
 * @category combinators
 * @since 1.0.0
 */
export const tapIO: {
  <A, _>(
    f: (a: A) => IO<_>,
  ): (self: AsyncIterableOption<A>) => AsyncIterableOption<A>;
  <A, _>(
    self: AsyncIterableOption<A>,
    f: (a: A) => IO<_>,
  ): AsyncIterableOption<A>;
} = /*#__PURE__*/ dual(2, tapIO_(FromIO, Chain));

/**
 * @category combinators
 * @since 1.0.0
 */
export const tapEither: {
  <A, E, _>(
    f: (a: A) => Either<E, _>,
  ): (self: AsyncIterableOption<A>) => AsyncIterableOption<A>;
  <A, E, _>(
    self: AsyncIterableOption<A>,
    f: (a: A) => Either<E, _>,
  ): AsyncIterableOption<A>;
} = /*#__PURE__*/ dual(2, tapEither_(FromEither, Chain));

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 1.0.0
 */
export const Do: AsyncIterableOption<{}> = /*#__PURE__*/ of({});

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
export const apS = /*#__PURE__*/ apS_(Apply);

/**
 * returns compacted Iterable
 * the order of the results does not corresponds to the order of async iterator elements
 * @category folding
 * @since 1.0.0
 */
export function toIterableLimited<A>(limit: number) {
  return flow(toArrayLimited<A>(limit), T.map(I.fromReadonlyArray));
}

/**
 * @category folding
 * @since 1.0.0
 */
export function toIterablePar<A>(limit: number) {
  return toIterableLimited<A>(limit);
}

/**
 * @category folding
 * @since 1.0.0
 */
export function toIterableSeq<A>() {
  return toIterableLimited<A>(1);
}

/**
 *  returns compacted Array
 *  the order of the results does not corresponds to the order of async iterator elements
 *  if you need to keep the order use AsyncIterator version of this function
 *  @category folding
 *  @since 1.0.0
 */
export function toArrayLimited<A>(limit: number) {
  return reduceUntilWithIndexLimited<Option<A>, Array<A>>(
    limit,
    O.isSome,
    A.zero<A>(),
    (_, b, a) => {
      if (O.isNone(a)) {
        return b;
      }

      b.push(a.value);
      return b;
    },
  );
}

/**
 * @category folding
 * @since 1.0.0
 */
export function toArrayPar<A>(limit: number) {
  return toArrayLimited<A>(limit);
}

/**
 * @category folding
 * @since 1.0.0
 */
export function toArraySeq<A>() {
  return toArrayLimited<A>(1);
}
