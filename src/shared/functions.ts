export const getRandomInt = (): number => Math.floor(Math.random() * 1_000_000_000_000);

export const toPostgresColumnStatement = (toReduce: Array<any>): string =>
  toReduce
    .reduce(
      (acc, current, index, arr) => `${acc} ${current}${index === arr.length - 1 ? '' : ','}`,
      ''
    )
    .trim();

export const toPostgresValuesStatement = (toReduce: Array<any>): string =>
  toReduce
    .reduce(
      (acc, _, index, arr) => `${acc} $${index + 1}${index === arr.length - 1 ? '' : ','}`,
      ''
    )
    .trim();
