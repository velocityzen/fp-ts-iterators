/**
 * @since 1.0.0
 */
import * as O from "fp-ts/Option";
import * as T from "fp-ts/Task";

/**
 * @category sequencing
 * @since 1.0.0
 */
export function getAsyncIteratorNextTask<A>(
  iterable: AsyncIterable<A>
): T.Task<O.Option<A>> {
  async function next(): Promise<O.Option<A>> {
    for await (const value of iterable) {
      return O.some(value);
    }

    return O.none;
  }

  return next;
}

/**
 * generic async iterable reducer.
 *
 * - limit: how many values pull in parallel.
 * - until: predicate if the function should keep pulling values from the iterator
 * - b: reducer accumulator initial value.
 * - f: reducer function.
 *
 * @category sequencing
 * @since 1.0.0
 */
export function reduceUntilWithIndexLimited<A, B>(
  limit: number,
  until: (a: A) => boolean,
  b: B,
  f: (i: number, b: B, a: A) => B
): (iterable: AsyncIterable<A>) => T.Task<B> {
  return (iterable) => () =>
    new Promise((resolve, reject) => {
      let running = 0;
      let out = b;
      let index = 0;
      let isDone = false;

      const next = getAsyncIteratorNextTask(iterable);

      function run() {
        if (
          isDone || // we done
          running === limit // the tasks queue is saturated
        ) {
          return;
        }

        running++;
        next()
          .then(didRun)
          .catch((cause) => {
            isDone = true;

            reject(
              Error(
                "This should never have happened. Use AsyncIterableEither or AsyncIterableOption tryCatch function to handle errors",
                { cause }
              )
            );
          });
      }

      function didRun(value: O.Option<A>) {
        if (O.isNone(value)) {
          isDone = true;
        } else {
          out = f(index++, out, value.value);

          if (!until(value.value)) {
            isDone = true;
          }
        }

        running--;
        run();
        if (running === 0) {
          resolve(out);
        }
      }

      while (running < limit) {
        run();
      }
    });
}
