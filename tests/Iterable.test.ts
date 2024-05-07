import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as N from "fp-ts/Number";
import * as B from "fp-ts/Boolean";
import * as S from "fp-ts/String";
import { identity, pipe } from "fp-ts/function";
import { Eq, contramap } from "fp-ts/Eq";

import * as I from "../lib/Iterable";

describe("Iterable", () => {
  test("toArray", () => {
    const values = pipe(I.fromReadonlyArray([1, 2, 3]), I.toArray);
    expect(values).toStrictEqual([1, 2, 3]);
  });

  test("makeByWithIndex", () => {
    const makeBy5 = (i: number) => (i < 5 ? O.some(i) : O.none);
    const values = pipe(I.makeByWithIndex(makeBy5), I.toArray);
    expect(values).toStrictEqual([0, 1, 2, 3, 4]);
  });

  test("unfold", () => {
    const unfold = I.unfold(5, (n) => (n > 0 ? O.some([n, n - 1]) : O.none));
    const values = pipe(unfold, I.toArray);
    expect(values).toStrictEqual([5, 4, 3, 2, 1]);
  });

  test("fromIO", () => {
    const values = pipe(
      I.fromIO(() => "test"),
      I.toArray
    );
    expect(values).toStrictEqual(["test"]);
  });

  test("of", () => {
    const values = pipe(I.of("test"), I.toArray);
    expect(values).toStrictEqual(["test"]);
  });

  test("mapWithIndex", () => {
    const values = pipe(
      I.fromReadonlyArray([0, 1, 2]),
      I.mapWithIndex((i, n) => i + n),
      I.toArray
    );
    expect(values).toStrictEqual([0, 2, 4]);
  });

  test("map", () => {
    const values = pipe(
      I.fromReadonlyArray([0, 1, 2]),
      I.map((i) => i + 1),
      I.toArray
    );
    expect(values).toStrictEqual([1, 2, 3]);
  });

  test("as", () => {
    const values = pipe(I.fromReadonlyArray([0, 1, 2]), I.as(1), I.toArray);
    expect(values).toStrictEqual([1, 1, 1]);
  });

  test("asUnit", () => {
    const values = pipe(I.fromReadonlyArray([0, 1, 2]), I.asUnit, I.toArray);
    expect(values).toStrictEqual([undefined, undefined, undefined]);
  });

  test("ap", () => {
    const values = pipe(
      I.fromReadonlyArray([(x: number) => x * 2, (x: number) => x * 3]),
      I.ap(I.fromReadonlyArray([1, 2, 3])),
      I.toArray
    );
    expect(values).toStrictEqual([2, 4, 6, 3, 6, 9]);
  });

  test("apFirst", () => {
    const values = pipe(
      I.fromReadonlyArray([1, 2]),
      I.apFirst(I.fromReadonlyArray(["a", "b", "c"])),
      I.toArray
    );
    expect(values).toStrictEqual([1, 1, 1, 2, 2, 2]);
  });

  test("apSecond", () => {
    const values = pipe(
      I.fromReadonlyArray([1, 2]),
      I.apSecond(I.fromReadonlyArray(["a", "b", "c"])),
      I.toArray
    );
    expect(values).toStrictEqual(["a", "b", "c", "a", "b", "c"]);
  });

  test("flatMap", () => {
    const values = pipe(
      I.fromReadonlyArray([1, 2, 3]),
      I.flatMap((i) => I.fromReadonlyArray([i - 1, i + 1])),
      I.toArray
    );
    expect(values).toStrictEqual([0, 2, 1, 3, 2, 4]);
  });

  test("flatten", () => {
    const values = pipe(
      I.fromReadonlyArray([
        I.fromReadonlyArray([1]),
        I.fromReadonlyArray([2, 3]),
        I.fromReadonlyArray([4]),
      ]),
      I.flatten,
      I.toArray
    );
    expect(values).toStrictEqual([1, 2, 3, 4]);
  });

  test("filterWithIndex", () => {
    const f = (n: number) => n % 2 === 0;

    const values = pipe(
      I.fromReadonlyArray(["a", "b", "c"]),
      I.filterWithIndex(f),
      I.toArray
    );
    expect(values).toStrictEqual(["a", "c"]);
  });

  test("filter", () => {
    const g = (n: number) => n % 2 === 1;
    const values = pipe(I.fromReadonlyArray([1, 2, 3]), I.filter(g), I.toArray);

    expect(values).toStrictEqual([1, 3]);
  });

  test("filter refinement all", () => {
    const values = pipe(
      I.fromReadonlyArray([O.some(3), O.some(2), O.some(1)]),
      I.filter(O.isSome),
      I.toArray
    );

    expect(values).toStrictEqual([O.some(3), O.some(2), O.some(1)]);
  });

  test("filter refinement some", () => {
    const values = pipe(
      I.fromReadonlyArray([O.some(3), O.none, O.some(1)]),
      I.filter(O.isSome),
      I.toArray
    );

    expect(values).toStrictEqual([O.some(3), O.some(1)]);
  });

  test("filterMapWithIndex", () => {
    const f = (i: number, n: number) =>
      (i + n) % 2 === 0 ? O.none : O.some(n);

    const values = pipe(
      I.fromReadonlyArray([1, 2, 4]),
      I.filterMapWithIndex(f),
      I.toArray
    );
    expect(values).toStrictEqual([1, 2]);
  });

  test("filterMap", () => {
    const f = (n: number) => (n % 2 === 0 ? O.none : O.some(n));

    const values = pipe(
      I.fromReadonlyArray([1, 2, 3]),
      I.filterMap(f),
      I.toArray
    );
    expect(values).toStrictEqual([1, 3]);
  });

  test("rights", () => {
    const values = pipe(
      I.fromReadonlyArray([E.right(1), E.left("foo"), E.right(2)]),
      I.rights,
      I.toArray
    );
    expect(values).toStrictEqual([1, 2]);
  });

  test("lefts", () => {
    const values = pipe(
      I.fromReadonlyArray([E.right(1), E.left("foo"), E.right(2)]),
      I.lefts,
      I.toArray
    );
    expect(values).toStrictEqual(["foo"]);
  });

  test("uniq", () => {
    interface A {
      readonly a: string;
      readonly b: number;
    }

    const eqA = pipe(
      N.Ord,
      contramap((f: A) => f.b)
    );
    const arrA: A = { a: "a", b: 1 };
    const arrB: A = { a: "b", b: 1 };
    const arrC: A = { a: "c", b: 2 };
    const arrD: A = { a: "d", b: 2 };
    const arrUniq: Array<A> = [arrA, arrC];

    function strictEqual<A>(eq: Eq<A>, input: Array<A>, output: Array<A>) {
      const values = pipe(I.fromReadonlyArray(input), I.uniq(eq), I.toArray);
      expect(values).toStrictEqual(output);
    }

    strictEqual(eqA, arrUniq, arrUniq);
    strictEqual(eqA, arrUniq, arrUniq);
    strictEqual(eqA, [arrA, arrB, arrC, arrD], [arrA, arrC]);
    strictEqual(eqA, [arrB, arrA, arrC, arrD], [arrB, arrC]);
    strictEqual(eqA, [arrA, arrA, arrC, arrD, arrA], [arrA, arrC]);
    strictEqual(eqA, [arrA, arrC], [arrA, arrC]);
    strictEqual(eqA, [arrC, arrA], [arrC, arrA]);
    strictEqual(B.Eq, [true, false, true, false], [true, false]);
    strictEqual(N.Eq, [], []);
    strictEqual(N.Eq, [-0, -0], [-0]);
    strictEqual(N.Eq, [0, -0], [0]);
    strictEqual(N.Eq, [1], [1]);
    strictEqual(N.Eq, [2, 1, 2], [2, 1]);
    strictEqual(N.Eq, [1, 2, 1], [1, 2]);
    strictEqual(N.Eq, [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]);
    strictEqual(N.Eq, [1, 1, 2, 2, 3, 3, 4, 4, 5, 5], [1, 2, 3, 4, 5]);
    strictEqual(N.Eq, [1, 2, 3, 4, 5, 1, 2, 3, 4, 5], [1, 2, 3, 4, 5]);
    strictEqual(S.Eq, ["a", "b", "a"], ["a", "b"]);
    strictEqual(S.Eq, ["a", "b", "A"], ["a", "b", "A"]);
  });

  test("transform / as map no flush", () => {
    const values = pipe(
      I.fromReadonlyArray([1, 2, 3]),
      I.transform(O.some),
      I.toArray
    );

    expect(values).toStrictEqual([1, 2, 3]);
  });

  test("transform / with flush", () => {
    let sum = 0;
    const transform = (n: number) => {
      sum += n;
      return O.none;
    };
    const flush = () => sum;

    const values = pipe(
      I.fromReadonlyArray([1, 2, 3]),
      I.transform(transform, flush),
      I.toArray
    );

    expect(values).toStrictEqual([6]);
  });

  test("foldMap", () => {
    const values = pipe(
      I.fromReadonlyArray(["a", "b", "c"]),
      I.foldMap(S.Monoid)(identity)
    );

    expect(values).toStrictEqual("abc");
  });
});
