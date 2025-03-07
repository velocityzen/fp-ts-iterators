import * as O from "fp-ts/Option";
import * as T from "fp-ts/Task";
import { pipe } from "fp-ts/function";
import { expectRightEither } from "jest-fp-ts-matchers";
import { describe, expect, test } from "vitest";
import * as AI from "../lib/AsyncIterable";
import * as AIE from "../lib/AsyncIterableEither";
import { simpleFaker } from "@faker-js/faker";

describe("Memory leaks", () => {
  test("run iterators with thousands of items", () => {
    let length = 0;
    function makeIterators(i: number, j: number) {
      return () => {
        if (i === 0) {
          return T.of(O.none);
        }

        i--;
        const items = simpleFaker.helpers.multiple(
          () => simpleFaker.string.uuid(),
          {
            count: {
              min: 500,
              max: j,
            },
          },
        );

        length += items.length;
        return T.of(O.some(items));
      };
    }

    const test = pipe(
      AI.makeByTask(makeIterators(1000, 1000)),
      AIE.fromAsyncIterable,
      AIE.flattenIterable,
      AIE.toArrayPar(10),
      T.map(
        expectRightEither((values) => {
          expect(values.length).toBe(length);
        }),
      ),
    );

    return test();
  });
});
