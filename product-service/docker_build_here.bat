@echo off
setlocal enabledelayedexpansion

rem -- Get current folder name
for %%I in ("%cd%") do set "folder=%%~nxI"
title !folder!
cd /d %~dp0

rem -- Build docker image
docker build -t !folder! .
if errorlevel 1 (
    echo.
    echo Docker build failed!
    pause
    exit /b 1
)

rem -- Show success message
echo Docker build succeeded.
pause