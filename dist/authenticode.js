import { promisify } from 'util';
import { execFile } from 'child_process';
// https://docs.microsoft.com/en-us/dotnet/api/system.management.automation.signaturestatus
export var SignatureStatus;
(function (SignatureStatus) {
    SignatureStatus[SignatureStatus["Valid"] = 0] = "Valid";
    SignatureStatus[SignatureStatus["UnknownError"] = 1] = "UnknownError";
    SignatureStatus[SignatureStatus["NotSigned"] = 2] = "NotSigned";
    SignatureStatus[SignatureStatus["HashMismatch"] = 3] = "HashMismatch";
    SignatureStatus[SignatureStatus["NotTrusted"] = 4] = "NotTrusted";
    SignatureStatus[SignatureStatus["NotSupportedFileFormat"] = 5] = "NotSupportedFileFormat";
    SignatureStatus[SignatureStatus["Incompatible"] = 6] = "Incompatible";
})(SignatureStatus || (SignatureStatus = {}));
export var SignatureType;
(function (SignatureType) {
    SignatureType[SignatureType["None"] = 0] = "None";
    SignatureType[SignatureType["Authenticode"] = 1] = "Authenticode";
    SignatureType[SignatureType["Catalog"] = 2] = "Catalog";
})(SignatureType || (SignatureType = {}));
const statusWithSignature = [SignatureStatus.Valid, SignatureStatus.HashMismatch, SignatureStatus.NotTrusted];
export async function getAuthenticode(path) {
    const { stdout } = await promisify(execFile)('powershell.exe', [
        '-NoProfile',
        '-Command',
        'Get-AuthenticodeSignature $args[0] | ConvertTo-Json -Compress',
        path,
    ]);
    return JSON.parse(stdout);
}
function signatureIsPresent(signature) {
    return statusWithSignature.includes(signature.Status);
}
export function summary(signature) {
    var _a, _b;
    return {
        status: (_a = SignatureStatus[signature.Status]) !== null && _a !== void 0 ? _a : String(signature.Status),
        type: (_b = SignatureType[signature.SignatureType]) !== null && _b !== void 0 ? _b : String(signature.SignatureType),
        subject: signatureIsPresent(signature) ? signature.SignerCertificate.Subject : null,
    };
}
