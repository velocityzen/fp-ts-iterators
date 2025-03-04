import {
  Chain,
  Chain1,
  Chain2,
  Chain2C,
  Chain3,
  Chain3C,
  Chain4,
} from "fp-ts/lib/Chain";
import {
  FromIO,
  FromIO1,
  FromIO2,
  FromIO2C,
  FromIO3,
  FromIO3C,
  FromIO4,
} from "fp-ts/lib/FromIO";
import {
  FromTask,
  FromTask1,
  FromTask2,
  FromTask2C,
  FromTask3,
  FromTask3C,
  FromTask4,
} from "fp-ts/lib/FromTask";
import {
  Functor,
  Functor1,
  Functor2,
  Functor3,
  Functor4,
} from "fp-ts/lib/Functor";
import {
  HKT,
  Kind,
  Kind2,
  Kind3,
  Kind4,
  URIS,
  URIS2,
  URIS3,
  URIS4,
} from "fp-ts/lib/HKT";
import { IO } from "fp-ts/lib/IO";
import { Task } from "fp-ts/lib/Task";
import { flow } from "fp-ts/lib/function";

export * from "./internalGenerics";

/** @internal */
export function as<F extends URIS4>(
  F: Functor4<F>
): <S, R, E, A, _>(self: Kind4<F, S, R, E, _>, a: A) => Kind4<F, S, R, E, A>;
/** @internal */
export function as<F extends URIS3>(
  F: Functor3<F>
): <R, E, A, _>(self: Kind3<F, R, E, _>, a: _) => Kind3<F, R, E, A>;
/** @internal */
export function as<F extends URIS2>(
  F: Functor2<F>
): <E, A, _>(self: Kind2<F, E, _>, a: A) => Kind2<F, E, A>;
/** @internal */
export function as<F extends URIS>(
  F: Functor1<F>
): <A, _>(self: Kind<F, _>, a: A) => Kind<F, A>;
/** @internal */
export function as<F>(
  F: Functor<F>
): <A, _>(self: HKT<F, _>, a: A) => HKT<F, A>;
/** @internal */
export function as<F>(
  F: Functor<F>
): <A, _>(self: HKT<F, _>, b: A) => HKT<F, A> {
  return (self, b) => F.map(self, () => b);
}

/** @internal */
export function asUnit<F extends URIS4>(
  F: Functor4<F>
): <S, R, E, _>(self: Kind4<F, S, R, E, _>) => Kind4<F, S, R, E, void>;
/** @internal */
export function asUnit<F extends URIS3>(
  F: Functor3<F>
): <R, E, _>(self: Kind3<F, R, E, _>) => Kind3<F, R, E, void>;
/** @internal */
export function asUnit<F extends URIS2>(
  F: Functor2<F>
): <E, _>(self: Kind2<F, E, _>) => Kind2<F, E, void>;
/** @internal */
export function asUnit<F extends URIS>(
  F: Functor1<F>
): <_>(self: Kind<F, _>) => Kind<F, void>;
/** @internal */
export function asUnit<F>(F: Functor<F>): <_>(self: HKT<F, _>) => HKT<F, void>;
/** @internal */
export function asUnit<F>(F: Functor<F>): <_>(self: HKT<F, _>) => HKT<F, void> {
  const asM = as(F);
  return (self) => asM(self, undefined);
}

/** @internal */
export function tap<M extends URIS4>(
  M: Chain4<M>
): <S, R1, E1, A, R2, E2, _>(
  first: Kind4<M, S, R1, E1, A>,
  f: (a: A) => Kind4<M, S, R2, E2, _>
) => Kind4<M, S, R1 & R2, E1 | E2, A>;
/** @internal */
export function tap<M extends URIS3>(
  M: Chain3<M>
): <R1, E1, A, R2, E2, _>(
  first: Kind3<M, R1, E1, A>,
  f: (a: A) => Kind3<M, R2, E2, _>
) => Kind3<M, R1 & R2, E1 | E2, A>;
/** @internal */
export function tap<M extends URIS2>(
  M: Chain2<M>
): <E1, A, E2, _>(
  first: Kind2<M, E1, A>,
  f: (a: A) => Kind2<M, E2, _>
) => Kind2<M, E1 | E2, A>;
/** @internal */
export function tap<M extends URIS>(
  M: Chain1<M>
): <A, _>(first: Kind<M, A>, f: (a: A) => Kind<M, _>) => Kind<M, A>;
/** @internal */
export function tap<M>(
  M: Chain<M>
): <A, _>(first: HKT<M, A>, f: (a: A) => HKT<M, _>) => HKT<M, A>;
/** @internal */
export function tap<M>(
  M: Chain<M>
): <A, _>(first: HKT<M, A>, f: (a: A) => HKT<M, _>) => HKT<M, A> {
  return (first, f) => M.chain(first, (a) => M.map(f(a), () => a));
}

/** @internal */
export function tapIO<M extends URIS4>(
  F: FromIO4<M>,
  M: Chain4<M>
): <A, B, S, R, E>(
  self: Kind4<M, S, R, E, A>,
  f: (a: A) => IO<B>
) => Kind4<M, S, R, E, A>;
/** @internal */
export function tapIO<M extends URIS3>(
  F: FromIO3<M>,
  M: Chain3<M>
): <A, B, R, E>(
  self: Kind3<M, R, E, A>,
  f: (a: A) => IO<B>
) => Kind3<M, R, E, A>;
/** @internal */
export function tapIO<M extends URIS3, E>(
  F: FromIO3C<M, E>,
  M: Chain3C<M, E>
): <A, B, R, E>(
  self: Kind3<M, R, E, A>,
  f: (a: A) => IO<B>
) => Kind3<M, R, E, A>;
/** @internal */
export function tapIO<M extends URIS2>(
  F: FromIO2<M>,
  M: Chain2<M>
): <A, B, E>(self: Kind2<M, E, A>, f: (a: A) => IO<B>) => Kind2<M, E, A>;
/** @internal */
export function tapIO<M extends URIS2, E>(
  F: FromIO2C<M, E>,
  M: Chain2C<M, E>
): <A, B, E>(self: Kind2<M, E, A>, f: (a: A) => IO<B>) => Kind2<M, E, A>;
/** @internal */
export function tapIO<M extends URIS>(
  F: FromIO1<M>,
  M: Chain1<M>
): <A, B>(self: Kind<M, A>, f: (a: A) => IO<B>) => Kind<M, A>;
/** @internal */
export function tapIO<M>(
  F: FromIO<M>,
  M: Chain<M>
): <A, B>(self: HKT<M, A>, f: (a: A) => IO<B>) => HKT<M, A>;
/** @internal */
export function tapIO<M>(
  F: FromIO<M>,
  M: Chain<M>
): <A, B>(self: HKT<M, A>, f: (a: A) => IO<B>) => HKT<M, A> {
  const chainFirstM = tap(M);
  return (self, f) => chainFirstM(self, flow(f, F.fromIO));
}

/** @internal */
export function tapTask<M extends URIS4>(
  F: FromTask4<M>,
  M: Chain4<M>
): <S, R, E, A, B>(
  self: Kind4<M, S, R, E, A>,
  f: (a: A) => Task<B>
) => Kind4<M, S, R, E, A>;
/** @internal */
export function tapTask<M extends URIS3>(
  F: FromTask3<M>,
  M: Chain3<M>
): <R, E, A, B>(
  self: Kind3<M, R, E, A>,
  f: (a: A) => Task<B>
) => Kind3<M, R, E, A>;
/** @internal */
export function tapTask<M extends URIS3, E>(
  F: FromTask3C<M, E>,
  M: Chain3C<M, E>
): <R, A, B>(
  self: Kind3<M, R, E, A>,
  f: (a: A) => Task<B>
) => Kind3<M, R, E, A>;
/** @internal */
export function tapTask<M extends URIS2>(
  F: FromTask2<M>,
  M: Chain2<M>
): <E, A, B>(self: Kind2<M, E, A>, f: (a: A) => Task<B>) => Kind2<M, E, A>;
/** @internal */
export function tapTask<M extends URIS2, E>(
  F: FromTask2C<M, E>,
  M: Chain2C<M, E>
): <A, B>(self: Kind2<M, E, A>, f: (a: A) => Task<B>) => Kind2<M, E, A>;
/** @internal */
export function tapTask<M extends URIS>(
  F: FromTask1<M>,
  M: Chain1<M>
): <A, B>(self: Kind<M, A>, f: (a: A) => Task<B>) => Kind<M, A>;
/** @internal */
export function tapTask<M>(
  F: FromTask<M>,
  M: Chain<M>
): <A, B>(self: HKT<M, A>, f: (a: A) => Task<B>) => HKT<M, A>;
/** @internal */
export function tapTask<M>(
  F: FromTask<M>,
  M: Chain<M>
): <A, B>(self: HKT<M, A>, f: (a: A) => Task<B>) => HKT<M, A> {
  const tapM = tap(M);
  return (self, f) => tapM(self, flow(f, F.fromTask));
}
