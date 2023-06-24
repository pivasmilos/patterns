export interface LawnmowerSeriesData {
  id: string;
  model: string;
  manufacturer: string;
  weight: number;
  price: number;
  picture: string; // Base64-encoded JPEG image
}

export class FlyweightLawnmowerSeries {
  private data: LawnmowerSeriesData;

  constructor(id: string, model: string, manufacturer: string, weight: number, price: number, picture: string) {
    this.data = { id, model, manufacturer, weight, price, picture };
  }

  public getData(): LawnmowerSeriesData {
    return this.data;
  }
}

export class Lawnmower {
  constructor(private readonly serialNumber: string, private readonly series: FlyweightLawnmowerSeries) {}

  public getSerialNumber(): string {
    return this.serialNumber;
  }

  public getManufacturer(): string {
    return this.series.getData().manufacturer;
  }

  public getModel(): string {
    return this.series.getData().model;
  }

  public getWeight(): number {
    return this.series.getData().weight;
  }

  public getPrice(): number {
    return this.series.getData().price;
  }

  public getPicture(): string {
    return this.series.getData().picture;
  }
}

export class LawnmowerStore {
  // we could store a million lawnmowers in this store and it would only take up a few megabytes of memory
  // (unless they are all of different series)
  private serialNumbers = new Set<string>();
  private seriesMap = new Map<string, FlyweightLawnmowerSeries>();

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
    this.seriesMap.set(seriesID, new FlyweightLawnmowerSeries(seriesID, model, manufacturer, weight, price, picture));
  }
}
