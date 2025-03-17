import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { identity, pipe } from "fp-ts/function";
import * as N from "fp-ts/number";
import * as O from "fp-ts/Option";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import * as TO from "fp-ts/TaskOption";
import { describe, expect, test } from "vitest";
import * as AI from "../lib/AsyncIterable";
import * as AIE from "../lib/AsyncIterableEither";
import * as AIO from "../lib/AsyncIterableOption";
import { createTestAsyncIterable } from "./helpers";

describe("AsyncIterableOptions", () => {
  test("tryCatch with no error", () => {
    const test = pipe(
      createTestAsyncIterable(),
      AIO.tryCatch,
      AIO.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      }),
    );

    return test();
  });

  test("tryCatch with error", async () => {
    const make = (i: number) => {
      if (i === 3) {
        throw new Error("It's 3!");
      }

      return i < 5 ? O.some(i) : O.none;
    };

    await pipe(
      AI.makeByWithIndex(make),
      AIO.tryCatch,
      AIO.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([0, 1, 2]);
      }),
    )();

    await pipe(
      AI.makeByWithIndex(make),
      AIO.tryCatch,
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([
          O.some(0),
          O.some(1),
          O.some(2),
          O.none,
          O.some(4),
        ]);
      }),
    )();
  });

  test("map", () => {
    const test = pipe(
      AIO.fromIterable([1, 2]),
      AIO.map((i) => i * 2),
      AIO.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([2, 4]);
      }),
    );

    return test();
  });

  test("ap", async () => {
    await pipe(
      AIO.some((i: number) => i * 2),
      AIO.ap(AIO.some(2)),
      AIO.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([4]);
      }),
    )();

    await pipe(
      AIO.some((i: number) => i * 2),
      AIO.ap(AIO.none()),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.none]);
      }),
    )();
  });

  test("apFirst", () => {
    const test = pipe(
      AIO.some("a"),
      AIO.apFirst(AIO.of("b")),
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([O.some("a")]);
      }),
    );

    return test();
  });

  test("apSecond", () => {
    const test = pipe(
      AIO.some("a"),
      AIO.apSecond(AIO.of("b")),
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([O.some("b")]);
      }),
    );

    return test();
  });

  test("flatMap", async () => {
    await pipe(
      AI.fromIterable([O.some(1), O.none]),
      AIO.flatMap((n) => AIO.some(n * 2)),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.some(2), O.none]);
      }),
    )();

    await pipe(
      AI.fromIterable([O.some(1), O.none]),
      AIO.flatMap(() => AIO.none()),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.none, O.none]);
      }),
    )();

    await pipe(
      AI.fromIterable([O.some(1), O.none, O.some(2)]),
      AIO.flatMap((n) => (n < 2 ? AIO.none() : AIO.some(n))),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.none, O.none, O.some(2)]);
      }),
    )();
  });

  test("flatMapIterable / empty item / par", () => {
    const start = [O.some([1, 2]), O.none, O.some([]), O.some([4, 5])];

    const test = pipe(
      AI.fromIterable(start),
      AIO.flatMapIterable(identity),
      AI.toArrayPar(10),
      T.map((value) => {
        expect(value.length).toBe(5);

        expect(value.filter(O.isNone).length).toStrictEqual(1);

        const m = A.getDifferenceMagma(N.Eq);
        const d = m.concat(A.compact(value), [1, 2, 4, 5]);
        expect(d).toStrictEqual([]);
      }),
    );

    return test();
  });

  test("flatMapTask", () => {
    const test = pipe(
      AI.fromIterable([O.some(1), O.none, O.some(3)]),
      AIO.flatMapTask((i) => T.of(i * 2)),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.some(2), O.none, O.some(6)]);
      }),
    );

    return test();
  });

  test("flatMapTaskOption", () => {
    const test = pipe(
      AIO.fromIterable([1, 2]),
      AIO.flatMapTaskOption((i) => TO.of(i * 2)),
      AIO.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([2, 4]);
      }),
    );

    return test();
  });

  test("flatMapTaskEither", () => {
    const test = pipe(
      AIO.fromIterable([1, 2]),
      AIO.flatMapTaskEither((i) => TE.of(i * 2)),
      AIO.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([2, 4]);
      }),
    );

    return test();
  });

  test("zero", async () => {
    await pipe(
      AIO.zero(),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.none]);
      }),
    )();

    await pipe(
      AIO.zero(),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.none]);
      }),
    )();
  });

  test("fromIterable", () => {
    const test = pipe(
      AIO.fromIterable([0, 1, 2, 3, 4]),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([
          O.some(0),
          O.some(1),
          O.some(2),
          O.some(3),
          O.some(4),
        ]);
      }),
    );

    return test();
  });

  test("fromAsyncIterable", () => {
    const test = pipe(
      AI.fromIterable([0, 1, 2, 3, 4]),
      AIO.fromAsyncIterable,
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([
          O.some(0),
          O.some(1),
          O.some(2),
          O.some(3),
          O.some(4),
        ]);
      }),
    );

    return test();
  });

  test("fromAsyncIterableEither", () => {
    const test = pipe(
      AI.fromIterable([0, 1, 2, 3, 4]),
      AIE.fromAsyncIterable,
      AIO.fromAsyncIterableEither,
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([
          O.some(0),
          O.some(1),
          O.some(2),
          O.some(3),
          O.some(4),
        ]);
      }),
    );

    return test();
  });

  test("fromPredicate", async () => {
    const p = (n: number): boolean => n > 2;

    await pipe(
      1,
      AIO.fromPredicate(p),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.none]);
      }),
    )();

    await pipe(
      3,
      AIO.fromPredicate(p),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.some(3)]);
      }),
    )();
  });

  test("fromOption", async () => {
    await pipe(
      AIO.fromOption(O.none),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.none]);
      }),
    )();

    await pipe(
      AIO.fromOption(O.some(3)),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.some(3)]);
      }),
    )();
  });

  test("fromEither", async () => {
    await pipe(
      AIO.fromEither(E.left(1)),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.none]);
      }),
    )();

    await pipe(
      AIO.fromEither(E.right(3)),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.some(3)]);
      }),
    )();
  });

  test("fromIO", async () => {
    const test = pipe(
      AIO.fromIO(() => 1),
      AIO.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([1]);
      }),
    );

    return test();
  });

  test("fromTask", () => {
    const test = pipe(
      AIO.fromTask(T.of(1)),
      AIO.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([1]);
      }),
    );

    return test();
  });

  test("fromTaskOption", async () => {
    await pipe(
      AIO.fromTaskOption(T.of(O.none)),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.none]);
      }),
    )();

    await pipe(
      AIO.fromTaskOption(T.of(O.some(1))),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.some(1)]);
      }),
    )();
  });

  test("fromTaskEither", async () => {
    await pipe(
      AIO.fromTaskEither(TE.left(1)),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.none]);
      }),
    )();

    await pipe(
      AIO.fromTaskEither(TE.right(3)),
      AI.toArraySeq(),
      T.map((values) => {
        expect(values).toStrictEqual([O.some(3)]);
      }),
    )();
  });

  test("match", () => {
    const test = pipe(
      AI.fromIterable([O.some(1), O.none, O.some(3)]),
      AIO.match(
        () => "none",
        (i) => `some${i}`,
      ),
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual(["some1", "none", "some3"]);
      }),
    );

    return test();
  });

  test("matchE", () => {
    const test = pipe(
      AI.fromIterable([O.some(1), O.none, O.some(3)]),
      AIO.matchE(
        () => T.of("none"),
        (i) => T.of(`some${i}`),
      ),
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual(["some1", "none", "some3"]);
      }),
    );

    return test();
  });

  test("getOrElse", () => {
    const test = pipe(
      AI.fromIterable([O.some(1), O.none, O.some(3)]),
      AIO.getOrElse(() => 100),
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([1, 100, 3]);
      }),
    );

    return test();
  });

  test("fromNullable", async () => {
    await pipe(
      1,
      AIO.fromNullable,
      AIO.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([1]);
      }),
    )();

    await pipe(
      null,
      AIO.fromNullable,
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([O.none]);
      }),
    )();

    await pipe(
      undefined,
      AIO.fromNullable,
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([O.none]);
      }),
    )();
  });

  test("as", () => {
    const test = pipe(
      AIO.some("a"),
      AIO.as("b"),
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([O.some("b")]);
      }),
    );

    return test();
  });

  test("asUnit", () => {
    const test = pipe(
      AIO.some("a"),
      AIO.asUnit,
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([O.some(undefined)]);
      }),
    );

    return test();
  });

  test("tap", () => {
    const test = pipe(
      AI.fromIterable([O.some(1), O.none, O.some(3)]),
      AIO.tap((a) => (a > 1 ? AIO.some(a * 2) : AIO.none())),
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([O.none, O.none, O.some(3)]);
      }),
    );

    return test();
  });

  test("tapIO", () => {
    const test = pipe(
      AI.fromIterable([O.some("foo"), O.none, O.some("bar")]),
      AIO.tapIO((a) => () => (a.length > 2 ? AIO.some(a.length) : AIO.none())),
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([O.some("foo"), O.none, O.some("bar")]);
      }),
    );

    return test();
  });

  test("tapTask", async () => {
    const ref: Array<number> = [];
    const add = (value: number) => T.fromIO(() => ref.push(value));

    await pipe(
      AIO.of(1),
      AIO.tapTask(add),
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([O.some(1)]);
      }),
    )();

    await pipe(
      AIO.none(),
      AIO.tapTask(add),
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([O.none]);
      }),
    )();

    expect(ref).toStrictEqual([1]);
  });

  test("tapTaskOption", async () => {
    const ref: Array<number> = [];
    const add = (value: number) =>
      T.fromIO(() => (value < 2 ? O.none : O.some(ref.push(value))));

    await pipe(
      AI.fromIterable([O.some(1), O.none, O.some(3)]),
      AIO.tapTaskOption(add),
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([O.none, O.none, O.some(3)]);
      }),
    )();

    expect(ref).toStrictEqual([3]);
  });

  test("tapTaskEither", async () => {
    const ref: Array<number> = [];
    const add = (value: number) =>
      T.fromIO(() => (value < 2 ? E.left("left") : E.right(ref.push(value))));

    await pipe(
      AI.fromIterable([O.some(1), O.none, O.some(3)]),
      AIO.tapTaskEither(add),
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([O.none, O.none, O.some(3)]);
      }),
    )();

    expect(ref).toStrictEqual([3]);
  });

  test("compact", () => {
    const test = pipe(
      AIO.fromIterable([O.some(1), O.none, O.some(3)]),
      AIO.compact,
      AI.toArraySeq(),
      T.map((value) => {
        expect(value).toStrictEqual([O.some(1), O.none, O.some(3)]);
      }),
    );

    return test();
  });

  test("filter", async () => {
    const g = (n: number) => n % 2 === 1;
    const values = await pipe(
      AIO.fromIterable([1, 2, 3]),
      AIO.filter(g),
      AI.toArraySeq(),
    )();

    expect(values).toStrictEqual([O.some(1), O.none, O.some(3)]);
  });
});
