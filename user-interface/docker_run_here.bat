@echo off
setlocal enabledelayedexpansion

rem -- Get current folder name
for %%I in ("%cd%") do set "folder=%%~nxI"
title !folder!
cd /d %~dp0

rem -- Run Docker build
docker-compose up --build
if errorlevel 1 (
    echo.
    echo Docker run failed!
    pause
    exit /b 1
)

rem -- Show success message
echo Docker run succeeded.
pause
