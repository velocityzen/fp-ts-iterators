/**
 * The AsyncGenerator module provides tools for working with AsyncGenerator<T> type in a functional way.
 *
 * In functional jargon, this module provides a monadic interface over AsyncGenerator<T>.
 *
 * @since 1.0.0
 */
import { Task } from "fp-ts/lib/Task";
import { LazyArg } from "fp-ts/lib/function";
import * as G from "./Generator";

/**
 * @category conversions
 * @since 1.0.0
 */
export function fromLazyArg<A>(f: () => A): AsyncGenerator<A> {
  async function* next(): AsyncGenerator<A> {
    const res = f();
    yield res;
  }

  return next();
}

/**
 * @category conversions
 * @since 1.0.0
 */
export function fromTask<A>(f: Task<A>): AsyncGenerator<A> {
  async function* next(): AsyncGenerator<A> {
    const res = await f();
    yield res;
  }

  return next();
}

/**
 * @category conversions
 * @since 1.0.0
 */
export function fromIterable<A>(fa: Iterable<A>): LazyArg<AsyncGenerator<A>> {
  const g = G.fromIterable(fa);

  async function* next(): AsyncGenerator<A> {
    const next = g.next();
    if (!next.done) {
      yield next.value;
    }
  }

  return next;
}

/**
 * @category conversions
 * @since 1.0.0
 */
export function fromAsyncIterable<A>(fa: AsyncIterable<A>): AsyncGenerator<A> {
  async function* next(): AsyncGenerator<A> {
    for await (const a of fa) {
      yield a;
    }
  }

  return next();
}
