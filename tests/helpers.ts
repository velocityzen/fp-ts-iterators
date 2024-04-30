import { setTimeout } from "node:timers/promises";

export function createTestAsyncIterable(delay?: (i: number) => number) {
  return {
    i: -1,
    async *[Symbol.asyncIterator]() {
      const i = ++this.i;

      if (i < 10) {
        if (delay) {
          await setTimeout(delay(i));
        }
        yield i;
      }
    },
  };
}

export function createTestAsyncIterableWithError() {
  return {
    i: -1,
    async *[Symbol.asyncIterator]() {
      const i = ++this.i;

      if (i === 5) {
        throw new Error("It's 5!");
      }

      if (i < 10) {
        yield i;
      }
    },
  };
}
