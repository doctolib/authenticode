import { promisify } from 'util'
import { execFile } from 'child_process'

// https://docs.microsoft.com/en-us/dotnet/api/system.management.automation.signaturestatus
export enum SignatureStatus {
  Valid = 0,
  UnknownError = 1,
  NotSigned = 2,
  HashMismatch = 3,
  NotTrusted = 4,
  NotSupportedFileFormat = 5,
  Incompatible = 6,
}

export enum SignatureType {
  None = 0,
  Authenticode = 1,
  Catalog = 2,
}

// https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.x509certificates.x509certificate2?redirectedfrom=MSDN&view=netcore-3.1
export interface SignerCertificate {
  Subject: string
}

// https://docs.microsoft.com/en-us/dotnet/api/system.management.automation.signature
export interface BaseSignature {
  IsOSBinary: unknown
  Path: string
  SignatureType: SignatureType
  SignerCertificate: unknown
  Status: SignatureStatus
  StatusMessage: string
  TimeStamperCertificate: unknown
}

const statusWithSignature = [SignatureStatus.Valid, SignatureStatus.HashMismatch, SignatureStatus.NotTrusted] as const

export interface PresentSignature extends BaseSignature {
  Status: typeof statusWithSignature[number]
  SignerCertificate: SignerCertificate
}

export type Signature = BaseSignature | PresentSignature

export interface SignatureSummary {
  status: string
  type: string
  subject: string | null
}

export async function getAuthenticode(path: string): Promise<Signature> {
  const { stdout } = await promisify(execFile)('powershell.exe', [
    '-NoProfile',
    '-Command',
    "'Get-AuthenticodeSignature $args | ConvertTo-Json -Compress'",
    path,
  ])
  return JSON.parse(stdout)
}

function signatureIsPresent(signature: Signature): signature is PresentSignature {
  return (statusWithSignature as readonly SignatureStatus[]).includes(signature.Status)
}

export function summary(signature: Signature): SignatureSummary {
  return {
    status: SignatureStatus[signature.Status] ?? String(signature.Status),
    type: SignatureType[signature.SignatureType] ?? String(signature.SignatureType),
    subject: signatureIsPresent(signature) ? signature.SignerCertificate.Subject : null,
  }
}
