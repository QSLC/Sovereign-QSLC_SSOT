param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "../../..")).Path
)
$ErrorActionPreference = "Stop"
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) { throw "Python 3 is required. Install Python 3.11+ and reopen PowerShell." }
$version = & python --version 2>&1
Write-Host "QSLC | EVE 1010 | America/Los_Angeles | Employee Operations validation"
Write-Host "Repository: $RepoRoot"
Write-Host "Python: $version"
Push-Location $RepoRoot
try {
  & python ops/employee-ops/validate_employee_config.py ops/employee-ops/employee-config.example.json
  if ($LASTEXITCODE -ne 0) { throw "Employee configuration validation failed." }
  & python -m unittest discover -s ops/employee-ops/tests -v
  if ($LASTEXITCODE -ne 0) { throw "Employee operations test suite failed." }
  Write-Host "RESULT: PASS — template validation and unit tests completed."
  Write-Host "External Paychex, Microsoft 365, GPS, payroll, and local ROGLEX connectivity remain untested."
}
finally {
  Pop-Location
}
