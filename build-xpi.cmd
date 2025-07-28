@echo off
setlocal

set DIST_DIR=dist
set XPI_NAME=ai-reply.xpi
set SEVENZIP="D:\Programme\7-Zip\7z.exe"

REM Alte Datei löschen
if exist "%XPI_NAME%" del /f "%XPI_NAME%"

REM Mit 7-Zip nur den Inhalt von dist packen
%SEVENZIP% a -tzip "%XPI_NAME%" ".\%DIST_DIR%\*"

if exist "%XPI_NAME%" (
    echo ✅ Erfolgreich erstellt: %XPI_NAME%
) else (
    echo ❌ Fehler beim Erstellen der XPI-Datei.
    exit /b 1
)

endlocal
