$ErrorActionPreference = 'Continue'
$Host.UI.RawUI.WindowTitle = 'EVE ONE COMMAND LOCK-IN'
Write-Host "`n🧠 EVE ONE COMMAND LOCK-IN STARTING..." -ForegroundColor Cyan

$root = 'C:\QSLC'
$api = Join-Path $root 'API'
$ssot = Join-Path $root 'SSOT'
$dash = Join-Path $root 'Dashboard'
$scripts = Join-Path $root 'scripts'
$assets = Join-Path $root 'assets'
$logs = Join-Path $root 'logs'
$desktop = [Environment]::GetFolderPath('Desktop')

New-Item -ItemType Directory -Force -Path $root,$api,$ssot,$dash,$scripts,$assets,$logs | Out-Null

# Find existing EVE/Streamlit files and copy best dashboard into C:\QSLC\Dashboard
$searchRoots = @($root, $env:USERPROFILE, $desktop) | Where-Object { $_ -and (Test-Path $_) }
$streamlitFiles = foreach($r in $searchRoots){ Get-ChildItem -Path $r -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -match 'streamlit.*\.py$|.*dashboard.*\.py$|EVE.*\.py$' } }
$best = $streamlitFiles | Sort-Object Length -Descending | Select-Object -First 1
if($best){ Copy-Item $best.FullName (Join-Path $dash 'streamlit_app.py') -Force; Write-Host "✅ Dashboard locked from: $($best.FullName)" -ForegroundColor Green }
else { @'
import streamlit as st
st.set_page_config(page_title="EVE Sovereign", page_icon="🧠", layout="wide")
st.title("🧠 EVE Sovereign Dashboard")
st.success("EVE is locked into C:\\QSLC. Add SSOT data to C:\\QSLC\\SSOT.")
st.code("C:\\QSLC\\API\\.env")
'@ | Set-Content (Join-Path $dash 'streamlit_app.py') -Encoding UTF8 }

# Create .env once. If missing key, make template and stop asking repeatedly by using local file.
$envFile = Join-Path $api '.env'
if(!(Test-Path $envFile)){
@'
# EVE local keys live here. Paste once, save, never commit.
OPENAI_API_KEY=
GROQ_API_KEY=
ANTHROPIC_API_KEY=
QSLC_ROOT=C:\QSLC
QSLC_SSOT=C:\QSLC\SSOT
'@ | Set-Content $envFile -Encoding UTF8
Write-Host "⚠️ Created key vault template: $envFile" -ForegroundColor Yellow
} else { Write-Host "✅ Existing key vault found: $envFile" -ForegroundColor Green }

# Create requirements
@'
streamlit>=1.35.0
pandas>=2.0.0
requests>=2.31.0
python-dotenv>=1.0.1
'@ | Set-Content (Join-Path $dash 'requirements.txt') -Encoding UTF8

# Create launcher PS1
$launcher = Join-Path $scripts 'START_EVE_SOVEREIGN.ps1'
@"
`$ErrorActionPreference='Continue'
`$env:QSLC_ROOT='C:\QSLC'
`$env:QSLC_SSOT='C:\QSLC\SSOT'
`$envFile='C:\QSLC\API\.env'
if(Test-Path `$envFile){
  Get-Content `$envFile | ForEach-Object {
    if(`$_ -match '^\s*([^#][^=]+)=(.*)`$'){
      [Environment]::SetEnvironmentVariable(`$matches[1].Trim(), `$matches[2].Trim(), 'Process')
    }
  }
}
cd 'C:\QSLC\Dashboard'
python -m pip install -r requirements.txt
Start-Process powershell -ArgumentList '-NoExit','-ExecutionPolicy','Bypass','-Command','cd C:\QSLC\Dashboard; streamlit run streamlit_app.py --server.address 0.0.0.0 --server.port 8502'
if(Get-Command cloudflared -ErrorAction SilentlyContinue){
  Start-Process powershell -ArgumentList '-NoExit','-ExecutionPolicy','Bypass','-Command','cloudflared tunnel --url http://localhost:8502'
} else {
  Write-Host 'Cloudflared not installed. Dashboard still works on this PC: http://localhost:8502' -ForegroundColor Yellow
}
"@ | Set-Content $launcher -Encoding UTF8

# Create EVE ask CLI wrapper
$eveCli = Join-Path $scripts 'EVE.ps1'
@"
param([Parameter(ValueFromRemainingArguments=`$true)][string[]]`$Ask)
`$envFile='C:\QSLC\API\.env'
if(Test-Path `$envFile){
  Get-Content `$envFile | ForEach-Object {
    if(`$_ -match '^\s*([^#][^=]+)=(.*)`$'){
      [Environment]::SetEnvironmentVariable(`$matches[1].Trim(), `$matches[2].Trim(), 'Process')
    }
  }
}
`$text = (`$Ask -join ' ')
if(-not `$text){ `$text = Read-Host 'Ask EVE' }
Write-Host "EVE REQUEST: `$text" -ForegroundColor Cyan
Write-Host 'Local key vault loaded from C:\QSLC\API\.env' -ForegroundColor Green
Write-Host 'Dashboard: http://localhost:8502' -ForegroundColor Green
"@ | Set-Content $eveCli -Encoding UTF8

# Desktop shortcuts
$wsh = New-Object -ComObject WScript.Shell
$shortcut = $wsh.CreateShortcut((Join-Path $desktop '🧠 EVE Sovereign Terminal.lnk'))
$shortcut.TargetPath = 'powershell.exe'
$shortcut.Arguments = "-NoExit -ExecutionPolicy Bypass -File `"$launcher`""
$shortcut.WorkingDirectory = $root
$shortcut.IconLocation = 'powershell.exe,0'
$shortcut.Save()

$shortcut2 = $wsh.CreateShortcut((Join-Path $desktop '🧠 EVE Ask CLI.lnk'))
$shortcut2.TargetPath = 'powershell.exe'
$shortcut2.Arguments = "-NoExit -ExecutionPolicy Bypass -File `"$eveCli`""
$shortcut2.WorkingDirectory = $root
$shortcut2.IconLocation = 'powershell.exe,0'
$shortcut2.Save()

# Persist basic environment variables for future terminals
[Environment]::SetEnvironmentVariable('QSLC_ROOT',$root,'User')
[Environment]::SetEnvironmentVariable('QSLC_SSOT',$ssot,'User')
[Environment]::SetEnvironmentVariable('QSLC_API_ENV',$envFile,'User')

Write-Host "`n✅ LOCK-IN COMPLETE" -ForegroundColor Green
Write-Host "Use Desktop icon: 🧠 EVE Sovereign Terminal" -ForegroundColor Cyan
Write-Host "Key vault: C:\QSLC\API\.env" -ForegroundColor Yellow
Write-Host "Dashboard local: http://localhost:8502" -ForegroundColor Cyan
Write-Host "If Cloudflare opens, copy the trycloudflare.com link to your iPhone." -ForegroundColor Cyan
Start-Process powershell -ArgumentList '-NoExit','-ExecutionPolicy','Bypass','-File',$launcher
