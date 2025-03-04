/**
 * The Iterable module provides tools for working with Typescript's Iterable<T> type in a functional way.
 *
 * In functional jargon, this module provides a monadic interface over Typescript's Iterable<T>.
 *
 * This nodule does not implements fuctions that would lead to degrading perfomance of Iterable. Any Iterable can be easly converted to Array
 *
 * @since 1.0.0
 */

// for some reason eslint does not see type of values from iterable
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Applicative1 } from "fp-ts/lib/Applicative";
import {
  Apply1,
  apFirst as apFirst_,
  apS as apS_,
  apSecond as apSecond_,
} from "fp-ts/lib/Apply";
import * as chainable from "fp-ts/lib/Chain";
import { Either } from "fp-ts/lib/Either";
import { Eq } from "fp-ts/lib/Eq";
import {
  PredicateWithIndex,
  RefinementWithIndex,
} from "fp-ts/lib/FilterableWithIndex";
import { FromIO1 } from "fp-ts/lib/FromIO";
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
import { NaturalTransformation11 } from "fp-ts/lib/NaturalTransformation";
import * as O from "fp-ts/lib/Option";
import { Option } from "fp-ts/lib/Option";
import { Pointed1 } from "fp-ts/lib/Pointed";
import { Predicate } from "fp-ts/lib/Predicate";
import * as RA from "fp-ts/lib/ReadonlyArray";
import { Refinement } from "fp-ts/lib/Refinement";
import { Unfoldable1 } from "fp-ts/lib/Unfoldable";
import { identity, pipe } from "fp-ts/lib/function";
import {
  asUnit as asUnit_,
  as as as_,
  dual,
  tapIO as tapIO_,
  tap as tap_,
} from "./internal";

/**
 * @category type lambdas
 * @since 1.0.0
 */
export const URI = "Iterable";

/**
 * @category type lambdas
 * @since 1.0.0
 */
export type URI = typeof URI;

declare module "fp-ts/lib/HKT" {
  export interface URItoKind<A> {
    readonly [URI]: Iterable<A>;
  }
}

/**
 * Return a `Iterable` with elements initialized with `f(i)`.
 * Iterable stops when f return O.none
 *
 * @category constructors
 * @since 1.0.0
 */
export const makeByWithIndex: <A>(
  f: (i: number) => Option<A>
) => Iterable<A> = (f) => ({
  *[Symbol.iterator]() {
    for (let i = 0, el = f(i); O.isSome(el); i++, el = f(i)) {
      yield el.value;
    }
  },
});

/**
 * @category constructors
 * @since 1.0.0
 */
export const makeBy = <A>(f: () => Option<A>): Iterable<A> =>
  makeByWithIndex(() => f());

/**
 * @category constructors
 * @since 1.0.0
 */
export const unfold = <A, B>(
  b: B,
  f: (b: B) => Option<readonly [A, B]>
): Iterable<A> => {
  let bb: B = b;

  return {
    *[Symbol.iterator]() {
      for (let mt = f(bb); O.isSome(mt); mt = f(bb)) {
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
export const fromIO: <A>(fa: IO<A>) => Iterable<A> = (ma) => ({
  *[Symbol.iterator]() {
    yield ma();
  },
});

/**
 * @category conversions
 * @since 1.0.0
 * isn't it weird? all arrays are iterables
 */
export const fromReadonlyArray: NaturalTransformation11<RA.URI, URI> = (
  ax
) => ({
  *[Symbol.iterator]() {
    for (const a of ax) {
      yield a;
    }
  },
});

/**
 * @category constructors
 * @since 1.0.0
 */
export const of: Pointed1<URI>["of"] = (a) => ({
  *[Symbol.iterator]() {
    yield a;
  },
});

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
  (fa: Iterable<A>): Iterable<B> => {
    let i = 0;
    return {
      *[Symbol.iterator]() {
        for (const a of fa) {
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
 * Maps the value to the specified constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const as: {
  <A>(a: A): <_>(self: Iterable<_>) => Iterable<A>;
  <_, A>(self: Iterable<_>, a: A): Iterable<A>;
} = dual(2, as_(Functor));

/**
 * Maps the value to the void constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const asUnit: <_>(self: Iterable<_>) => Iterable<void> =
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
  <A>(fa: Iterable<A>) =>
  <B>(fab: Iterable<(a: A) => B>): Iterable<B> => ({
    *[Symbol.iterator]() {
      for (const ab of fab) {
        for (const a of fa) {
          yield ab(a);
        }
      }
    },
  });

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
  <A, B>(f: (a: A) => Iterable<B>) =>
  (fa: Iterable<A>): Iterable<B> => ({
    *[Symbol.iterator]() {
      for (const a1 of fa) {
        for (const a2 of f(a1)) {
          yield a2;
        }
      }
    },
  });

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatten: <A>(mma: Iterable<Iterable<A>>) => Iterable<A> =
  /*#__PURE__*/ flatMap(identity);

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
  <A, B extends A>(refinementWithIndex: RefinementWithIndex<number, A, B>): (
    fa: Iterable<A>
  ) => Iterable<B>;
  <A>(predicateWithIndex: PredicateWithIndex<number, A>): <B extends A>(
    fb: Iterable<A>
  ) => Iterable<B>;
  <A>(predicateWithIndex: PredicateWithIndex<number, A>): (
    fa: Iterable<A>
  ) => Iterable<A>;
} =
  <A>(predicateWithIndex: PredicateWithIndex<number, A>) =>
  (fa: Iterable<A>): Iterable<A> => {
    let i = 0;

    return {
      *[Symbol.iterator]() {
        for (const a of fa) {
          if (predicateWithIndex(i++, a)) {
            yield a;
          }
        }
      },
    };
  };

/**
 * @category filtering
 * @since 1.0.0
 */
export const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (
    fa: Iterable<A>
  ) => Iterable<B>;
  <A>(predicate: Predicate<A>): <B extends A>(fb: Iterable<B>) => Iterable<B>;
  <A>(predicate: Predicate<A>): (fa: Iterable<A>) => Iterable<A>;
} =
  <A>(predicate: Predicate<A>) =>
  (fa: Iterable<A>) => ({
    *[Symbol.iterator]() {
      for (const a of fa) {
        if (predicate(a)) {
          yield a;
        }
      }
    },
  });

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMapWithIndex =
  <A, B>(f: (i: number, a: A) => Option<B>) =>
  (fa: Iterable<A>): Iterable<B> => {
    let i = 0;

    return {
      *[Symbol.iterator]() {
        for (const a of fa) {
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
 * @since 1.0.0
 */
export const filterMap = <A, B>(f: (a: A) => Option<B>) =>
  filterMapWithIndex<A, B>((_, a) => f(a));

/**
 * Compacts an Iterable of `Option`s discarding the `None` values and
 * keeping the `Some` values. It returns a new array containing the values of
 * the `Some` options.
 * @category filtering
 * @since 1.0.0
 */
export const compact: <A>(fa: Iterable<Option<A>>) => Iterable<A> =
  /*#__PURE__*/ filterMap(identity);

/**
 * @category filtering
 * @since 1.0.0
 */
export const rights = <E, A>(fa: Iterable<Either<E, A>>): Iterable<A> => ({
  *[Symbol.iterator]() {
    for (const a of fa) {
      if (a._tag === "Right") {
        yield a.right;
      }
    }
  },
});

/**
 * @category filtering
 * @since 1.0.0
 */
export const lefts = <E, A>(ai: Iterable<Either<E, A>>): Iterable<E> => ({
  *[Symbol.iterator]() {
    for (const a of ai) {
      if (a._tag === "Left") {
        yield a.left;
      }
    }
  },
});

/**
 * Creates a new `Iterable` removing duplicate elements, keeping the first occurrence of an element,
 * based on a `Eq<A>`.
 * @category filtering
 * @since 1.0.0
 */
export const uniq =
  <A>(E: Eq<A>) =>
  (fa: Iterable<A>): Iterable<A> => {
    const uniques: Array<A> = [];

    return {
      *[Symbol.iterator]() {
        for (const a of fa) {
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
 * @since 1.0.0
 */
export function transform<A, B>(
  transform: (a: A) => Option<B>,
  flush?: () => B
) {
  return (fa: Iterable<A>): Iterable<B> => ({
    *[Symbol.iterator]() {
      for (const a of fa) {
        const b = transform(a);
        if (O.isSome(b)) {
          yield b.value;
        }
      }

      if (flush) {
        yield flush();
      }
    },
  });
}

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 1.0.0
 */
export const tap: {
  <A, _>(self: Iterable<A>, f: (a: A) => Iterable<_>): Iterable<A>;
  <A, _>(f: (a: A) => Iterable<_>): (self: Iterable<A>) => Iterable<A>;
} = /*#__PURE__*/ dual(2, tap_(Chain));

/**
 * @category combinators
 * @since 1.0.0
 */
export const tapIO: {
  <A, _>(f: (a: A) => IO<_>): (self: Iterable<A>) => Iterable<A>;
  <A, _>(self: Iterable<A>, f: (a: A) => IO<_>): Iterable<A>;
} = /*#__PURE__*/ dual(2, tapIO_(FromIO, Chain));

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 1.0.0
 */
export const Do: Iterable<{}> = /*#__PURE__*/ of({});

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
 * @category folding
 * @since 1.0.0
 */
export const reduceWithIndex: <A, B>(
  b: B,
  f: (i: number, b: B, a: A) => B
) => (fa: Iterable<A>) => B = (b, f) => (fa) => {
  let i = 0;
  let out = b;
  for (const a of fa) {
    out = f(i++, out, a);
  }
  return out;
};

/**
 * @category folding
 * @since 1.0.0
 */
export const reduce: <A, B>(
  b: B,
  f: (b: B, a: A) => B
) => (fa: Iterable<A>) => B = (b, f) =>
  reduceWithIndex(b, (_, b, a) => f(b, a));

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMapWithIndex =
  <M>(M: Monoid<M>) =>
  <A>(f: (i: number, a: A) => M) =>
  (fa: Iterable<A>): M =>
    pipe(
      fa,
      reduceWithIndex(M.empty, (i, b, a) => M.concat(b, f(i, a)))
    );

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMap: <M>(
  M: Monoid<M>
) => <A>(f: (a: A) => M) => (fa: Iterable<A>) => M = (M) => {
  const foldMapWithIndexM = foldMapWithIndex(M);
  return (f) => foldMapWithIndexM((_, a) => f(a));
};

/**
 * @category conversions
 * @since 1.0.0
 */
export const toArray = <A>(fa: Iterable<A>): Array<A> => Array.from(fa);
