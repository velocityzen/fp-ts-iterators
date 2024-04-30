import * as T from "fp-ts/Task";
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
      "This should never have happened. Use AsyncIterableEither or AsyncIterableOption .tryCatch function to handle errors",
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

  test("toIterablePar", async () => {
    const reverseDelay = (i: number) => 100 - i * 10;

    const test = pipe(
      createTestAsyncIterable(reverseDelay),
      AI.toIterablePar(5),
      T.map(Array.from),
    );

    const values = await test();
    expect(values).toStrictEqual([4, 3, 2, 1, 0, 5, 6, 7, 8, 9]);
  });
});
