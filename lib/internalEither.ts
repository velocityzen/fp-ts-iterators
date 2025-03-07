import {
  Chain,
  Chain1,
  Chain2,
  Chain2C,
  Chain3,
  Chain3C,
  Chain4,
} from "fp-ts/lib/Chain";
import * as E from "fp-ts/lib/Either";
import { Either } from "fp-ts/lib/Either";
import * as ET from "fp-ts/lib/EitherT";
import {
  FromEither,
  FromEither1,
  FromEither2,
  FromEither2C,
  FromEither3,
  FromEither3C,
  FromEither4,
  fromEitherK,
} from "fp-ts/lib/FromEither";
import { Functor, Functor1, Functor2 } from "fp-ts/lib/Functor";
import {
  HKT,
  HKT2,
  Kind,
  Kind2,
  Kind3,
  Kind4,
  URIS,
  URIS2,
  URIS3,
  URIS4,
} from "fp-ts/lib/HKT";
import { Monad, Monad1, Monad2 } from "fp-ts/lib/Monad";
import { pipe } from "fp-ts/lib/function";
import { tap } from "./internal";

/** @internal */
export function tapEither<M extends URIS4>(
  F: FromEither4<M>,
  M: Chain4<M>,
): <A, E, B, S, R>(
  self: Kind4<M, S, R, E, A>,
  f: (a: A) => Either<E, B>,
) => Kind4<M, S, R, E, A>;
/** @internal */
export function tapEither<M extends URIS3>(
  F: FromEither3<M>,
  M: Chain3<M>,
): <A, E, B, R>(
  self: Kind3<M, R, E, A>,
  f: (a: A) => Either<E, B>,
) => Kind3<M, R, E, A>;
/** @internal */
export function tapEither<M extends URIS3, E>(
  F: FromEither3C<M, E>,
  M: Chain3C<M, E>,
): <A, B, R>(
  self: Kind3<M, R, E, A>,
  f: (a: A) => Either<E, B>,
) => Kind3<M, R, E, A>;
/** @internal */
export function tapEither<M extends URIS2>(
  F: FromEither2<M>,
  M: Chain2<M>,
): <A, E, B>(self: Kind2<M, E, A>, f: (a: A) => Either<E, B>) => Kind2<M, E, A>;
/** @internal */
export function tapEither<M extends URIS2, E>(
  F: FromEither2C<M, E>,
  M: Chain2C<M, E>,
): <A, B>(self: Kind2<M, E, A>, f: (a: A) => Either<E, B>) => Kind2<M, E, A>;
/** @internal */
export function tapEither<M extends URIS>(
  F: FromEither1<M>,
  M: Chain1<M>,
): <E, A, B>(self: Kind<M, A>, f: (a: A) => Either<E, B>) => Kind<M, A>;
/** @internal */
export function tapEither<M>(
  F: FromEither<M>,
  M: Chain<M>,
): <A, E, B>(self: HKT2<M, E, A>, f: (a: A) => Either<E, B>) => HKT2<M, E, A>;
/** @internal */
export function tapEither<M extends URIS2>(
  F: FromEither2<M>,
  M: Chain2<M>,
): <A, E, B>(
  self: Kind2<M, E, A>,
  f: (a: A) => Either<E, B>,
) => Kind2<M, E, A> {
  const fromEither = fromEitherK(F);
  const tapM = tap(M);
  return (self, f) => tapM(self, fromEither(f));
}

/** @internal */
export function mapBoth<F extends URIS2>(
  F: Functor2<F>,
): <R, E, A, G, B>(
  self: Kind2<F, R, Either<E, A>>,
  f: (e: E) => G,
  g: (a: A) => B,
) => Kind2<F, R, Either<G, B>>;
/** @internal */
export function mapBoth<F extends URIS>(
  F: Functor1<F>,
): <E, A, G, B>(
  self: Kind<F, Either<E, A>>,
  f: (e: E) => G,
  g: (a: A) => B,
) => Kind<F, Either<G, B>>;
/** @internal */
export function mapBoth<F>(
  F: Functor<F>,
): <E, A, G, B>(
  self: HKT<F, Either<E, A>>,
  f: (e: E) => G,
  g: (a: A) => B,
) => HKT<F, Either<G, B>>;
/** @internal */
export function mapBoth<F>(
  F: Functor<F>,
): <E, A, G, B>(
  self: HKT<F, Either<E, A>>,
  f: (e: E) => G,
  g: (a: A) => B,
) => HKT<F, Either<G, B>> {
  return (self, f, g) => F.map(self, E.bimap(f, g));
}

/** @internal */
export function mapError<F extends URIS2>(
  F: Functor2<F>,
): <R, E, A, G>(
  self: Kind2<F, R, Either<E, A>>,
  f: (e: E) => G,
) => Kind2<F, R, Either<G, A>>;
/** @internal */
export function mapError<F extends URIS>(
  F: Functor1<F>,
): <E, A, G>(
  self: Kind<F, Either<E, A>>,
  f: (e: E) => G,
) => Kind<F, Either<G, A>>;
/** @internal */
export function mapError<F>(
  F: Functor<F>,
): <E, A, G>(
  self: HKT<F, Either<E, A>>,
  f: (e: E) => G,
) => HKT<F, Either<G, A>>;
/** @internal */
export function mapError<F>(
  F: Functor<F>,
): <E, A, G>(
  self: HKT<F, Either<E, A>>,
  f: (e: E) => G,
) => HKT<F, Either<G, A>> {
  return (self, f) => F.map(self, E.mapLeft(f));
}

/** @internal */
export function flatMap<M extends URIS2>(
  M: Monad2<M>,
): <ME, E, A, B>(
  ma: Kind2<M, ME, Either<E, A>>,
  f: (a: A) => Kind2<M, ME, Either<E, B>>,
) => Kind2<M, ME, Either<E, B>>;
/** @internal */
export function flatMap<M extends URIS>(
  M: Monad1<M>,
): <E, A, B>(
  ma: Kind<M, Either<E, A>>,
  f: (a: A) => Kind<M, Either<E, B>>,
) => Kind<M, Either<E, B>>;
/** @internal */
export function flatMap<M>(
  M: Monad<M>,
): <E, A, B>(
  ma: HKT<M, Either<E, A>>,
  f: (a: A) => HKT<M, Either<E, B>>,
) => HKT<M, Either<E, B>>;
/** @internal */
export function flatMap<M>(
  M: Monad<M>,
): <E, A, B>(
  ma: HKT<M, Either<E, A>>,
  f: (a: A) => HKT<M, Either<E, B>>,
) => HKT<M, Either<E, B>> {
  return (ma, f) => M.chain(ma, (e) => (E.isLeft(e) ? M.of(e) : f(e.right)));
}

/** @internal */
export function tapError<M extends URIS2>(
  M: Monad2<M>,
): <R, E, A, B>(
  ma: Kind2<M, R, Either<E, A>>,
  onLeft: (e: E) => Kind2<M, R, Either<E, B>>,
) => Kind2<M, R, Either<E, A>>;
/** @internal */
export function tapError<M extends URIS>(
  M: Monad1<M>,
): <E, A, B>(
  ma: Kind<M, Either<E, A>>,
  onLeft: (e: E) => Kind<M, Either<E, B>>,
) => Kind<M, Either<E, A>>;
/** @internal */
export function tapError<M>(
  M: Monad<M>,
): <E, A, B>(
  ma: HKT<M, Either<E, A>>,
  onLeft: (e: E) => HKT<M, Either<E, B>>,
) => HKT<M, Either<E, A>>;
/** @internal */
export function tapError<M>(
  M: Monad<M>,
): <E, A, B>(
  ma: HKT<M, Either<E, A>>,
  onLeft: (e: E) => HKT<M, Either<E, B>>,
) => HKT<M, Either<E, A>> {
  const orElseM = ET.orElse(M);
  return (ma, onLeft) =>
    pipe(
      ma,
      orElseM((e) => M.map(onLeft(e), (eb) => (E.isLeft(eb) ? eb : E.left(e)))),
    );
}
