---
title: Introduction
permalink: /
nav_order: 1
has_children: false
has_toc: false
---

# Iterable with fp-ts

- [Generator](https://velocityzen.github.io/fp-ts-iterators/modules/Generator.ts.html)
- [Iterable](https://velocityzen.github.io/fp-ts-iterators/modules/Iterable.ts.html)

# AsyncIterable with fp-ts

- [AsyncGenerator](https://velocityzen.github.io/fp-ts-iterators/modules/AsyncGenerator.ts.html)
- [AsyncIterable](https://velocityzen.github.io/fp-ts-iterators/modules/AsyncIterable.ts.html)
- [AsyncIterableEither](https://velocityzen.github.io/fp-ts-iterators/modules/AsyncIterableEither.ts.html)
- [AsyncIterableOption](https://velocityzen.github.io/fp-ts-iterators/modules/AsyncIterableOption.ts.html)

# Usage

All Iterables are lazy and to make them "run" they have to be pulled. For example you can use:

```ts
import { AsyncIterable as AI } from "fp-ts-iterators";
import { pipe } from "fp-ts/function";

const task = pipe(AI.fromIterable([1, 2, 3, 4]), AI.toArraySeq());
const values = await task(); // [1, 2, 3, 4]
```
