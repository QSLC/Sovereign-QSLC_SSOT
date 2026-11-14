# Public EVE-WAKE1010 Interface Note

This repository intentionally contains only the public-safe EVE integration surface.

The complete QSLC command language, private interpreter design, original EVE brain, local agent source, credentials, and owner-only operational instructions are maintained outside this public repository in authorized QSLC storage.

## Public-safe operating rules

- Do not add private brain files, employee data, payroll, banking, customer-confidential records, credentials, API keys, MFA codes, private keys, or tokens.
- Use the EVE state vocabulary: UNVERIFIED, CALCULATED, VERIFIED, SETTLED, APPROVED, REJECTED, BLOCKED, PENDING.
- Default to read-only discovery.
- Require explicit authorization for protected-branch merges, production deployment, DNS, permissions, billing, payroll, payments, deletion, and secret changes.
- Do not claim a local EVE runtime is online unless the device reports current process, model and endpoint evidence.

## Local device inventory

Run `ops/eve-wake1010/ROGLEX-INVENTORY.ps1` on the authorized ROGLEX device to check historical EVE paths, HEICLI launchers, Ollama models, local ports and original-brain candidate hashes. It does not install software or print brain contents.

This public note does not disclose the private QSLC command grammar or execute commands.
