export declare enum SignatureStatus {
    Valid = 0,
    UnknownError = 1,
    NotSigned = 2,
    HashMismatch = 3,
    NotTrusted = 4,
    NotSupportedFileFormat = 5,
    Incompatible = 6
}
export declare enum SignatureType {
    None = 0,
    Authenticode = 1,
    Catalog = 2
}
export interface SignerCertificate {
    Subject: string;
}
export interface BaseSignature {
    IsOSBinary: unknown;
    Path: string;
    SignatureType: SignatureType;
    SignerCertificate: unknown;
    Status: SignatureStatus;
    StatusMessage: string;
    TimeStamperCertificate: unknown;
}
declare const statusWithSignature: readonly [SignatureStatus.Valid, SignatureStatus.HashMismatch, SignatureStatus.NotTrusted];
export interface PresentSignature extends BaseSignature {
    Status: typeof statusWithSignature[number];
    SignerCertificate: SignerCertificate;
}
export declare type Signature = BaseSignature | PresentSignature;
export interface SignatureSummary {
    status: string;
    type: string;
    subject: string | null;
}
export declare function getAuthenticode(path: string): Promise<Signature>;
export declare function summary(signature: Signature): SignatureSummary;
export {};
