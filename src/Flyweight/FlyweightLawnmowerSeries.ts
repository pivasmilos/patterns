export interface LawnmowerSeriesData {
  id: string;
  model: string;
  manufacturer: string;
  weight: number;
  price: number;
  picture: string; // Base64-encoded JPEG image
}

export class FlyweightLawnmowerSeries {
  constructor(private readonly data: LawnmowerSeriesData) {}

  public getData(): LawnmowerSeriesData {
    return this.data;
  }
}

export class Lawnmower {
  constructor(private readonly _serialNumber: string, private readonly series: FlyweightLawnmowerSeries) {}

  public get serialNumber(): string {
    return this._serialNumber;
  }

  public get manufacturer(): string {
    return this.series.getData().manufacturer;
  }

  public get model(): string {
    return this.series.getData().model;
  }

  public get weight(): number {
    return this.series.getData().weight;
  }

  public get price(): number {
    return this.series.getData().price;
  }

  public get picture(): string {
    return this.series.getData().picture;
  }
}

export class LawnmowerStore {
  // we could store a million lawnmowers in this store and it would only take up a few megabytes of memory
  // (unless they are all of different series)
  private readonly serialNumbers = new Set<string>();
  private readonly seriesMap = new Map<string, FlyweightLawnmowerSeries>();

  public getLawnmower(serialNumber: string, seriesID: string): Lawnmower | undefined {
    if (!this.serialNumbers.has(serialNumber)) {
      return undefined;
    }

    const series = this.seriesMap.get(seriesID);

    if (!series) {
      return undefined;
    }

    return new Lawnmower(serialNumber, series);
  }

  public setLawnmower(
    serialNumber: string,
    seriesID: string,
    model: string,
    manufacturer: string,
    weight: number,
    price: number,
    picture: string
  ): void {
    this.serialNumbers.add(serialNumber);
    this.seriesMap.set(
      seriesID,
      new FlyweightLawnmowerSeries({ id: seriesID, model, manufacturer, weight, price, picture })
    );
  }
}
