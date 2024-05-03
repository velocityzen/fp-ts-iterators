/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-unsafe-return */
/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  prefer-rest-params */

// NOTE! Bellow code comes from fp-ts internals

/** @internal */
export const dual: {
  <
    DataLast extends (...args: Array<any>) => any,
    DataFirst extends (...args: Array<any>) => any
  >(
    // arity: Parameters<DataFirst>["length"],
    arity: number,
    body: DataFirst
  ): DataLast & DataFirst;
  <
    DataLast extends (...args: Array<any>) => any,
    DataFirst extends (...args: Array<any>) => any
  >(
    isDataFirst: (args: IArguments) => boolean,
    body: DataFirst
  ): DataLast & DataFirst;
} = (arity: any, body: any) => {
  const isDataFirst: (args: IArguments) => boolean =
    typeof arity === "number" ? (args) => args.length >= arity : arity;

  return function (this: any) {
    const args = Array.from(arguments);
    if (isDataFirst(arguments)) {
      return body.apply(this, args);
    }

    return (self: any) => body(self, ...args);
  };
};
