export class Singleton {
  private static instance: Singleton | null;

  public static getInstance(): Singleton {
    /**
     * Note that this implementation of the Singleton pattern is not thread-safe.
     * In a multi-threaded environment, multiple threads could call the getInstance method simultaneously,
     * resulting in multiple instances of the Singleton being created.
     * However, in JavaScript, this is not a concern because JavaScript is single-threaded.
     */
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  public doSomething(): void {
    console.log("Doing something...");
  }
}
