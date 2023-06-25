type Dictionary<T> = Record<string, T>;

export class MonostateDictionary {
  private static _state?: Dictionary<string>;

  /**
   * Using lazy static initialization to fix static initialization order fiasco.
   */
  private static get state(): Dictionary<string> {
    if (!MonostateDictionary._state) {
      MonostateDictionary._state = {};
    }
    return MonostateDictionary._state;
  }

  public set(key: string, value: string): void {
    MonostateDictionary.state[key] = value;
  }

  public get(key: string): string | undefined {
    return MonostateDictionary.state[key];
  }
}
