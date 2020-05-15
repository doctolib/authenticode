"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summary = exports.getAuthenticode = exports.SignatureType = exports.SignatureStatus = void 0;
const util_1 = require("util");
const child_process_1 = require("child_process");
// https://docs.microsoft.com/en-us/dotnet/api/system.management.automation.signaturestatus
var SignatureStatus;
(function (SignatureStatus) {
    SignatureStatus[SignatureStatus["Valid"] = 0] = "Valid";
    SignatureStatus[SignatureStatus["UnknownError"] = 1] = "UnknownError";
    SignatureStatus[SignatureStatus["NotSigned"] = 2] = "NotSigned";
    SignatureStatus[SignatureStatus["HashMismatch"] = 3] = "HashMismatch";
    SignatureStatus[SignatureStatus["NotTrusted"] = 4] = "NotTrusted";
    SignatureStatus[SignatureStatus["NotSupportedFileFormat"] = 5] = "NotSupportedFileFormat";
    SignatureStatus[SignatureStatus["Incompatible"] = 6] = "Incompatible";
})(SignatureStatus = exports.SignatureStatus || (exports.SignatureStatus = {}));
var SignatureType;
(function (SignatureType) {
    SignatureType[SignatureType["None"] = 0] = "None";
    SignatureType[SignatureType["Authenticode"] = 1] = "Authenticode";
    SignatureType[SignatureType["Catalog"] = 2] = "Catalog";
})(SignatureType = exports.SignatureType || (exports.SignatureType = {}));
const statusWithSignature = [SignatureStatus.Valid, SignatureStatus.HashMismatch, SignatureStatus.NotTrusted];
async function getAuthenticode(path) {
    const escapedPath = path.replace('"', '`"');
    const command = `Get-AuthenticodeSignature "${escapedPath}" | ConvertTo-Json -Compress`;
    const encodedCommand = Buffer.from(command, 'utf16le').toString('base64');
    const { stdout } = await util_1.promisify(child_process_1.execFile)('powershell.exe', [
        '-NoProfile',
        '-EncodedCommand',
        encodedCommand
    ]);
    return JSON.parse(stdout);
}
exports.getAuthenticode = getAuthenticode;
function signatureIsPresent(signature) {
    return statusWithSignature.includes(signature.Status);
}
function summary(signature) {
    var _a, _b;
    return {
        status: (_a = SignatureStatus[signature.Status]) !== null && _a !== void 0 ? _a : String(signature.Status),
        type: (_b = SignatureType[signature.SignatureType]) !== null && _b !== void 0 ? _b : String(signature.SignatureType),
        subject: signatureIsPresent(signature) ? signature.SignerCertificate.Subject : null,
    };
}
exports.summary = summary;
