import { HKT, Kind, URIS } from "fp-ts/lib/HKT";
import { Monad, Monad1 } from "fp-ts/lib/Monad";
import { Option, match, none } from "fp-ts/lib/Option";

/** @internal */
export function flatMap<M extends URIS>(
  M: Monad1<M>
): <A, B>(
  ma: Kind<M, Option<A>>,
  f: (a: A) => Kind<M, Option<B>>
) => Kind<M, Option<B>>;
/** @internal */
export function flatMap<M>(
  M: Monad<M>
): <A, B>(
  ma: HKT<M, Option<A>>,
  f: (a: A) => HKT<M, Option<B>>
) => HKT<M, Option<B>>;
/** @internal */
export function flatMap<M>(
  M: Monad<M>
): <A, B>(
  ma: HKT<M, Option<A>>,
  f: (a: A) => HKT<M, Option<B>>
) => HKT<M, Option<B>> {
  return (ma, f) =>
    M.chain(
      ma,
      match(() => M.of(none), f)
    );
}
