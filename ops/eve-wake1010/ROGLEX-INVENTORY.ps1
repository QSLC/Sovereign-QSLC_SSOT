[CmdletBinding()]
param([string]$OutputDirectory = "$env:USERPROFILE\Desktop")
$ErrorActionPreference = 'Continue'
$stamp = (Get-Date).ToUniversalTime().ToString('o')
$checks = @('pwsh','powershell','python','py','pip','git','gh','node','npm','ollama','az','wrangler','code','docker','uv','eve')
$commands = foreach ($name in $checks) {
  $cmd = Get-Command $name -ErrorAction SilentlyContinue | Select-Object -First 1
  [pscustomobject]@{ Name=$name; Status=if($cmd){'FOUND'}else{'MISSING'}; Source=if($cmd){$cmd.Source}else{$null}; Version=if($cmd -and $cmd.Version){$cmd.Version.ToString()}else{$null} }
}
$paths = @(
  'C:\QSLC', 'C:\QSLC\EVE', 'C:\QSLC\EVE\eve_wake.ps1',
  'C:\QSLC\Dashboard', 'C:\QSLC\Dashboard\qslc_dashboard.html',
  'C:\Users\Qslc1\SovereignHQ', 'C:\Users\Qslc1\SovereignHQ\QSLC'
) | ForEach-Object { [pscustomobject]@{ Path=$_; Exists=Test-Path -LiteralPath $_ } }
$ports = foreach ($port in @(11434,8502,5174)) {
  $listening = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
  [pscustomobject]@{ Port=$port; Status=if($listening){'LISTENING'}else{'NOT_LISTENING'}; ProcessId=if($listening){$listening.OwningProcess}else{$null} }
}
$os = Get-CimInstance Win32_OperatingSystem -ErrorAction SilentlyContinue
$computer = Get-CimInstance Win32_ComputerSystem -ErrorAction SilentlyContinue
$gpu = Get-CimInstance Win32_VideoController -ErrorAction SilentlyContinue | Select-Object Name,DriverVersion
$ollamaModels = $null
if (Get-Command ollama -ErrorAction SilentlyContinue) { $ollamaModels = (& ollama list 2>&1 | Out-String).Trim() }
$report = [pscustomobject]@{
  provenance = "QSLC | EVE 1010 | America/Los_Angeles | $stamp"
  mode = 'READ_ONLY_ROGLEX_INVENTORY'
  machine = $env:COMPUTERNAME
  user = $env:USERNAME
  powershell = $PSVersionTable.PSVersion.ToString()
  os = if($os){$os.Caption}else{$null}
  total_ram_gb = if($computer){[math]::Round($computer.TotalPhysicalMemory/1GB,2)}else{$null}
  free_ram_gb = if($os){[math]::Round($os.FreePhysicalMemory/1MB,2)}else{$null}
  commands = @($commands)
  historical_paths = @($paths)
  local_ports = @($ports)
  gpu = @($gpu)
  ollama_models = $ollamaModels
  notes = @('No software was installed or changed.','No secret values were read or emitted.','Historical paths are probes only; missing does not mean data was deleted.')
}
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$file = Join-Path $OutputDirectory ("QSLC_EVE_ROGLEX_INVENTORY_{0}.json" -f (Get-Date -Format 'yyyyMMdd_HHmmss'))
$report | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $file -Encoding utf8
$report | ConvertTo-Json -Depth 6
Write-Host "Saved inventory: $file" -ForegroundColor Cyan
