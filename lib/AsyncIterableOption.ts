import * as T from "fp-ts/Task";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import { Option } from "fp-ts/Option";
import { flow } from "fp-ts/function";

import * as I from "./Iterable";
import { reduceUntilWithIndexLimited } from "./AsyncIterableReduce";
/**
 * @category model
 */
export interface AsyncIterableOption<A> extends AsyncIterable<Option<A>> {}

/**
 * @category type lambdas
 */
export const URI = "AsyncIterableOption";

/**
 * @category type lambdas
 */
export type URI = typeof URI;

declare module "fp-ts/HKT" {
  interface URItoKind<A> {
    readonly [URI]: AsyncIterableOption<A>;
  }
}

/**
 * returns compacted Iterable
 * the order of the results does not corresponds to the order of async iterator elements
 * @category folding
 */
export function toIterableLimited<A>(limit: number) {
  return flow(toArrayLimited<A>(limit), T.map(I.fromReadonlyArray));
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
 *  returns compacted Array
 *  the order of the results does not corresponds to the order of async iterator elements
 *  if you need to keep the order use AsyncIterator version of this function
 *  @category folding
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
