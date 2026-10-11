@echo off
setlocal
cd /d "%~dp0"
title OOS Dashboard - Fast Daily Refresh
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$t=$null;$e=$null;[void][System.Management.Automation.Language.Parser]::ParseFile('%~dp0UPDATE_FAST_DAILY.ps1',[ref]$t,[ref]$e);if($e.Count){$e|Format-List;exit 1}"
if errorlevel 1 (echo SYNTAX CHECK FAILED&pause&exit /b 1)
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0UPDATE_FAST_DAILY.ps1"
if errorlevel 1 (echo UPDATE FAILED - check OUTPUT\UPDATE_LOG.txt) else (echo UPDATE COMPLETED SUCCESSFULLY)
pause
