import * as B from "fp-ts/boolean";
import * as E from "fp-ts/Either";
import * as N from "fp-ts/number";
import * as O from "fp-ts/Option";
import * as S from "fp-ts/string";
import * as T from "fp-ts/Task";
// import * as C from "fp-ts/console";
import { Eq, contramap } from "fp-ts/Eq";
import { identity, pipe } from "fp-ts/function";
import { describe, expect, test } from "vitest";
import * as AI from "../lib/AsyncIterable";
import {
  createTestAsyncIterable,
  createTestAsyncIterableWithError,
} from "./helpers";

describe("AsyncIterable", () => {
  test("Error!", async () => {
    const test = pipe(createTestAsyncIterableWithError(), AI.toArraySeq());

    await expect(test).rejects.toThrow(
      "This should never have happened. Use AsyncIterableEither or AsyncIterableOption tryCatch function to handle errors",
    );
  });

  test("toArraySeq", async () => {
    const test = pipe(createTestAsyncIterable(), AI.toArraySeq());

    const values = await test();
    expect(values).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test("toArrayPar", async () => {
    const test = pipe(createTestAsyncIterable(), AI.toArrayPar(10));

    const values = await test();
    expect(values).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test("toIterablePar", async () => {
    const reverseDelay = (i: number) => 100 - i * 10;

    const test = pipe(
      createTestAsyncIterable(reverseDelay),
      AI.toIterablePar(10),
      T.map(Array.from),
    );

    const values = await test();
    expect(values).toStrictEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  });

  test("toIterablePar with limit less than number of items", async () => {
    const reverseDelay = (i: number) => 100 - i * 10;

    const test = pipe(
      createTestAsyncIterable(reverseDelay),
      AI.toIterablePar(5),
      T.map(Array.from),
    );

    const values = await test();
    expect(values.slice(0, 5)).toStrictEqual([4, 3, 2, 1, 0]);
  });

  test("makeByWithIndex", async () => {
    const makeBy5 = (i: number) => (i < 5 ? O.some(i) : O.none);
    const values = await pipe(AI.makeByWithIndex(makeBy5), AI.toArraySeq())();
    expect(values).toStrictEqual([0, 1, 2, 3, 4]);
  });

  test("makeByTaskWithIndex", async () => {
    const makeBy5 = (i: number) => () =>
      Promise.resolve(i < 5 ? O.some(i) : O.none);
    const values = await pipe(
      AI.makeByTaskWithIndex(makeBy5),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([0, 1, 2, 3, 4]);
  });

  test("unfold", async () => {
    const unfold = AI.unfold(5, (n) => (n > 0 ? O.some([n, n - 1]) : O.none));
    const values = await pipe(unfold, AI.toArraySeq())();
    expect(values).toStrictEqual([5, 4, 3, 2, 1]);
  });

  test("unfoldTask", async () => {
    const unfoldTask = AI.unfoldTask(
      5,
      (n) => () => Promise.resolve(n > 0 ? O.some([n, n - 1]) : O.none),
    );
    const values = await pipe(unfoldTask, AI.toArraySeq())();
    expect(values).toStrictEqual([5, 4, 3, 2, 1]);
  });

  test("fromIterable", async () => {
    const fromIterable = AI.fromIterable([0, 1, 2, 3, 4]);
    const values = await pipe(fromIterable, AI.toArraySeq())();
    expect(values).toStrictEqual([0, 1, 2, 3, 4]);
  });

  test("fromIO", async () => {
    const values = await pipe(
      AI.fromIO(() => "test"),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual(["test"]);
  });

  test("fromTask", async () => {
    const values = await pipe(
      AI.fromTask(() => Promise.resolve("test")),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual(["test"]);
  });

  test("of", async () => {
    const values = await pipe(AI.of("test"), AI.toArraySeq())();
    expect(values).toStrictEqual(["test"]);
  });

  test("map", async () => {
    const values = await pipe(
      AI.fromIterable([0, 1, 2]),
      AI.map((i) => i + 1),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([1, 2, 3]);
  });

  test("mapWithIndex", async () => {
    const values = await pipe(
      AI.fromIterable([0, 1, 2]),
      AI.mapWithIndex((i, n) => i + n),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([0, 2, 4]);
  });

  test("as", async () => {
    const values = await pipe(
      AI.fromIterable([0, 1, 2]),
      AI.as(1),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([1, 1, 1]);
  });

  test("asUnit", async () => {
    const values = await pipe(
      AI.fromIterable([0, 1, 2]),
      AI.asUnit,
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([undefined, undefined, undefined]);
  });

  test("ap", async () => {
    const values = await pipe(
      AI.fromIterable([(x: number) => x * 2, (x: number) => x * 3]),
      AI.ap(AI.fromIterable([1, 2, 3])),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([2, 3, 4, 6, 6, 9]);
  });

  test("apTask", async () => {
    const values = await pipe(
      AI.fromIterable([(x: number) => T.of(x * 2), (x: number) => T.of(x * 3)]),
      AI.apTask(AI.fromIterable([1, 2, 3])),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([2, 3, 4, 6, 6, 9]);
  });

  test("apFirst", async () => {
    const values = await pipe(
      AI.fromIterable([1, 2]),
      AI.apFirst(AI.fromIterable(["a", "b", "c"])),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([1, 2, 1, 2, 1, 2]);
  });

  test("apSecond", async () => {
    const values = await pipe(
      AI.fromIterable([1, 2]),
      AI.apSecond(AI.fromIterable(["a", "b", "c"])),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual(["a", "a", "b", "b", "c", "c"]);
  });

  test("flatMap", async () => {
    const values = await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.flatMap((i) => AI.fromIterable([i - 1, i + 1])),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([0, 2, 1, 3, 2, 4]);
  });

  test("flatMapIterable", async () => {
    const values = await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.flatMapIterable((i) => [i, i + 1]),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([1, 2, 2, 3, 3, 4]);
  });

  test("flatMapTaskWithIndex", async () => {
    const values = await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.flatMapTaskWithIndex((i, a) => T.of(i + a)),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([1, 3, 5]);
  });

  test("flatten", async () => {
    const values = await pipe(
      AI.fromIterable([
        AI.fromIterable([1]),
        AI.fromIterable([2, 3]),
        AI.fromIterable([4]),
      ]),
      AI.flatten,
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([1, 2, 3, 4]);
  });

  test("flattenIterable", async () => {
    const values = await pipe(
      AI.fromIterable([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]),
      AI.flattenIterable,
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test("filterWithIndex", async () => {
    const f = (n: number) => n % 2 === 0;

    const values = await pipe(
      AI.fromIterable(["a", "b", "c"]),
      AI.filterWithIndex(f),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual(["a", "c"]);
  });

  test("filter", async () => {
    const g = (n: number) => n % 2 === 1;
    const values = await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.filter(g),
      AI.toArraySeq(),
    )();

    expect(values).toStrictEqual([1, 3]);
  });

  test("filter refinement all", async () => {
    const values = await pipe(
      AI.fromIterable([O.some(3), O.some(2), O.some(1)]),
      AI.filter(O.isSome),
      AI.toArraySeq(),
    )();

    expect(values).toStrictEqual([O.some(3), O.some(2), O.some(1)]);
  });

  test("filter refinement some", async () => {
    const values = await pipe(
      AI.fromIterable([O.some(3), O.none, O.some(1)]),
      AI.filter(O.isSome),
      AI.toArraySeq(),
    )();

    expect(values).toStrictEqual([O.some(3), O.some(1)]);
  });

  test("filterTaskWithIndex", async () => {
    const f = (n: number) => () => Promise.resolve(n % 2 === 0);

    const values = await pipe(
      AI.fromIterable(["a", "b", "c"]),
      AI.filterTaskWithIndex(f),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual(["a", "c"]);
  });

  test("filterTask", async () => {
    const f = (n: number) => () => Promise.resolve(n % 2 === 1);
    const values = await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.filterTask(f),
      AI.toArraySeq(),
    )();

    expect(values).toStrictEqual([1, 3]);
  });

  test("filterMapWithIndex", async () => {
    const f = (i: number, n: number) =>
      (i + n) % 2 === 0 ? O.none : O.some(n);

    const values = await pipe(
      AI.fromIterable([1, 2, 4]),
      AI.filterMapWithIndex(f),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([1, 2]);
  });

  test("filterMap", async () => {
    const f = (n: number) => (n % 2 === 0 ? O.none : O.some(n));

    const values = await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.filterMap(f),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([1, 3]);
  });

  test("filterMapTaskWithIndex", async () => {
    const f = (i: number, n: number) => () =>
      Promise.resolve((i + n) % 2 === 0 ? O.none : O.some(n));

    const values = await pipe(
      AI.fromIterable([1, 2, 4]),
      AI.filterMapTaskWithIndex(f),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([1, 2]);
  });

  test("filterMapTask", async () => {
    const f = (n: number) => () =>
      Promise.resolve(n % 2 === 0 ? O.none : O.some(n));

    const values = await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.filterMapTask(f),
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([1, 3]);
  });

  test("rights", async () => {
    const values = await pipe(
      AI.fromIterable([E.right(1), E.left("foo"), E.right(2)]),
      AI.rights,
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual([1, 2]);
  });

  test("lefts", async () => {
    const values = await pipe(
      AI.fromIterable([E.right(1), E.left("foo"), E.right(2)]),
      AI.lefts,
      AI.toArraySeq(),
    )();
    expect(values).toStrictEqual(["foo"]);
  });

  test("uniq", async () => {
    interface A {
      readonly a: string;
      readonly b: number;
    }

    const eqA = pipe(
      N.Ord,
      contramap((f: A) => f.b),
    );
    const arrA: A = { a: "a", b: 1 };
    const arrB: A = { a: "b", b: 1 };
    const arrC: A = { a: "c", b: 2 };
    const arrD: A = { a: "d", b: 2 };
    const arrUniq: Array<A> = [arrA, arrC];

    async function strictEqual<A>(
      eq: Eq<A>,
      input: Array<A>,
      output: Array<A>,
    ) {
      const values = await pipe(
        AI.fromIterable(input),
        AI.uniq(eq),
        AI.toArraySeq(),
      )();
      expect(values).toStrictEqual(output);
    }

    await strictEqual(eqA, arrUniq, arrUniq);
    await strictEqual(eqA, arrUniq, arrUniq);
    await strictEqual(eqA, [arrA, arrB, arrC, arrD], [arrA, arrC]);
    await strictEqual(eqA, [arrB, arrA, arrC, arrD], [arrB, arrC]);
    await strictEqual(eqA, [arrA, arrA, arrC, arrD, arrA], [arrA, arrC]);
    await strictEqual(eqA, [arrA, arrC], [arrA, arrC]);
    await strictEqual(eqA, [arrC, arrA], [arrC, arrA]);
    await strictEqual(B.Eq, [true, false, true, false], [true, false]);
    await strictEqual(N.Eq, [], []);
    await strictEqual(N.Eq, [-0, -0], [-0]);
    await strictEqual(N.Eq, [0, -0], [0]);
    await strictEqual(N.Eq, [1], [1]);
    await strictEqual(N.Eq, [2, 1, 2], [2, 1]);
    await strictEqual(N.Eq, [1, 2, 1], [1, 2]);
    await strictEqual(N.Eq, [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]);
    await strictEqual(N.Eq, [1, 1, 2, 2, 3, 3, 4, 4, 5, 5], [1, 2, 3, 4, 5]);
    await strictEqual(N.Eq, [1, 2, 3, 4, 5, 1, 2, 3, 4, 5], [1, 2, 3, 4, 5]);
    await strictEqual(S.Eq, ["a", "b", "a"], ["a", "b"]);
    await strictEqual(S.Eq, ["a", "b", "A"], ["a", "b", "A"]);
  });

  test("transform / as map no flush", async () => {
    const values = await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.transform(O.some),
      AI.toArraySeq(),
    )();

    expect(values).toStrictEqual([1, 2, 3]);
  });

  test("transform / with flush", async () => {
    let sum = 0;
    const transform = (n: number) => {
      sum += n;
      return O.none;
    };
    const flush = () => sum;

    const values = await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.transform(transform, flush),
      AI.toArraySeq(),
    )();

    expect(values).toStrictEqual([6]);
  });

  test("transformTask", async () => {
    let sum = 0;
    const transform = (n: number) => {
      sum += n;
      return T.of(O.none);
    };
    const flush = () => T.of(sum);

    const values = await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.transformTask(transform, flush),
      AI.toArraySeq(),
    )();

    expect(values).toStrictEqual([6]);
  });

  test("foldMapSeq", async () => {
    const values = await pipe(
      AI.fromIterable(["a", "b", "c"]),
      AI.foldMapSeq(S.Monoid)(identity),
    )();

    expect(values).toStrictEqual("abc");
  });

  test("tap", async () => {
    const test = pipe(
      AI.fromIterable([1, 2, 3]),
      AI.tap((a) => AI.of(a * 2)),
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([1, 2, 3]);
      }),
    );

    return test;
  });

  test("tapIO", async () => {
    const ref: Array<number> = [];
    const add = (value: number) => () => ref.push(value);

    await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.tapIO(add),
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([1, 2, 3]);
      }),
    )();

    expect(ref).toStrictEqual([1, 2, 3]);
  });

  test("tapTask", async () => {
    const ref: Array<number> = [];
    const add = (value: number) => T.fromIO(() => ref.push(value));

    await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.tapTask(add),
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([1, 2, 3]);
      }),
    )();

    expect(ref).toStrictEqual([1, 2, 3]);
  });
});
