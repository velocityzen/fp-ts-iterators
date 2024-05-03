import * as T from "fp-ts/Task";
import * as O from "fp-ts/Option";
// import * as C from "fp-ts/console";
import { pipe } from "fp-ts/function";
import * as AI from "../lib/AsyncIterable";

import {
  createTestAsyncIterable,
  createTestAsyncIterableWithError,
} from "./helpers";

describe("AsyncIterable", () => {
  test("Error!", async () => {
    const test = pipe(createTestAsyncIterableWithError(), AI.toArraySeq());

    await expect(test).rejects.toThrow(
      "This should never have happened. Use AsyncIterableEither or AsyncIterableOption tryCatch function to handle errors"
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
      T.map(Array.from)
    );

    const values = await test();
    expect(values).toStrictEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  });

  test("toIterablePar with limit less than number of items", async () => {
    const reverseDelay = (i: number) => 100 - i * 10;

    const test = pipe(
      createTestAsyncIterable(reverseDelay),
      AI.toIterablePar(5),
      T.map(Array.from)
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
      AI.toArraySeq()
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
      (n) => () => Promise.resolve(n > 0 ? O.some([n, n - 1]) : O.none)
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
      AI.toArraySeq()
    )();
    expect(values).toStrictEqual(["test"]);
  });

  test("fromTask", async () => {
    const values = await pipe(
      AI.fromTask(() => Promise.resolve("test")),
      AI.toArraySeq()
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
      AI.toArraySeq()
    )();
    expect(values).toStrictEqual([1, 2, 3]);
  });

  test("mapWithIndex", async () => {
    const values = await pipe(
      AI.fromIterable([0, 1, 2]),
      AI.mapWithIndex((i, n) => i + n),
      AI.toArraySeq()
    )();
    expect(values).toStrictEqual([0, 2, 4]);
  });

  test("as", async () => {
    const values = await pipe(
      AI.fromIterable([0, 1, 2]),
      AI.as(1),
      AI.toArraySeq()
    )();
    expect(values).toStrictEqual([1, 1, 1]);
  });

  test("asUnit", async () => {
    const values = await pipe(
      AI.fromIterable([0, 1, 2]),
      AI.asUnit,
      AI.toArraySeq()
    )();
    expect(values).toStrictEqual([undefined, undefined, undefined]);
  });

  test("ap", async () => {
    const values = await pipe(
      AI.fromIterable([(x: number) => x * 2, (x: number) => x * 3]),
      AI.ap(AI.fromIterable([1, 2, 3])),
      AI.toArraySeq()
    )();
    expect(values).toStrictEqual([2, 3, 4, 6, 6, 9]);
  });

  test("apTask", async () => {
    const values = await pipe(
      AI.fromIterable([(x: number) => T.of(x * 2), (x: number) => T.of(x * 3)]),
      AI.apTask(AI.fromIterable([1, 2, 3])),
      AI.toArraySeq()
    )();
    expect(values).toStrictEqual([2, 3, 4, 6, 6, 9]);
  });

  test("apFirst", async () => {
    const values = await pipe(
      AI.fromIterable([1, 2]),
      AI.apFirst(AI.fromIterable(["a", "b", "c"])),
      AI.toArraySeq()
    )();
    expect(values).toStrictEqual([1, 2, 1, 2, 1, 2]);
  });

  test("apSecond", async () => {
    const values = await pipe(
      AI.fromIterable([1, 2]),
      AI.apSecond(AI.fromIterable(["a", "b", "c"])),
      AI.toArraySeq()
    )();
    expect(values).toStrictEqual(["a", "a", "b", "b", "c", "c"]);
  });

  test("flatMap", async () => {
    const values = await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.flatMap((i) => AI.fromIterable([i - 1, i + 1])),
      AI.toArraySeq()
    )();
    expect(values).toStrictEqual([0, 2, 1, 3, 2, 4]);
  });

  test("flatMapIterable", async () => {
    const values = await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.flatMapIterable((i) => [i, i + 1]),
      AI.toArraySeq()
    )();
    expect(values).toStrictEqual([1, 2, 2, 3, 3, 4]);
  });

  test("flatMapTaskWithIndex", async () => {
    const values = await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.flatMapTaskWithIndex((i, a) => T.of(i + a)),
      AI.toArraySeq()
    )();
    expect(values).toStrictEqual([1, 3, 5]);
  });
});
