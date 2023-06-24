import {
  Assembly,
  PiecePart,
  createPartWithExtension,
  PiecePartExplosionExtension,
  AssemblyExplosionExtension,
  PiecePartCromulentExtension,
  AssemblyCromulentExtension,
} from "./PartExtension";

describe("PartExtension extension objects", () => {
  describe("createPartWithExtension", () => {
    it("should create a PiecePart with a PiecePartExplosionExtension when extensionType is 'explosion'", () => {
      const piecePart = createPartWithExtension("piece", "Bolt", 0.5, "explosion");

      const piecePartExplosionExtension = piecePart.partExtensionsMap["explosion"];

      expect(piecePart).toBeInstanceOf(PiecePart);
      expect(piecePartExplosionExtension).toBeInstanceOf(PiecePartExplosionExtension);
      if (!(piecePartExplosionExtension instanceof PiecePartExplosionExtension)) {
        // always true if the previous expect passed, but TypeScript doesn't know that
        return;
      }
      expect(piecePartExplosionExtension.createExplosionReport()).toEqual(
        "Piece explosion report: Bolt. For part piece at $0.5"
      );
    });

    it("should create an Assembly with an AssemblyExplosionExtension when extensionType is 'explosion'", () => {
      const part1 = createPartWithExtension("piece", "Bolt", 0.5, "explosion");
      const part2 = createPartWithExtension("piece", "Nut", 0.3, "explosion");
      const assembly = createPartWithExtension("assembly", "Bolt and Nut Assembly", 0.8, "explosion") as Assembly;
      assembly.parts = [part1, part2];

      const assemblyExplosionExtension = assembly.partExtensionsMap["explosion"];

      expect(assembly).toBeInstanceOf(Assembly);
      expect(assemblyExplosionExtension).toBeInstanceOf(AssemblyExplosionExtension);
      if (!(assemblyExplosionExtension instanceof AssemblyExplosionExtension)) {
        // always true if the previous expect passed, but TypeScript doesn't know that
        return;
      }
      expect(assemblyExplosionExtension.createExplosionReport()).toEqual(
        "Explosion report for assembly: Bolt and Nut Assembly.\n" + //
          "Piece explosion report: Bolt. For part piece at $0.5\n" +
          "Piece explosion report: Nut. For part piece at $0.3"
      );
    });

    it("should create a PiecePart with a PiecePartCromulentExtension when extensionType is 'cromulent'", () => {
      const piecePart = createPartWithExtension("piece", "Bolt", 0.5, "cromulent");

      const piecePartCromulentExtension = piecePart.partExtensionsMap["cromulent"];

      expect(piecePart).toBeInstanceOf(PiecePart);
      expect(piecePartCromulentExtension).toBeInstanceOf(PiecePartCromulentExtension);
      if (!(piecePartCromulentExtension instanceof PiecePartCromulentExtension)) {
        // always true if the previous expect passed, but TypeScript doesn't know that
        return;
      }
      expect(piecePartCromulentExtension.cromulentize()).toEqual("Cromulent piece named Bolt");
    });

    it("should create an Assembly with an AssemblyCromulentExtension when extensionType is 'cromulent'", () => {
      const part1 = createPartWithExtension("piece", "Bolt", 0.5, "cromulent");
      const part2 = createPartWithExtension("piece", "Nut", 0.3, "cromulent");
      const assembly = createPartWithExtension("assembly", "Bolt and Nut Assembly", 0.8, "cromulent") as Assembly;
      assembly.parts = [part1, part2];

      const assemblyCromulentExtension = assembly.partExtensionsMap["cromulent"];

      expect(assembly).toBeInstanceOf(Assembly);
      expect(assemblyCromulentExtension).toBeInstanceOf(AssemblyCromulentExtension);

      if (!(assemblyCromulentExtension instanceof AssemblyCromulentExtension)) {
        // always true if the previous expect passed, but TypeScript doesn't know that
        return;
      }

      expect(assemblyCromulentExtension.cromulentize()).toEqual(
        "Cromulent assembly: Bolt and Nut Assembly.\n" + //
          "Cromulent piece named Bolt\n" +
          "Cromulent piece named Nut"
      );
    });

    it("should throw an error for an unknown extension type", () => {
      expect(() => createPartWithExtension("piece", "Bolt", 0.5, "unknown")).toThrow("Unknown extension type");
    });
  });
});
