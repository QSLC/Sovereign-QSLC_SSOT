# QSLC EVE-1010 — local SSH commit-signing bootstrap for Windows
# Run in PowerShell on the computer that will make signed commits.
# Never send/upload the private key or enter its passphrase in a chat.
$ErrorActionPreference = 'Stop'
$sshKeygen = (Get-Command ssh-keygen -ErrorAction Stop).Source
$sshDir = Join-Path $HOME '.ssh'
New-Item -ItemType Directory -Path $sshDir -Force | Out-Null
$keyFile = Join-Path $sshDir 'id_ed25519_qslc_signing'
if (-not (Test-Path $keyFile)) {
  Write-Host 'Generating a new signing key on THIS device. Choose a strong passphrase when prompted.'
  & $sshKeygen -t ed25519 -f $keyFile -C 'QSLC EVE-1010 Git signing'
  if ($LASTEXITCODE -ne 0) { throw 'ssh-keygen failed.' }
} else {
  Write-Host 'Existing QSLC signing key found. Reusing it; not overwriting.'
}
if (-not (Test-Path "$keyFile.pub")) { throw 'Missing signing public key.' }
git config --global gpg.format ssh
git config --global user.signingkey "$keyFile.pub"
git config --global commit.gpgsign true
Write-Host ''
Write-Host 'PUBLIC signing key (safe to register in GitHub):'
Get-Content "$keyFile.pub"
Write-Host ''
Write-Host 'Register this PUBLIC key at GitHub Settings > SSH and GPG keys > New SSH key > Key type: Signing Key.'
Write-Host 'Use a GitHub verified author email in git config --global user.email, and set user.name.'
Write-Host 'Then run: git commit -S -m "feat(qslc-eve): verified signed update"'
Write-Host 'Confirm the commit displays a GitHub Verified badge.'
Write-Host 'The PRIVATE key stays on this machine; never put it in repositories or public cloud storage.'
