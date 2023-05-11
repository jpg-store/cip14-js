import blake2b from "blake2b";
import type { Ctx, Blake2b } from "blake2b";
import { bech32, BechLib, Decoded, bech32m } from "bech32";

const DATA = "asset";

export {
  bech32,
  blake2b,
  type BechLib,
  type Decoded,
  type Ctx,
  type Blake2b,
  bech32m
};

export class AssetFingerprint {
  readonly hashBuf: Uint8Array;

  private constructor(hashBuf: Uint8Array) {
    this.hashBuf = hashBuf;
  }

  static fromHash(hash: Uint8Array): AssetFingerprint {
    return new AssetFingerprint(hash);
  }

  static fromParts(
    policyId: Uint8Array,
    assetName: Uint8Array
  ): AssetFingerprint {
    // see https://github.com/cardano-foundation/CIPs/pull/64
    const hashBuf = blake2b(20)
      .update(new Uint8Array([...policyId, ...assetName]))
      .digest("binary");

    return AssetFingerprint.fromHash(hashBuf);
  }

  static fromBech32(fingerprint: string): AssetFingerprint {
    const { prefix, words } = bech32.decode(fingerprint);
    if (prefix !== DATA) {
      throw new Error("Invalid asset fingerprint");
    }

    const hashBuf = Buffer.from(bech32.fromWords(words));
    return AssetFingerprint.fromHash(hashBuf);
  }

  fingerprint(): string {
    const words = bech32.toWords(this.hashBuf);
    return bech32.encode(DATA, words);
  }

  hash(): string {
    return Buffer.from(this.hashBuf).toString("hex");
  }

  prefix(): string {
    return DATA;
  }

  // The last six characters of the data part form a checksum and contain no information
  checksum(): string {
    return this.fingerprint().slice(-6);
  }
}
