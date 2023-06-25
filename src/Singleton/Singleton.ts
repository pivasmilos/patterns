/**
 * Take care because Singleton can usually be an anti-pattern.
 */

export class Singleton {
  private static instance: Singleton | null;
  private static readonly data = "some data";

  private constructor() {
    // prevent construction
  }

  public static getInstance(): Singleton {
    /**
     * Note that this implementation of the Singleton pattern would not be thread-safe.
     * In a multi-threaded environment, multiple threads could call the getInstance method simultaneously,
     * resulting in multiple instances of the Singleton being created.
     * However, in JavaScript, this is not a concern because JavaScript is single-threaded.
     */
    return (Singleton.instance ??= new Singleton());
  }

  public doSomething(): void {
    console.log("Doing something...");
  }

  public get data(): string {
    return Singleton.data;
  }
}
