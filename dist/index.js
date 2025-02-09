import blake2b from "blake2b";
import { bech32, bech32m } from "bech32";
const DATA = "asset";
export { bech32, blake2b, bech32m };
export class AssetFingerprint {
    hashBuf;
    constructor(hashBuf) {
        this.hashBuf = hashBuf;
    }
    static fromHash(hash) {
        return new AssetFingerprint(hash);
    }
    static fromParts(policyId, assetName) {
        // see https://github.com/cardano-foundation/CIPs/pull/64
        const hashBuf = blake2b(20)
            .update(new Uint8Array([...policyId, ...assetName]))
            .digest("binary");
        return AssetFingerprint.fromHash(hashBuf);
    }
    static fromBech32(fingerprint) {
        const { prefix, words } = bech32.decode(fingerprint);
        if (prefix !== DATA) {
            throw new Error("Invalid asset fingerprint");
        }
        const hashBuf = Buffer.from(bech32.fromWords(words));
        return AssetFingerprint.fromHash(hashBuf);
    }
    fingerprint() {
        const words = bech32.toWords(this.hashBuf);
        return bech32.encode(DATA, words);
    }
    hash() {
        return Buffer.from(this.hashBuf).toString("hex");
    }
    prefix() {
        return DATA;
    }
    // The last six characters of the data part form a checksum and contain no information
    checksum() {
        return this.fingerprint().slice(-6);
    }
}
//# sourceMappingURL=index.js.map