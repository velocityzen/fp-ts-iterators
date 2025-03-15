/**
 * The AsyncIterable module provides tools for working with AsyncIterable<T> type in a functional way.
 *
 * In functional jargon, this module provides a monadic interface over AsyncIterable<T>.
 *
 * @since 1.0.0
 */
import { Applicative1 } from "fp-ts/lib/Applicative";
import {
  Apply1,
  apFirst as apFirst_,
  apS as apS_,
  apSecond as apSecond_,
} from "fp-ts/lib/Apply";
import * as A from "fp-ts/lib/Array";
import * as chainable from "fp-ts/lib/Chain";
import { Either } from "fp-ts/lib/Either";
import { Eq } from "fp-ts/lib/Eq";
import {
  PredicateWithIndex,
  RefinementWithIndex,
} from "fp-ts/lib/FilterableWithIndex";
import { FromIO1 } from "fp-ts/lib/FromIO";
import { FromTask1 } from "fp-ts/lib/FromTask";
import {
  Functor1,
  bindTo as bindTo_,
  flap as flap_,
  let as let_,
} from "fp-ts/lib/Functor";
import { FunctorWithIndex1 } from "fp-ts/lib/FunctorWithIndex";
import { IO } from "fp-ts/lib/IO";
import { Monad1 } from "fp-ts/lib/Monad";
import { MonadIO1 } from "fp-ts/lib/MonadIO";
import { Monoid } from "fp-ts/lib/Monoid";
import * as O from "fp-ts/lib/Option";
import { Pointed1 } from "fp-ts/lib/Pointed";
import { Predicate } from "fp-ts/lib/Predicate";
import { Refinement } from "fp-ts/lib/Refinement";
import * as T from "fp-ts/lib/Task";
import * as TO from "fp-ts/lib/TaskOption";
import { Unfoldable1 } from "fp-ts/lib/Unfoldable";
import {
  LazyArg,
  constTrue,
  constant,
  flow,
  identity,
  pipe,
} from "fp-ts/lib/function";
import * as AG from "./AsyncGenerator";
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

/**
 * @category type lambdas
 * @since 1.0.0
 */
export const URI = "AsyncIterable";

/**
 * @category type lambdas
 * @since 1.0.0
 */
export type URI = typeof URI;

declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    readonly [URI]: AsyncIterable<A>;
  }
}

/**
 * Return a `AsyncIterable` with elements initialized with `f(i)`.
 *
 * Iterable stops when f return O.none
 *
 * @category constructors
 * @since 1.0.0
 */
export const makeByWithIndex = <A>(
  f: (i: number) => O.Option<A>,
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
 * @since 1.0.0
 */
export const makeBy = <A>(f: () => O.Option<A>): AsyncIterable<A> =>
  makeByWithIndex(() => f());

/**
 * Return a `AsyncIterable` with elements initialized with `f(i)`.
 *
 * Iterable stops when f return O.none
 *
 * @category constructors
 * @since 1.0.0
 */
export const makeByTaskWithIndex = <A>(
  f: (i: number) => T.Task<O.Option<A>>,
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
 * @since 1.0.0
 */
export const makeByTask = <A>(f: () => T.Task<O.Option<A>>): AsyncIterable<A> =>
  makeByTaskWithIndex(() => f());

/**
 * @category constructors
 * @since 1.0.0
 */
export const unfold = <A, B>(
  b: B,
  f: (b: B) => O.Option<readonly [A, B]>,
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
 * @since 1.0.0
 */
export const unfoldTask = <A, B>(
  b: B,
  f: (b: B) => T.Task<O.Option<readonly [A, B]>>,
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
 * @since 1.0.0
 */
export const fromIterable: <A>(fa: Iterable<A>) => AsyncIterable<A> = (fa) =>
  pipe(fa, AG.fromIterable, fromAsyncGenerator);

/**
 * @category conversions
 * @since 1.0.0
 */
export function fromAsyncGenerator<A>(
  fa: LazyArg<AsyncGenerator<A>>,
): AsyncIterable<A> {
  return {
    async *[Symbol.asyncIterator]() {
      yield* fa();
    },
  };
}

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromLazyArg: <A>(fa: LazyArg<A>) => AsyncIterable<A> =
  AG.fromLazyArg;

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromIO: <A>(fa: IO<A>) => AsyncIterable<A> = fromLazyArg;

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromTask: <A>(fa: T.Task<A>) => AsyncIterable<A> = AG.fromTask;

/**
 * @category constructors
 * @since 1.0.0
 */
export const of: Pointed1<URI>["of"] = (a) => fromLazyArg(constant(a));

/**
 * @category instances
 * @since 1.0.0
 */
export const Pointed: Pointed1<URI> = { URI, of };

/**
 * @category mapping
 * @since 1.0.0
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
 * @since 1.0.0
 */
export const map = <A, B>(f: (a: A) => B) => mapWithIndex((_i, a: A) => f(a));

/**
 * @category instances
 * @since 1.0.0
 */
export const Functor: Functor1<URI> = {
  URI,
  map: (fa, f) => map(f)(fa),
};

/**
 * @category instances
 * @since 1.0.0
 */
export const FunctorWithIndex: FunctorWithIndex1<URI, number> = {
  ...Functor,
  mapWithIndex: (fa, f) => mapWithIndex(f)(fa),
};

/**
 * Maps every value to the specified constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const as: {
  <A>(a: A): <_>(self: AsyncIterable<_>) => AsyncIterable<A>;
  <_, A>(self: AsyncIterable<_>, a: A): AsyncIterable<A>;
} = dual(2, as_(Functor));

/**
 * Maps every value to the void constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const asUnit: <_>(self: AsyncIterable<_>) => AsyncIterable<void> =
  asUnit_(Functor);

/**
 * @category mapping
 * @since 1.0.0
 */
export const flap = flap_(Functor);

/**
 * @category apply
 * @since 1.0.0
 */
export const ap =
  <A>(fa: AsyncIterable<A>) =>
  <B>(fab: AsyncIterable<(a: A) => B>): AsyncIterable<B> => {
    const fabTask = pipe(fab, toArraySeq());

    let fabPromise: undefined | ReturnType<typeof fabTask>;
    let fabs: undefined | Array<(a: A) => B>;
    let i = 0;
    let a: A;
    let justStarted = true;

    return {
      async *[Symbol.asyncIterator]() {
        if (!fabPromise) {
          fabPromise = fabTask();
        }

        if (!fabs) {
          fabs = await fabPromise;
        }

        if (i === fabs.length || justStarted) {
          i = 0;
          justStarted = false;
          for await (a of fa) {
            yield fabs[i++](a);
          }
        } else {
          yield fabs[i++](a);
        }
      },
    };
  };

/**
 * @category apply
 * @since 1.0.0
 */
export const apTask =
  <A>(fa: AsyncIterable<A>) =>
  <B>(fab: AsyncIterable<(a: A) => T.Task<B>>): AsyncIterable<B> => {
    const fabTask = pipe(fab, toArraySeq());

    let fabPromise: undefined | ReturnType<typeof fabTask>;
    let fabs: undefined | Array<(a: A) => T.Task<B>>;
    let i = 0;
    let a: A;
    let justStarted = true;

    return {
      async *[Symbol.asyncIterator]() {
        if (!fabPromise) {
          fabPromise = fabTask();
        }

        if (!fabs) {
          fabs = await fabPromise;
        }

        if (i === fabs.length || justStarted) {
          justStarted = false;
          i = 0;
          for await (a of fa) {
            yield await fabs[i++](a)();
          }
        } else {
          yield await fabs[i++](a)();
        }
      },
    };
  };

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
 * @category sequencing
 * @since 1.0.0
 */
export const flatMap =
  <A, B>(f: (a: A) => AsyncIterable<B>) =>
  (fa: AsyncIterable<A>): AsyncIterable<B> => {
    const buffer: B[] = [];
    const toBufferQueue: T.Task<O.Option<B>>[] = [];
    const fromBufferQueue: ((b: O.Option<B>) => void)[] = [];

    const nextAIFB = pipe(fa, getAsyncIteratorNextTask, TO.map(f));
    let isNextAIFBDone = false;
    let waitingForValues = 0;

    async function toBuffer() {
      if (!isNextAIFBDone && toBufferQueue.length === 0) {
        const maybeAIB = await nextAIFB();

        if (O.isSome(maybeAIB)) {
          const nextAIB = getAsyncIteratorNextTask(maybeAIB.value);
          toBufferQueue.push(nextAIB);
        } else {
          isNextAIFBDone = true;
        }
      }

      if (toBufferQueue.length === 0) {
        return;
      }

      const nextAIB = toBufferQueue[0];
      waitingForValues++;
      const maybeB = await nextAIB();
      waitingForValues--;
      if (O.isSome(maybeB)) {
        buffer.push(maybeB.value);
      } else {
        const i = toBufferQueue.findIndex((aib) => aib === nextAIB);
        if (i !== -1) {
          toBufferQueue.splice(i, 1);
        }

        if (
          !isNextAIFBDone ||
          (buffer.length === 0 && toBufferQueue.length > 0)
        ) {
          await toBuffer();
        }
      }

      dispatchFromBuffer();
    }

    function dispatchFromBuffer() {
      if (buffer.length > 0) {
        const fromTasks = fromBufferQueue.splice(0, buffer.length);
        const values = buffer.splice(0, fromTasks.length);

        pipe(
          fromTasks,
          A.zip(values),
          A.map(([task, value]) => {
            task(O.some(value));
          }),
        );
      }

      if (
        waitingForValues > 0 ||
        toBufferQueue.length > 0 ||
        buffer.length > 0
      ) {
        return;
      }

      const hopeless = fromBufferQueue.splice(0);
      hopeless.forEach((task) => {
        task(O.none);
      });
    }

    function addToFromBufferQueue() {
      return new Promise<O.Option<B>>((resolve) =>
        fromBufferQueue.push(resolve),
      );
    }

    async function next(): Promise<O.Option<B>> {
      if (buffer.length > 0) {
        return O.some(buffer.shift() as B);
      }

      const fromBuffer = addToFromBufferQueue();
      await toBuffer();
      return fromBuffer;
    }

    return {
      async *[Symbol.asyncIterator]() {
        const o = await next();
        if (O.isSome(o)) {
          yield o.value;
        }
      },
    };
  };

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapIterable = <A, B>(f: (a: A) => Iterable<B>) => {
  const aif = (a: A): AsyncIterable<B> => pipe(a, f, fromIterable);
  return flatMap(aif);
};

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapTaskWithIndex =
  <A, B>(f: (index: number, a: A) => T.Task<B>) =>
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
 * @since 1.0.0
 */
export const flatMapTask = <A, B>(f: (a: A) => T.Task<B>) =>
  flatMapTaskWithIndex((_i, a: A) => f(a));

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatten: <A>(
  mma: AsyncIterable<AsyncIterable<A>>,
) => AsyncIterable<A> = /*#__PURE__*/ flatMap(identity);

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flattenIterable: <A>(
  mma: AsyncIterable<Iterable<A>>,
) => AsyncIterable<A> = /*#__PURE__*/ flatMapIterable(identity);

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
export const Unfoldable: Unfoldable1<URI> = {
  URI,
  unfold,
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
export const MonadIO: MonadIO1<URI> = {
  ...Monad,
  fromIO,
};

/**
 * Same as [`filter`](#filter), but passing also the index to the iterating function.
 *
 * @category filtering
 * @since 1.0.0
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

    async function* next(): AsyncGenerator<A> {
      for await (const a of fa) {
        if (predicateWithIndex(i++, a)) {
          yield a;
        } else {
          yield* next();
        }
      }
    }

    return fromAsyncGenerator(next);
  };

/**
 * @category filtering
 * @since 1.0.0
 */
export const filter: {
  <A, B extends A>(
    refinement: Refinement<A, B>,
  ): (fa: AsyncIterable<A>) => AsyncIterable<B>;
  <A>(
    predicate: Predicate<A>,
  ): <B extends A>(fb: AsyncIterable<B>) => AsyncIterable<B>;
  <A>(predicate: Predicate<A>): (fa: AsyncIterable<A>) => AsyncIterable<A>;
} = <A>(predicate: Predicate<A>) => filterWithIndex<A>((_, a) => predicate(a));

/**
 * @category filtering
 * @since 1.0.0
 */
export interface PredicateTaskWithIndex<I, A> {
  (i: I, a: A): T.Task<boolean>;
}

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterTaskWithIndex: {
  <A>(
    predicateWithIndex: PredicateTaskWithIndex<number, A>,
  ): <B extends A>(fb: AsyncIterable<B>) => AsyncIterable<B>;
  <A>(
    predicateWithIndex: PredicateTaskWithIndex<number, A>,
  ): (fa: AsyncIterable<A>) => AsyncIterable<A>;
} =
  <A>(predicateWithIndex: PredicateTaskWithIndex<number, A>) =>
  (fa: AsyncIterable<A>) => {
    let i = 0;

    async function* next(): AsyncGenerator<A> {
      for await (const a of fa) {
        if (await predicateWithIndex(i++, a)()) {
          yield a;
        } else {
          yield* next();
        }
      }
    }

    return fromAsyncGenerator(next);
  };

/**
 * @category filtering
 * @since 1.0.0
 */
export interface PredicateTask<A> {
  (a: A): T.Task<boolean>;
}

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterTask: {
  <A>(
    predicate: PredicateTask<A>,
  ): <B extends A>(fb: AsyncIterable<B>) => AsyncIterable<B>;
  <A>(predicate: PredicateTask<A>): (fa: AsyncIterable<A>) => AsyncIterable<A>;
} = <A>(predicate: PredicateTask<A>) =>
  filterTaskWithIndex<A>((_, a) => predicate(a));

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMapWithIndex =
  <A, B>(f: (i: number, a: A) => O.Option<B>) =>
  (fa: AsyncIterable<A>): AsyncIterable<B> => {
    let i = 0;

    async function* next(): AsyncGenerator<B> {
      for await (const a of fa) {
        const optionB = f(i++, a);
        if (O.isSome(optionB)) {
          yield optionB.value;
        } else {
          yield* next();
        }
      }
    }

    return fromAsyncGenerator(next);
  };

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMap = <A, B>(f: (a: A) => O.Option<B>) =>
  filterMapWithIndex<A, B>((_, a) => f(a));

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMapTaskWithIndex =
  <A, B>(f: (i: number, a: A) => T.Task<O.Option<B>>) =>
  (fa: AsyncIterable<A>): AsyncIterable<B> => {
    let i = 0;

    async function* next(): AsyncGenerator<B> {
      for await (const a of fa) {
        const optionB = await f(i++, a)();
        if (O.isSome(optionB)) {
          yield optionB.value;
        } else {
          yield* next();
        }
      }
    }

    return fromAsyncGenerator(next);
  };

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMapTask = <A, B>(f: (a: A) => T.Task<O.Option<B>>) =>
  filterMapTaskWithIndex<A, B>((_, a) => f(a));

/**
 * Compacts an AsyncIterable of `Option`s discarding the `None` values and
 * keeping the `Some` values. It returns a new array containing the values of
 * the `Some` options.
 * @category filtering
 * @since 1.0.0
 */
export const compact: <A>(fa: AsyncIterable<O.Option<A>>) => AsyncIterable<A> =
  /*#__PURE__*/ filterMap(identity);

/**
 * @category filtering
 * @since 1.0.0
 */
export const rights = <E, A>(
  fa: AsyncIterable<Either<E, A>>,
): AsyncIterable<A> => {
  async function* next(): AsyncGenerator<A> {
    for await (const a of fa) {
      if (a._tag === "Right") {
        yield a.right;
      } else {
        yield* next();
      }
    }
  }

  return fromAsyncGenerator(next);
};

/**
 * @category filtering
 * @since 1.0.0
 */
export const lefts = <E, A>(
  fa: AsyncIterable<Either<E, A>>,
): AsyncIterable<E> => {
  async function* next(): AsyncGenerator<E> {
    for await (const a of fa) {
      if (a._tag === "Left") {
        yield a.left;
      } else {
        yield* next();
      }
    }
  }

  return fromAsyncGenerator(next);
};

/**
 * Creates a new `AsyncIterable` removing duplicate elements, keeping the first occurrence of an element, based on a `Eq<A>`.
 * @category filtering
 * @since 1.0.0
 */
export const uniq =
  <A>(E: Eq<A>) =>
  (fa: AsyncIterable<A>): AsyncIterable<A> => {
    const uniques: Array<A> = [];

    async function* next(): AsyncGenerator<A> {
      for await (const a of fa) {
        if (uniques.every((o) => !E.equals(o, a))) {
          uniques.push(a);
          yield a;
        } else {
          yield* next();
        }
      }
    }

    return fromAsyncGenerator(next);
  };

/**
 * @category mapping
 * @since 1.0.0
 */
export function transform<A, B>(
  transform: (a: A) => O.Option<B>,
  flush?: () => B,
) {
  return (fa: AsyncIterable<A>): AsyncIterable<B> => {
    let isFlushed = false;

    async function* next(): AsyncGenerator<B> {
      for await (const a of fa) {
        const b = transform(a);
        if (O.isSome(b)) {
          yield b.value;
        } else {
          yield* next();
        }
      }

      if (!isFlushed && flush) {
        isFlushed = true;
        yield flush();
      }
    }

    return fromAsyncGenerator(next);
  };
}

/**
 * @category mapping
 * @since 1.0.0
 */
export function transformTask<A, B>(
  transform: (a: A) => T.Task<O.Option<B>>,
  flush?: () => T.Task<B>,
) {
  return (fa: AsyncIterable<A>): AsyncIterable<B> => {
    let isFlushed = false;

    async function* next(): AsyncGenerator<B> {
      for await (const a of fa) {
        const b = await transform(a)();
        if (O.isSome(b)) {
          yield b.value;
        } else {
          yield* next();
        }
      }

      if (!isFlushed && flush) {
        isFlushed = true;
        yield await flush()();
      }
    }

    return fromAsyncGenerator(next);
  };
}

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 1.0.0
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
 * @since 1.0.0
 */
export const tapTask: {
  <A, _>(f: (a: A) => T.Task<_>): (self: AsyncIterable<A>) => AsyncIterable<A>;
  <A, _>(self: AsyncIterable<A>, f: (a: A) => T.Task<_>): AsyncIterable<A>;
} = /*#__PURE__*/ dual(2, tapTask_(FromTask, Chain));

/**
 * @category combinators
 * @since 1.0.0
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
 * @since 1.0.0
 */
export const Do: AsyncIterable<object> = /*#__PURE__*/ of({});

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
 * the order of results does not corresponds to order of async iterator elements
 * @category folding
 * @since 1.0.0
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
 * preserves the order of elements coming from async iterator and corresponding results
 * @category folding
 * @since 1.0.0
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

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMapWithIndexPar =
  <M>(M: Monoid<M>, limit: number) =>
  <A>(f: (i: number, a: A) => M) =>
  (fa: AsyncIterable<A>): T.Task<M> =>
    pipe(
      fa,
      reduceUntilWithIndexLimited(limit, constTrue, M.empty, (i, b, a) =>
        M.concat(b, f(i, a)),
      ),
    );

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMapPar: <M>(
  M: Monoid<M>,
  limit: number,
) => <A>(f: (a: A) => M) => (fa: AsyncIterable<A>) => T.Task<M> = (
  M,
  limit,
) => {
  const foldMapWithIndexM = foldMapWithIndexPar(M, limit);
  return (f) => foldMapWithIndexM((_, a) => f(a));
};

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMapSeq: <M>(
  M: Monoid<M>,
) => <A>(f: (a: A) => M) => (fa: AsyncIterable<A>) => T.Task<M> = (M) => {
  const foldMapWithIndexM = foldMapWithIndexPar(M, 1);
  return (f) => foldMapWithIndexM((_, a) => f(a));
};
