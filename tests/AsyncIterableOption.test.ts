import * as T from "fp-ts/Task";
import { pipe } from "fp-ts/function";
import * as AIO from "../lib/AsyncIterableOption";
import {
  createTestAsyncIterable,
  createTestAsyncIterableWithError,
} from "./helpers";

describe("AsyncIterableEither", () => {
  test("tryCatch with no error", async () => {
    const test = pipe(
      createTestAsyncIterable(),
      AIO.tryCatch,
      AIO.toArraySeq(),
      T.map((values) =>
        expect(values).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      )
    );

    await test();
  });

  test("tryCatch with error", async () => {
    const test = pipe(
      createTestAsyncIterableWithError(),
      AIO.tryCatch,
      AIO.toArraySeq(),
      T.map((values) => expect(values).toStrictEqual([0, 1, 2, 3, 4]))
    );

    await test();
  });
});
