import blake2b from "blake2b";
import type { Ctx, Blake2b } from "blake2b";
import { bech32, BechLib, Decoded, bech32m } from "bech32";
export { bech32, blake2b, type BechLib, type Decoded, type Ctx, type Blake2b, bech32m };
export declare class AssetFingerprint {
    readonly hashBuf: Uint8Array;
    private constructor();
    static fromHash(hash: Uint8Array): AssetFingerprint;
    static fromParts(policyId: Uint8Array, assetName: Uint8Array): AssetFingerprint;
    static fromBech32(fingerprint: string): AssetFingerprint;
    fingerprint(): string;
    hash(): string;
    prefix(): string;
    checksum(): string;
}
