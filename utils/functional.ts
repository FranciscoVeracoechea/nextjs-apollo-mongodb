// functional programming styleds functions

//types
export type Cases = Object & {
  readonly [key: string]: unknown;
}
export type SwitchCase = (cases: Cases) => (defaultCase: unknown) =>
    (key: string) => unknown;
export type KeyValueArray = readonly [string, unknown];
// export type ArrayToObjectFn = (acc: Iterable<Object>, current: Tuple) => Object;

// FUNCTIONS COMPOSERS
// pipe
export const pipe = (...fns: ReadonlyArray<Function>) => (...args: ReadonlyArray<unknown>) => fns.reduce(
  (res, fn) => [fn.call(null, ...res)], args
)[0];
// compose (inversed pipe)
export const compose = (...fns: ReadonlyArray<Function>) => (...args: ReadonlyArray<unknown>) => fns.reduceRight(
  (res, fn) => [fn.call(null, ...res)], args
)[0];

// ------------------------------------------------------
// VALIDATIONS
export type Validation = (value: unknown) => boolean;
export const isArray: Validation = variable => (Boolean(variable) && variable instanceof Array);

export const isDefined: Validation = value => (value !== false && typeof value !== 'undefined' && value !== null && value !== 0);

export const isFunction: Validation = variable => typeof variable === 'function';

export const isObject: Validation = variable => (isDefined(variable) && typeof variable === 'object');

export const isFloat = (n: number) => (n % 1 !== 0);

export const isFirstRender = (items: readonly unknown[]) => (items && items.length === 0) || !isDefined(items);

export const executeIfFunction = (f: unknown, ...params: ReadonlyArray<unknown>): unknown => (
  (f instanceof Function) ? f(...params) : f
);

export const isString: Validation = str => (typeof str === 'string');
// ------------------------------------------------------
// switch case
export const switchCase: SwitchCase = cases => defaultCase => key => executeIfFunction(
  Object.prototype.hasOwnProperty.call(cases, key) ? cases[key] : defaultCase
);

// --------- TIMERS
// Timeout
export const timeout = (millisecons: number, func: Function) => {
  const id = setTimeout(func, millisecons);
  return () => clearTimeout(id);
};
// Interval
export const interval = (millisecons: number, func: Function) => {
  const id = setInterval(func, millisecons);
  return () => clearInterval(id);
};

// ---------- PARSERS
// value to number
export const numberParser = (value: unknown) => (Number.isNaN(Number(value)) ? value : Number(value));
// object keys to number
export const mapToNumber = (object: Object) => Object.entries(object).reduce(
  (acc, current) => ({ ...acc, [current[0]]: numberParser(current[1]) }),
  {}
);

export const clamp = (
  number: number, lower: number, upper: number
) => Math.max(lower, Math.min(upper, number));

export const arrayToObject = (acc: any, current: any) => ({
  ...acc,
  [current[0]]: numberParser(current[1]),
});
export const objectFromEntries = (array: readonly unknown[]) => array.reduce(arrayToObject, {});

// map form inputs with name and values to object
export const serialezeForm = (formElement: Iterable<HTMLFormElement>) => [...formElement]
  .filter(element => (element.value && element.name))
  .map(input => [input.name, input.value])
  .reduce(arrayToObject, {});

// match media
export const match = (media: string) => window.matchMedia(media);

// string capitalizer
export const capitalizer = (string: string, spliter = ' ', joiner = ' ') => string.split(spliter).map(
  word => word.split('').map(
    (char, i) => (i === 0 ? char.toUpperCase() : char.toLowerCase())
  ).join('')
).join(joiner);

export const slugify = (text: string) => text.toLowerCase()
  .trim()
  .replace(/\s+/g, '-')           // Replace spaces with -
  .replace(/&/g, '-and-')         // Replace & with 'and'
  .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
  .replace(/\-\-+/g, '-')         // Replace multiple - with single -

export const isEmail = (email: string) => {
  /* eslint-disable */
  const validator = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return validator.test(email);
  /* eslint-enable */
};

export const throwError = (e: Error | string) => {
  throw e;
};


export const classList = (
  ...strArray: readonly string[]
) => strArray.reduce((acc, current) => `${acc} ${current}`, '');
