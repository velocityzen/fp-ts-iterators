import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import * as TO from "fp-ts/TaskOption";
import * as IO from "fp-ts/IO";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import * as AI from "../lib/AsyncIterable";
import * as AIE from "../lib/AsyncIterableEither";
import { expectLeftEither, expectRightEither } from "jest-fp-ts-matchers";
import {
  createTestAsyncIterable,
  createTestAsyncIterableWithError,
} from "./helpers";

describe("AsyncIterableEither", () => {
  test("tryCatchToError with no error", () => {
    const test = pipe(
      createTestAsyncIterable(),
      AIE.tryCatchToError(),
      AIE.toArraySeq(),
      T.map(
        expectRightEither((values) =>
          expect(values).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        )
      )
    );

    return test();
  });

  test("tryCatchToError with error", () => {
    const test = pipe(
      createTestAsyncIterableWithError(),
      AIE.tryCatchToError(),
      AIE.toArraySeq(),
      T.map(expectLeftEither((error) => expect(error.message).toBe("It's 5!")))
    );

    return test();
  });

  test("rightTask", () => {
    const test = pipe(
      AIE.rightTask(T.of(1)),
      AIE.toArraySeq(),
      T.map(expectRightEither((value) => expect(value).toStrictEqual([1])))
    );

    return test();
  });

  test("leftTask to Left", () => {
    const test = pipe(
      AIE.leftTask(T.of(1)),
      AIE.toArraySeq(),
      T.map(expectLeftEither((value) => expect(value).toStrictEqual(1)))
    );

    return test();
  });

  test("leftTask to Either", () => {
    const test = pipe(
      AIE.leftTask(T.of(1)),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.left(1)]))
    );

    return test();
  });

  test("rightAsyncIterable", () => {
    const test = pipe(
      AIE.rightAsyncIterable(AI.fromIterable([1, 2, 3])),
      AIE.toArraySeq(),
      T.map(
        expectRightEither((value) => expect(value).toStrictEqual([1, 2, 3]))
      )
    );

    return test();
  });

  test("leftAsyncIterable to Left", () => {
    const test = pipe(
      AIE.leftAsyncIterable(AI.fromIterable([1, 2, 3])),
      AIE.toArraySeq(),
      T.map(expectLeftEither((value) => expect(value).toStrictEqual(1)))
    );

    return test();
  });

  test("leftAsyncIterable to Either", () => {
    const test = pipe(
      AIE.leftAsyncIterable(AI.fromIterable([1, 2, 3])),
      AI.toArraySeq(),
      T.map((value) =>
        expect(value).toStrictEqual([E.left(1), E.left(2), E.left(3)])
      )
    );

    return test();
  });

  test("rightIterable", () => {
    const test = pipe(
      AIE.rightIterable([1, 2, 3]),
      AIE.toArraySeq(),
      T.map(
        expectRightEither((value) => expect(value).toStrictEqual([1, 2, 3]))
      )
    );

    return test();
  });

  test("leftIterable to Left", () => {
    const test = pipe(
      AIE.leftIterable([1, 2, 3]),
      AIE.toArraySeq(),
      T.map(expectLeftEither((value) => expect(value).toStrictEqual(1)))
    );

    return test();
  });

  test("leftIterable to Either", () => {
    const test = pipe(
      AIE.leftIterable([1, 2, 3]),
      AI.toArraySeq(),
      T.map((value) =>
        expect(value).toStrictEqual([E.left(1), E.left(2), E.left(3)])
      )
    );

    return test();
  });

  test("rightIO", () => {
    const test = pipe(
      AIE.rightIO(IO.of(1)),
      AIE.toArraySeq(),
      T.map(expectRightEither((value) => expect(value).toStrictEqual([1])))
    );

    return test();
  });

  test("leftIO", () => {
    const test = pipe(
      AIE.leftIO(IO.of(1)),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.left(1)]))
    );

    return test();
  });

  test("fromTaskEither", () => {
    const test = pipe(
      AIE.fromTaskEither(TE.of(1)),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.right(1)]))
    );

    return test();
  });

  test("fromTaskOption some", () => {
    const test = pipe(
      TO.of(1),
      AIE.fromTaskOption(() => "none"),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.right(1)]))
    );

    return test();
  });

  test("fromTaskOption none", () => {
    const test = pipe(
      TO.none,
      AIE.fromTaskOption(() => "none"),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.left("none")]))
    );

    return test();
  });

  test("fromAsyncIterableOption", () => {
    const test = pipe(
      AI.fromIterable([O.some(1), O.none, O.some(3)]),
      AIE.fromAsyncIterableOption(() => "none"),
      AI.toArraySeq(),
      T.map((value) =>
        expect(value).toStrictEqual([E.right(1), E.left("none"), E.right(3)])
      )
    );

    return test();
  });

  test("match", () => {
    const test = pipe(
      AI.fromIterable([E.right(1), E.left(2), E.right(3)]),
      AIE.match(
        () => "left",
        () => "right"
      ),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual(["right", "left", "right"]))
    );

    return test();
  });

  test("matchE", () => {
    const test = pipe(
      AI.fromIterable([E.right(1), E.left(2), E.right(3)]),
      AIE.matchE(
        () => T.of("left"),
        () => T.of("right")
      ),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual(["right", "left", "right"]))
    );

    return test();
  });

  test("getOrElse", () => {
    const test = pipe(
      AI.fromIterable([E.right(1), E.left(2), E.right(3)]),
      AIE.getOrElse(() => 100),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([1, 100, 3]))
    );

    return test();
  });

  test("fromNullable", async () => {
    const f = AIE.fromNullable("foo");

    await pipe(
      1,
      f,
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.right(1)]))
    )();

    await pipe(
      null,
      f,
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.left("foo")]))
    )();

    await pipe(
      undefined,
      f,
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.left("foo")]))
    )();
  });

  test("swap", async () => {
    await pipe(
      AIE.fromEither(E.right(1)),
      AIE.swap,
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.left(1)]))
    )();

    await pipe(
      AIE.fromEither(E.left(1)),
      AIE.swap,
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.right(1)]))
    )();
  });

  test("map", () => {
    const test = pipe(
      AI.fromIterable([E.right(1), E.left(2), E.right(3)]),
      AIE.map((i) => i * 2),
      AI.toArraySeq(),
      T.map((value) =>
        expect(value).toStrictEqual([E.right(2), E.left(2), E.right(6)])
      )
    );

    return test();
  });

  test("mapBoth", () => {
    const test = pipe(
      AI.fromIterable([E.right(1), E.left("2"), E.right(3)]),
      AIE.mapBoth(
        (s: string): number => s.length,
        (n: number): boolean => n > 2
      ),
      AI.toArraySeq(),
      T.map((value) =>
        expect(value).toStrictEqual([E.right(false), E.left(1), E.right(true)])
      )
    );

    return test();
  });

  test("mapError", () => {
    const test = pipe(
      AI.fromIterable([E.right(1), E.left("2"), E.right(3)]),
      AIE.mapError((s: string): number => s.length),
      AI.toArraySeq(),
      T.map((value) =>
        expect(value).toStrictEqual([E.right(1), E.left(1), E.right(3)])
      )
    );

    return test();
  });

  test("flatMap", () => {
    const test = pipe(
      AI.fromIterable([E.right(1), E.left("2"), E.right(3)]),
      AIE.flatMap((a) => (a < 2 ? AIE.right(a) : AIE.left("foo"))),
      AI.toArraySeq(),
      T.map((value) =>
        expect(value).toStrictEqual([E.right(1), E.left("2"), E.left("foo")])
      )
    );

    return test();
  });

  test("flatMapEither", () => {
    const test = pipe(
      AI.fromIterable([E.right("a"), E.left("b"), E.right("cc")]),
      AIE.flatMapEither((a) => E.right(a.length)),
      AI.toArraySeq(),
      T.map((value) =>
        expect(value).toStrictEqual([E.right(1), E.left("b"), E.right(2)])
      )
    );

    return test();
  });

  test("flatMapOption", () => {
    const test = pipe(
      AI.fromIterable([E.right("a"), E.left("b"), E.right("cc")]),
      AIE.flatMapOption(
        (a) => (a.length < 2 ? O.some(a.length) : O.none),
        () => "bar"
      ),
      AI.toArraySeq(),
      T.map((value) =>
        expect(value).toStrictEqual([E.right(1), E.left("b"), E.left("bar")])
      )
    );

    return test();
  });

  test("flatMapTask", () => {
    const test = pipe(
      AI.fromIterable([E.right("a"), E.left("b"), E.right("cc")]),
      AIE.flatMapTask((a) => T.of(a.length)),
      AI.toArraySeq(),
      T.map((value) =>
        expect(value).toStrictEqual([E.right(1), E.left("b"), E.right(2)])
      )
    );

    return test();
  });

  test("flatMapTaskEither", () => {
    const test = pipe(
      AI.fromIterable([E.right("a"), E.left("b"), E.right("cc")]),
      AIE.flatMapTaskEither((a) => TE.right(a.length)),
      AI.toArraySeq(),
      T.map((value) =>
        expect(value).toStrictEqual([E.right(1), E.left("b"), E.right(2)])
      )
    );

    return test();
  });

  test("flatMapTaskOption", () => {
    const test = pipe(
      AI.fromIterable([E.right("a"), E.left("b"), E.right("cc")]),
      AIE.flatMapTaskOption(
        (a) => (a.length < 2 ? TO.some(a.length) : TO.none),
        () => "bar"
      ),
      AI.toArraySeq(),
      T.map((value) =>
        expect(value).toStrictEqual([E.right(1), E.left("bar"), E.left("bar")])
      )
    );

    return test();
  });

  test("ap", () => {
    const test = pipe(
      AIE.of((n: number) => n * 2),
      AIE.ap(AIE.of(1)),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.right(2)]))
    );

    return test();
  });

  test("apFirst", () => {
    const test = pipe(
      AIE.right("a"),
      AIE.apFirst(AIE.of("b")),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.right("a")]))
    );

    return test();
  });

  test("apSecond", () => {
    const test = pipe(
      AIE.right("a"),
      AIE.apSecond(AIE.of("b")),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.right("b")]))
    );

    return test();
  });

  test("as", () => {
    const test = pipe(
      AIE.right("a"),
      AIE.as("b"),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.right("b")]))
    );

    return test();
  });

  test("asUnit", () => {
    const test = pipe(
      AIE.right("a"),
      AIE.asUnit,
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.right(undefined)]))
    );

    return test();
  });

  test("tap", () => {
    const test = pipe(
      AIE.right<string, string>("foo"),
      AIE.tap((a) => (a.length > 2 ? AIE.right(a.length) : AIE.left("foo"))),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.right("foo")]))
    );

    return test();
  });

  test("tapTask", async () => {
    const ref: Array<number> = [];
    const add = (value: number) => T.fromIO(() => ref.push(value));

    await pipe(
      AIE.of(1),
      AIE.tapTask(add),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.right(1)]))
    )();

    await pipe(
      AIE.left("error"),
      AIE.tapTask(add),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.left("error")]))
    )();

    expect(ref).toStrictEqual([1]);
  });

  test("tapIO", async () => {
    const ref: Array<number> = [];
    const add = (value: number) => () => ref.push(value);

    await pipe(
      AIE.of(1),
      AIE.tapIO(add),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.right(1)]))
    )();

    await pipe(
      AIE.left("error"),
      AIE.tapIO(add),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.left("error")]))
    )();

    expect(ref).toStrictEqual([1]);
  });

  test("tapEither", async () => {
    await pipe(
      AIE.of("a"),
      AIE.tapEither((s: string) => E.right(s.length)),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.right("a")]))
    )();

    await pipe(
      AIE.of("a"),
      AIE.tapEither((s: string) => E.left(s.length)),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.left(1)]))
    )();
  });

  test("tapError", async () => {
    const f = (e: string) =>
      e.length <= 1 ? AIE.right(true) : AIE.left(e + "!");

    await pipe(
      AIE.of(1),
      AIE.tapError(f),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.right(1)]))
    )();

    await pipe(
      AIE.left("a"),
      AIE.tapError(f),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.left("a")]))
    )();

    await pipe(
      AIE.left("aa"),
      AIE.tapError(f),
      AI.toArraySeq(),
      T.map((value) => expect(value).toStrictEqual([E.left("aa!")]))
    )();
  });
});
