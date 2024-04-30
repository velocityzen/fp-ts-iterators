import { Applicative1 } from "fp-ts/Applicative";
import {
  Apply1,
  apFirst as apFirst_,
  apS as apS_,
  apSecond as apSecond_,
} from "fp-ts/Apply";
import * as A from "fp-ts/Array";
import * as chainable from "fp-ts/Chain";
import { Either } from "fp-ts/Either";
import { Eq } from "fp-ts/Eq";
import {
  PredicateWithIndex,
  RefinementWithIndex,
} from "fp-ts/FilterableWithIndex";
import { FromIO1 } from "fp-ts/FromIO";
import { FromTask1 } from "fp-ts/FromTask";
import {
  Functor1,
  bindTo as bindTo_,
  flap as flap_,
  let as let_,
} from "fp-ts/Functor";
import { FunctorWithIndex1 } from "fp-ts/FunctorWithIndex";
import { IO } from "fp-ts/IO";
import { Monad1 } from "fp-ts/Monad";
import { MonadIO1 } from "fp-ts/MonadIO";
import { Monoid } from "fp-ts/Monoid";
import * as O from "fp-ts/Option";
import { Option } from "fp-ts/Option";
import { Pointed1 } from "fp-ts/Pointed";
import { Predicate } from "fp-ts/Predicate";
import { Refinement } from "fp-ts/Refinement";
import * as T from "fp-ts/Task";
import { Task } from "fp-ts/Task";
import { Unfoldable1 } from "fp-ts/Unfoldable";
import { constTrue, flow, identity, pipe } from "fp-ts/function";
import { reduceUntilWithIndexLimited } from "./AsyncIterableReduce";
import * as I from "./Iterable";
import {
  asUnit as asUnit_,
  as as as_,
  dual,
  tapIO as tapIO_,
  tapTask as tapTask_,
  tap as tap_,
} from "./internal";

/**
 * @category type lambdas
 */
export const URI = "AsyncIterable";

/**
 * @category type lambdas
 */
export type URI = typeof URI;

declare module "fp-ts/HKT" {
  interface URItoKind<A> {
    readonly [URI]: AsyncIterable<A>;
  }
}

/**
 * Return a `AsyncIterable` with elements initialized with `f(i)`.
 * Iterable stops when f return O.none
 *
 * @category constructors
 */
export const makeByWithIndex = <A>(
  f: (i: number) => Option<A>,
): AsyncIterable<A> => {
  let i = 0;

  return {
    async *[Symbol.asyncIterator]() {
      const el = f(i++);
      if (O.isSome(el)) {
        yield el.value;
      }
    },
  };
};

/**
 * @category constructors
 */
export const makeBy = <A>(f: () => Option<A>): AsyncIterable<A> =>
  makeByWithIndex(() => f());

/**
 * @category constructors
 */
export const makeByTask = <A>(f: () => Task<Option<A>>): AsyncIterable<A> =>
  makeByTaskWithIndex(() => f());

/**
 * Return a `AsyncIterable` with elements initialized with `f(i)`.
 * Iterable stops when f return O.none
 *
 * @category constructors
 */
export const makeByTaskWithIndex = <A>(
  f: (i: number) => Task<Option<A>>,
): AsyncIterable<A> => {
  let i = 0;

  return {
    async *[Symbol.asyncIterator]() {
      const optionA = await f(i++)();
      if (O.isSome(optionA)) {
        yield optionA.value;
      }
    },
  };
};

/**
 * @category constructors
 */
export const unfold = <A, B>(
  b: B,
  f: (b: B) => Option<readonly [A, B]>,
): AsyncIterable<A> => {
  let bb: B = b;

  return {
    async *[Symbol.asyncIterator]() {
      const mt = f(bb);
      if (O.isSome(mt)) {
        const [a, b] = mt.value;
        bb = b;
        yield a;
      }
    },
  };
};

/**
 * @category constructors
 */
export const unfoldTask = <A, B>(
  b: B,
  f: (b: B) => Task<Option<readonly [A, B]>>,
): AsyncIterable<A> => {
  let bb: B = b;

  return {
    async *[Symbol.asyncIterator]() {
      const mt = await f(bb)();
      if (O.isSome(mt)) {
        const [a, b] = mt.value;
        bb = b;
        yield a;
      }
    },
  };
};

/**
 * @category conversions
 */
export const fromIterable: <A>(fa: Iterable<A>) => AsyncIterable<A> = (fa) => ({
  async *[Symbol.asyncIterator]() {
    for (const a of fa) {
      yield a;
    }
  },
});

/**
 * @category conversions
 */
export const fromIO: <A>(fa: IO<A>) => AsyncIterable<A> = (fa) => ({
  async *[Symbol.asyncIterator]() {
    yield fa();
  },
});

/**
 * @category conversions
 */
export const fromTask: <A>(fa: Task<A>) => AsyncIterable<A> = (fa) => ({
  async *[Symbol.asyncIterator]() {
    yield await fa();
  },
});

/**
 * @category constructors
 */
export const of: Pointed1<URI>["of"] = (a) => ({
  async *[Symbol.asyncIterator]() {
    yield a;
  },
});

/**
 * @category instances
 */
export const Pointed: Pointed1<URI> = { URI, of };

/**
 * @category mapping
 */
export const mapWithIndex =
  <A, B>(f: (index: number, a: A) => B) =>
  (fa: AsyncIterable<A>): AsyncIterable<B> => {
    let i = 0;
    return {
      async *[Symbol.asyncIterator]() {
        for await (const a of fa) {
          yield f(i++, a);
        }
      },
    };
  };

/**
 * @category mapping
 */
export const map = <A, B>(f: (a: A) => B) => mapWithIndex((_i, a: A) => f(a));

/**
 * @category instances
 */
export const Functor: Functor1<URI> = {
  URI,
  map: (fa, f) => map(f)(fa),
};

/**
 * @category instances
 */
export const FunctorWithIndex: FunctorWithIndex1<URI, number> = {
  ...Functor,
  mapWithIndex: (fa, f) => mapWithIndex(f)(fa),
};

/**
 * Maps the value to the specified constant value.
 *
 * @category mapping
 */
export const as: {
  <A>(a: A): <_>(self: AsyncIterable<_>) => AsyncIterable<A>;
  <_, A>(self: AsyncIterable<_>, a: A): AsyncIterable<A>;
} = dual(2, as_(Functor));

/**
 * Maps the value to the void constant value.
 *
 * @category mapping
 */
export const asUnit: <_>(self: AsyncIterable<_>) => AsyncIterable<void> =
  asUnit_(Functor);

/**
 * @category mapping
 */
export const flap = flap_(Functor);

/**
 * @category apply
 */
export const ap =
  <A>(fa: AsyncIterable<A>) =>
  <B>(fab: AsyncIterable<(a: A) => B>): AsyncIterable<B> => ({
    async *[Symbol.asyncIterator]() {
      for await (const ab of fab) {
        for await (const a of fa) {
          yield ab(a);
        }
      }
    },
  });

/**
 * @category apply
 */
export const apTask =
  <A>(fa: AsyncIterable<A>) =>
  <B>(fab: AsyncIterable<(a: A) => Task<B>>): AsyncIterable<B> => ({
    async *[Symbol.asyncIterator]() {
      for await (const ab of fab) {
        for await (const a of fa) {
          yield await ab(a)();
        }
      }
    },
  });

/**
 * @category instances
 */
export const Apply: Apply1<URI> = {
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
export const Applicative: Applicative1<URI> = {
  ...Pointed,
  ...Apply,
};

/**
 * @category sequencing
 */
export const flatMap =
  <A, B>(f: (a: A) => AsyncIterable<B>) =>
  (fa: AsyncIterable<A>): AsyncIterable<B> => ({
    async *[Symbol.asyncIterator]() {
      for await (const a1 of fa) {
        for await (const a2 of f(a1)) {
          yield a2;
        }
      }
    },
  });

/**
 * @category sequencing
 */
export const flatMapIterable =
  <A, B>(f: (a: A) => Iterable<B>) =>
  (fa: AsyncIterable<A>): AsyncIterable<B> => ({
    async *[Symbol.asyncIterator]() {
      for await (const a1 of fa) {
        for (const a2 of f(a1)) {
          yield a2;
        }
      }
    },
  });

/**
 * @category sequencing
 */
export const flatMapTaskWithIndex =
  <A, B>(f: (index: number, a: A) => Task<B>) =>
  (fa: AsyncIterable<A>): AsyncIterable<B> => {
    let i = 0;

    return {
      async *[Symbol.asyncIterator]() {
        for await (const a of fa) {
          yield await f(i++, a)();
        }
      },
    };
  };

/**
 * @category sequencing
 */
export const flatMapTask = <A, B>(f: (a: A) => Task<B>) =>
  flatMapTaskWithIndex((_i, a: A) => f(a));

/**
 * @category sequencing
 */
export const flatten: <A>(
  mma: AsyncIterable<AsyncIterable<A>>,
) => AsyncIterable<A> = /*#__PURE__*/ flatMap(identity);

/**
 * @category instances
 */
export const Chain: chainable.Chain1<URI> = {
  ...Apply,
  chain: (fab, fa) => flatMap(fa)(fab),
};

/**
 * @category instances
 */
export const Unfoldable: Unfoldable1<URI> = {
  URI,
  unfold,
};

/**
 * @category instances
 */
export const Monad: Monad1<URI> = {
  ...Pointed,
  ...Chain,
};

/**
 * @category instances
 */
export const FromIO: FromIO1<URI> = {
  URI,
  fromIO,
};

/**
 * @category instances
 */
export const FromTask: FromTask1<URI> = {
  URI,
  fromIO,
  fromTask,
};

/**
 * @category instances
 */
export const MonadIO: MonadIO1<URI> = {
  ...Monad,
  fromIO,
};

/**
 * Same as [`filter`](#filter), but passing also the index to the iterating function.
 *
 * @category filtering
 */
export const filterWithIndex: {
  <A, B extends A>(
    refinementWithIndex: RefinementWithIndex<number, A, B>,
  ): (fa: AsyncIterable<A>) => AsyncIterable<B>;
  <A>(
    predicateWithIndex: PredicateWithIndex<number, A>,
  ): <B extends A>(fb: AsyncIterable<A>) => AsyncIterable<B>;
  <A>(
    predicateWithIndex: PredicateWithIndex<number, A>,
  ): (fa: AsyncIterable<A>) => AsyncIterable<A>;
} =
  <A>(predicateWithIndex: PredicateWithIndex<number, A>) =>
  (fa: AsyncIterable<A>): AsyncIterable<A> => {
    let i = 0;

    return {
      async *[Symbol.asyncIterator]() {
        for await (const a of fa) {
          if (predicateWithIndex(i++, a)) {
            yield a;
          }
        }
      },
    };
  };

/**
 * @category filtering
 */
export const filter: {
  <A, B extends A>(
    refinement: Refinement<A, B>,
  ): (fa: AsyncIterable<A>) => AsyncIterable<B>;
  <A>(
    predicate: Predicate<A>,
  ): <B extends A>(fb: AsyncIterable<B>) => AsyncIterable<B>;
  <A>(predicate: Predicate<A>): (fa: AsyncIterable<A>) => AsyncIterable<A>;
} =
  <A>(predicate: Predicate<A>) =>
  (fa: AsyncIterable<A>) => ({
    async *[Symbol.asyncIterator]() {
      for await (const a of fa) {
        if (predicate(a)) {
          yield a;
        }
      }
    },
  });

/**
 * @category filtering
 */
export const filterMapWithIndex =
  <A, B>(f: (i: number, a: A) => Option<B>) =>
  (fa: AsyncIterable<A>): AsyncIterable<B> => {
    let i = 0;

    return {
      async *[Symbol.asyncIterator]() {
        for await (const a of fa) {
          const optionB = f(i++, a);
          if (O.isSome(optionB)) {
            yield optionB.value;
          }
        }
      },
    };
  };

/**
 * @category filtering
 */
export const filterMap = <A, B>(f: (a: A) => Option<B>) =>
  filterMapWithIndex<A, B>((_, a) => f(a));

/**
 * @category filtering
 */
export const filterMapTaskWithIndex =
  <A, B>(f: (i: number, a: A) => Task<Option<B>>) =>
  (fa: AsyncIterable<A>): AsyncIterable<B> => {
    let i = 0;

    return {
      async *[Symbol.asyncIterator]() {
        for await (const a of fa) {
          const optionB = await f(i++, a)();
          if (O.isSome(optionB)) {
            yield optionB.value;
          }
        }
      },
    };
  };

/**
 * @category filtering
 */
export const filterMapTask = <A, B>(f: (a: A) => Task<Option<B>>) =>
  filterMapTaskWithIndex<A, B>((_, a) => f(a));

/**
 * Compacts an AsyncIterable of `Option`s discarding the `None` values and
 * keeping the `Some` values. It returns a new array containing the values of
 * the `Some` options.
 * @category filtering
 */
export const compact: <A>(fa: AsyncIterable<Option<A>>) => AsyncIterable<A> =
  /*#__PURE__*/ filterMap(identity);

/**
 * @category filtering
 */
export const rights = <E, A>(
  fa: AsyncIterable<Either<E, A>>,
): AsyncIterable<A> => ({
  async *[Symbol.asyncIterator]() {
    for await (const a of fa) {
      if (a._tag === "Right") {
        yield a.right;
      }
    }
  },
});

/**
 * @category filtering
 */
export const lefts = <E, A>(
  ai: AsyncIterable<Either<E, A>>,
): AsyncIterable<E> => ({
  async *[Symbol.asyncIterator]() {
    for await (const a of ai) {
      if (a._tag === "Left") {
        yield a.left;
      }
    }
  },
});

/**
 * Creates a new `AsyncIterable` removing duplicate elements, keeping the first occurrence of an element,
 * based on a `Eq<A>`.
 */
export const uniq =
  <A>(E: Eq<A>) =>
  (fa: AsyncIterable<A>): AsyncIterable<A> => {
    const uniques: A[] = [];

    return {
      async *[Symbol.asyncIterator]() {
        for await (const a of fa) {
          if (uniques.every((o) => !E.equals(o, a))) {
            uniques.push(a);
            yield a;
          }
        }
      },
    };
  };

/**
 * @category mapping
 */
export function transform<A, B>(
  transform: (a: A) => Option<B>,
  flush?: () => B,
) {
  return (fa: AsyncIterable<A>): AsyncIterable<B> => ({
    async *[Symbol.asyncIterator]() {
      let isDone = true;
      for await (const a of fa) {
        isDone = false;
        const b = transform(a);
        if (O.isSome(b)) {
          yield b.value;
        }
      }

      if (isDone && flush) {
        yield flush();
      }
    },
  });
}

/**
 * @category mapping
 */
export function transformTask<A, B>(
  transform: (a: A) => Task<Option<B>>,
  flush?: () => Task<B>,
) {
  return (fa: AsyncIterable<A>): AsyncIterable<B> => ({
    async *[Symbol.asyncIterator]() {
      let isDone = true;
      for await (const a of fa) {
        isDone = false;
        const b = await transform(a)();
        if (O.isSome(b)) {
          yield b.value;
        }
      }

      if (isDone && flush) {
        yield await flush()();
      }
    },
  });
}

export interface PredicateTask<A> {
  (a: A): Task<boolean>;
}

/**
 * @category filtering
 */
export const filterTask: {
  <A>(
    predicate: PredicateTask<A>,
  ): <B extends A>(fb: AsyncIterable<B>) => AsyncIterable<B>;
  <A>(predicate: PredicateTask<A>): (fa: AsyncIterable<A>) => AsyncIterable<A>;
} =
  <A>(predicate: PredicateTask<A>) =>
  (fa: AsyncIterable<A>) => ({
    async *[Symbol.asyncIterator]() {
      for await (const a of fa) {
        if (await predicate(a)()) {
          yield a;
        }
      }
    },
  });

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 */
export const tap: {
  <A, _>(
    self: AsyncIterable<A>,
    f: (a: A) => AsyncIterable<_>,
  ): AsyncIterable<A>;
  <A, _>(
    f: (a: A) => AsyncIterable<_>,
  ): (self: AsyncIterable<A>) => AsyncIterable<A>;
} = /*#__PURE__*/ dual(2, tap_(Chain));

/**
 * @category combinators
 */
export const tapTask: {
  <A, _>(f: (a: A) => Task<_>): (self: AsyncIterable<A>) => AsyncIterable<A>;
  <A, _>(self: AsyncIterable<A>, f: (a: A) => Task<_>): AsyncIterable<A>;
} = /*#__PURE__*/ dual(2, tapTask_(FromTask, Chain));

/**
 * @category combinators
 */
export const tapIO: {
  <A, _>(f: (a: A) => IO<_>): (self: AsyncIterable<A>) => AsyncIterable<A>;
  <A, _>(self: AsyncIterable<A>, f: (a: A) => IO<_>): AsyncIterable<A>;
} = /*#__PURE__*/ dual(2, tapIO_(FromIO, Chain));

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 */
export const Do: AsyncIterable<{}> = /*#__PURE__*/ of({});

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
 * the order of results does not corresponds to order of async iterator elements
 * @category folding
 */
export function toIterableLimited<A>(limit: number) {
  return flow(
    reduceUntilWithIndexLimited<A, Array<A>>(
      limit,
      constTrue,
      A.zero<A>(),
      (_, b, a) => {
        b.push(a);
        return b;
      },
    ),
    T.map(I.fromReadonlyArray),
  );
}

/**
 * @category folding
 */
export function toIterablePar<A>(limit: number) {
  return toIterableLimited<A>(limit);
}

/**
 * @category folding
 */
export function toIterableSeq<A>() {
  return toIterableLimited<A>(1);
}

/**
 * preserves the order of elements coming from async iterator and corresponding results
 * @category folding
 */
export function toArrayLimited<A>(limit: number) {
  return reduceUntilWithIndexLimited<A, Array<A>>(
    limit,
    constTrue,
    A.zero<A>(),
    (i, b, a) => {
      b[i] = a;
      return b;
    },
  );
}

/**
 * @category folding
 */
export function toArrayPar<A>(limit: number) {
  return toArrayLimited<A>(limit);
}

/**
 * @category folding
 */
export function toArraySeq<A>() {
  return toArrayLimited<A>(1);
}

/**
 * @category folding
 */
export const foldMapWithIndexPar =
  <M>(M: Monoid<M>, limit: number) =>
  <A>(f: (i: number, a: A) => M) =>
  (fa: AsyncIterable<A>): Task<M> =>
    pipe(
      fa,
      reduceUntilWithIndexLimited(limit, constTrue, M.empty, (i, b, a) =>
        M.concat(b, f(i, a)),
      ),
    );

/**
 * @category folding
 */
export const foldMapPar: <M>(
  M: Monoid<M>,
  limit: number,
) => <A>(f: (a: A) => M) => (fa: AsyncIterable<A>) => Task<M> = (M, limit) => {
  const foldMapWithIndexM = foldMapWithIndexPar(M, limit);
  return (f) => foldMapWithIndexM((_, a) => f(a));
};

/**
 * @category folding
 */
export const foldMapSeq: <M>(
  M: Monoid<M>,
) => <A>(f: (a: A) => M) => (fa: AsyncIterable<A>) => Task<M> = (M) => {
  const foldMapWithIndexM = foldMapWithIndexPar(M, 1);
  return (f) => foldMapWithIndexM((_, a) => f(a));
};
