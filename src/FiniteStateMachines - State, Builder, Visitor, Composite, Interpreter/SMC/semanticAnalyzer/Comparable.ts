export interface Comparable<T> {
  equals(obj: T): boolean;
  compareTo(s: T): number;
}
