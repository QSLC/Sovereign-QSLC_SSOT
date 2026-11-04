# QSLC EVE local runtime installer/launcher for Windows PowerShell
# Run from a folder containing this repository. No admin rights or cloud subscription required.
$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$Runtime = Join-Path $Root 'runtime\eve-local.mjs'
$Data = Join-Path $Root 'data'
New-Item -ItemType Directory -Force -Path $Data | Out-Null

Write-Host '=== QSLC EVE LOCAL STARTUP ===' -ForegroundColor Cyan
$Node = Get-Command node.exe -ErrorAction SilentlyContinue
if (-not $Node) {
  Write-Host 'Node.js 22 or newer is required. Install Node.js LTS, then rerun this script.' -ForegroundColor Red
  exit 2
}
$NodeVersion = (& node --version).Trim()
if ($NodeVersion -notmatch '^v(2[2-9]|[3-9][0-9])\.') {
  Write-Host "Detected $NodeVersion. EVE requires Node.js 22 or newer." -ForegroundColor Red
  exit 2
}

$Ollama = Get-Command ollama.exe -ErrorAction SilentlyContinue
if (-not $Ollama) {
  $Candidate = Join-Path $env:LOCALAPPDATA 'Programs\Ollama\ollama.exe'
  if (Test-Path $Candidate) { $Ollama = Get-Item $Candidate }
}
if (-not $Ollama) {
  Write-Host 'Ollama executable not found. This installer will not download or install software without your confirmation.' -ForegroundColor Red
  Write-Host 'Install Ollama for Windows, then rerun this script.'
  exit 3
}

try {
  Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/version' -TimeoutSec 3 | Out-Null
  Write-Host 'Ollama is already running.' -ForegroundColor Green
} catch {
  Write-Host 'Starting local Ollama server...'
  Start-Process -FilePath $Ollama.Source -ArgumentList 'serve' -WindowStyle Hidden
  $Ready = $false
  for ($i=0; $i -lt 20; $i++) {
    Start-Sleep -Seconds 1
    try { Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/version' -TimeoutSec 2 | Out-Null; $Ready=$true; break } catch {}
  }
  if (-not $Ready) { Write-Host 'Ollama did not become ready on 127.0.0.1:11434.' -ForegroundColor Red; exit 4 }
}

$env:EVE_LOG_PATH = Join-Path $Data 'eve-local.jsonl'
Write-Host "`nLocal model inventory:" -ForegroundColor Cyan
$Inventory = Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 10
if (-not $Inventory.models -or $Inventory.models.Count -eq 0) {
  Write-Host 'No local models are installed. No model was downloaded.' -ForegroundColor Yellow
  Write-Host 'When ready, install a model with: ollama pull <model-name>'
  exit 5
}
$Inventory.models | ForEach-Object { Write-Host (" - " + $_.name) }
if (-not $env:EVE_OLLAMA_MODEL) { $env:EVE_OLLAMA_MODEL = $Inventory.models[0].name }
Write-Host "`nStarting EVE with model $env:EVE_OLLAMA_MODEL ..." -ForegroundColor Green
& node $Runtime
