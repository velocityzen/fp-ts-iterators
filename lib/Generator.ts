import * as O from "fp-ts/Option";
import { Option } from "fp-ts/Option";
import { LazyArg } from "fp-ts/lib/function";
/**
 * The Generator module provides tools for working with Generator<T> type in a functional way.
 *
 * In functional jargon, this module provides a monadic interface over Generator<T>.
 *
 * @since 1.0.0
 */

/**
 * @category conversions
 * @since 1.0.0
 */
export function fromIterable<A>(fa: Iterable<A>): Generator<A> {
  function* next(): Generator<A, void, undefined> {
    yield* fa;
  }

  return next();
}

/**
 * Return a `Generator` with elements initialized with `f(i)`.
 * Generator stops when f return O.none
 *
 * @category constructors
 * @since 1.0.0
 */
export const makeByWithIndex = <A>(
  f: (i: number) => Option<A>
): LazyArg<Generator<A>> => {
  let i = 0;

  function* next(): Generator<A, void, undefined> {
    const el = f(i++);
    if (O.isSome(el)) {
      yield el.value;
    }
  }

  return next;
};
