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
