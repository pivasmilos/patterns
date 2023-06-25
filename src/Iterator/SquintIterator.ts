export function* integers(): IterableIterator<number> {
  let i = 1;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    yield i++;
  }
}

export function* squares(ints: IterableIterator<number>): IterableIterator<number> {
  for (const i of ints) {
    yield i * i;
  }
}

export function take<T>(n: number, iter: IterableIterator<T>): T[] {
  const result: T[] = [];
  for (let i = 0; i < n; i++) {
    const { value, done } = iter.next();
    if (done) {
      break;
    }
    result.push(value);
  }
  return result;
}
