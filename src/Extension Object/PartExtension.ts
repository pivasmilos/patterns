export interface ProductCatalog {
  products: Product[];
}

export interface Product {
  parts: Part[];
}

export interface PartExtension {
  extensionType: string;
}

export interface Part {
  name: string;
  price: number;
  partExtensionsMap: Record<string, PartExtension>;
}

export class PiecePart implements Part {
  constructor(
    public pieceType: string,
    public name: string,
    public price: number,
    public partExtensionsMap: Record<string, PartExtension>
  ) {}
}

export class Assembly implements Part {
  constructor(
    public parts: Part[],
    public name: string,
    public price: number,
    public partExtensionsMap: Record<string, PartExtension>
  ) {}
}

export interface PartExplosionExtension extends PartExtension {
  createExplosionReport(): string;
}

export class PiecePartExplosionExtension implements PartExplosionExtension {
  public extensionType = "explosion";

  constructor(private readonly piecePart: PiecePart) {}

  createExplosionReport(): string {
    return `Piece explosion report: ${this.piecePart.name}. For part ${this.piecePart.pieceType} at $${this.piecePart.price}`;
  }
}

export class AssemblyExplosionExtension implements PartExplosionExtension {
  public extensionType = "explosion";

  constructor(private readonly assembly: Assembly) {}

  createExplosionReport(): string {
    return `Explosion report for assembly: ${this.assembly.name}.\n${this.getPartsExplosion()}`;
  }

  private getPartsExplosion(): string {
    return this.assembly.parts
      .map((p) => {
        const explosionExtension = p.partExtensionsMap["explosion"];

        if (!explosionExtension) {
          throw new Error("Part does not have an explosion extension");
        }

        if (
          !(explosionExtension instanceof PiecePartExplosionExtension) &&
          !(explosionExtension instanceof AssemblyExplosionExtension)
        ) {
          throw new Error("Part extension is not an explosion extension");
        }

        return explosionExtension.createExplosionReport();
      })
      .join("\n");
  }
}

export interface PartCromulentExtension extends PartExtension {
  cromulentize(): string;
}

export class PiecePartCromulentExtension implements PartCromulentExtension {
  public extensionType = "cromulent";
  constructor(private readonly piecePart: PiecePart) {}

  cromulentize(): string {
    return `Cromulent piece named ${this.piecePart.name}`;
  }
}

export class AssemblyCromulentExtension implements PartCromulentExtension {
  public extensionType = "cromulent";
  constructor(private readonly assembly: Assembly) {}

  cromulentize(): string {
    return `Cromulent assembly: ${this.assembly.name}.\n${this.getPartsCromulentized()}`;
  }

  private getPartsCromulentized(): string {
    return this.assembly.parts
      .map((p) => {
        const explosionExtension = p.partExtensionsMap["cromulent"];

        if (!explosionExtension) {
          throw new Error("Part does not have a cromulent extension");
        }

        if (
          !(explosionExtension instanceof PiecePartCromulentExtension) &&
          !(explosionExtension instanceof AssemblyCromulentExtension)
        ) {
          throw new Error("Part extension is not a cromulent extension");
        }

        return explosionExtension.cromulentize();
      })
      .join("\n");
  }
}

// essentially a PartExtension factory
export function createPartExtension(
  part: Part,
  extensionType: string
): PartExplosionExtension | PartCromulentExtension {
  if (extensionType === "explosion") {
    if (part instanceof PiecePart) {
      return new PiecePartExplosionExtension(part);
    } else if (part instanceof Assembly) {
      return new AssemblyExplosionExtension(part);
    }
  } else if (extensionType === "cromulent") {
    if (part instanceof PiecePart) {
      return new PiecePartCromulentExtension(part);
    } else if (part instanceof Assembly) {
      return new AssemblyCromulentExtension(part);
    }
  }

  throw new Error("Unknown extension type");
}

// essentially a Part factory
export function createPartWithExtension(
  partType: "piece" | "assembly",
  name: string,
  price: number,
  extensionType: string
): Part {
  const part = partType === "piece" ? new PiecePart(partType, name, price, {}) : new Assembly([], name, price, {});
  part.partExtensionsMap[extensionType] = createPartExtension(part, extensionType);
  return part;
}
