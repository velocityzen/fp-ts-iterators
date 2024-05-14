---
title: Modules
has_children: true
permalink: /docs/modules
nav_order: 2
---

## Installation

To install the stable version:

```
npm install fp-ts fp-ts-iterators
```

`fp-ts` is a peer dependency. Make sure to always have a single version of `fp-ts` installed in your project. Multiple versions are known to cause `tsc` to hang during compilation. You can check the versions currently installed using `npm ls fp-ts` (make sure there's a single version and all the others are marked as `deduped`).

# Iterable with fp-ts

- [Generator](https://velocityzen.github.io/fp-ts-iterators/modules/Generator.ts.html)
- [Iterable](https://velocityzen.github.io/fp-ts-iterators/modules/Iterable.ts.html)

# AsyncIterable with fp-ts

- [AsyncGenerator](https://velocityzen.github.io/fp-ts-iterators/modules/AsyncGenerator.ts.html)
- [AsyncIterable](https://velocityzen.github.io/fp-ts-iterators/modules/AsyncIterable.ts.html)
- [AsyncIterableEither](https://velocityzen.github.io/fp-ts-iterators/modules/AsyncIterableEither.ts.html)
- [AsyncIterableOption](https://velocityzen.github.io/fp-ts-iterators/modules/AsyncIterableOption.ts.html)
