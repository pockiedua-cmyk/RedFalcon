$ErrorActionPreference = 'SilentlyContinue'
Add-Type -AssemblyName System.Drawing

$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outDir = "C:\Users\actio\Desktop\REDFALCON\assets\projects"
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

$jobs = @(
  @{ name = "heromath";  url = "https://heromath.vercel.app/" },
  @{ name = "veiloflies"; url = "https://veiloflies.vercel.app/" },
  @{ name = "sewaku";    url = "https://sewaku-rouge.vercel.app/" },
  @{ name = "gelanggang"; url = "https://gelanggang.vercel.app/" },
  @{ name = "xauusdcot"; url = "https://xauusd-cot.vercel.app/" }
)

foreach ($j in $jobs) {
  $out = Join-Path $outDir ($j.name + ".jpg")
  if (Test-Path -LiteralPath $out) { Write-Host ("SKIP " + $j.name); continue }
  $profile = Join-Path $env:TEMP ("edgehs_" + $j.name)
  $args = "--headless=new --disable-gpu --disable-extensions --no-first-run --hide-scrollbars --window-size=1366,900 --force-device-scale-factor=1 --default-background-color=00000000 --user-data-dir=`"$profile`" --virtual-time-budget=12000 --screenshot=`"$out`" $($j.url)"
  $p = New-Object System.Diagnostics.Process
  $p.StartInfo.FileName = $edge
  $p.StartInfo.Arguments = $args
  $p.StartInfo.UseShellExecute = $false
  try { $p.Start() | Out-Null } catch { Write-Host ("ERR start " + $j.name); continue }
  if (-not $p.WaitForExit(60000)) {
    try { $p.Kill() } catch {}
    Write-Host ("TIMEOUT " + $j.name)
  } else {
    if (Test-Path -LiteralPath $out) {
      $img = [System.Drawing.Image]::FromFile($out)
      $w = $img.Width; $h = $img.Height
      $img.Dispose()
      Write-Host ("OK {0} {1}x{2}" -f $j.name, $w, $h)
    } else {
      Write-Host ("NOFILE " + $j.name)
    }
  }
  Get-CimInstance Win32_Process -Filter "Name like 'msedge.exe'" | Where-Object { $_.CommandLine -like "*edgehs_$($j.name)*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  Start-Sleep -Milliseconds 800
}
Write-Host "DONE"