@echo off
REM ============================================================================
REM sync-now.bat
REM Manueller Trigger fuer SharePoint-Sync. Doppelklick aus Explorer.
REM Bleibt nach Ausfuehrung offen (pause), damit man die Ausgabe sehen kann.
REM
REM Empfohlen: Desktop-Verknuepfung anlegen
REM   Rechtsklick auf diese Datei -> Senden an -> Desktop (Verknuepfung)
REM ============================================================================

echo.
echo === Manueller SharePoint-Sync ===
echo.

powershell.exe -ExecutionPolicy Bypass -File "%~dp0sync-to-sharepoint.ps1"

echo.
echo === Fertig ===
echo SharePoint braucht jetzt ~5-15 Min, bis Copilot die Aenderungen sieht.
echo.
pause
