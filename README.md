# Authenticode for Node.JS

[Authenticode](https://docs.microsoft.com/en-us/windows-hardware/drivers/install/authenticode)
is Microsoft’s code-signing mechanism which allows identifying the publisher of
executables (binaries or Powershell scripts).

This module wraps the Powershell cmdlet _Get-Authenticode_ to return
information about signatures of executable files to Node.JS.

``ts
import { getAuthenticode, SignatureStatus } from 'authenticode'

async function isSigned(path: string): Promise<boolean> {
  const { Status } = await getAuthenticode(path)
  return Status === SignatureStatus.Valid
}
```
