import * as T from "fp-ts/Task";
import { pipe } from "fp-ts/function";
import * as AIE from "../lib/AsyncIterableEither";
import { expectLeftEither, expectRightEither } from "jest-fp-ts-matchers";
import {
  createTestAsyncIterable,
  createTestAsyncIterableWithError,
} from "./helpers";

describe("AsyncIterableEither", () => {
  test("tryCatchToError with no error", async () => {
    const test = pipe(
      createTestAsyncIterable(),
      AIE.tryCatchToError(),
      AIE.toArraySeq(),
      T.map(
        expectRightEither((values) =>
          expect(values).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
        ),
      ),
    );

    await test();
  });

  test("tryCatchToError with error", async () => {
    const test = pipe(
      createTestAsyncIterableWithError(),
      AIE.tryCatchToError(),
      AIE.toArraySeq(),
      T.map(expectLeftEither((error) => expect(error.message).toBe("It's 5!"))),
    );

    await test();
  });
});
