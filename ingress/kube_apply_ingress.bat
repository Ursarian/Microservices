@echo off
setlocal enabledelayedexpansion

rem -- Go to the parrent folder of this script
cd /d %~dp0

rem -- Get current folder name
for %%I in ("%cd%") do set "folder=%%~nxI"

rem -- Set the title of the command prompt window
title !folder!

rem -- Apply all .yaml files in this folder
kubectl apply -f .

rem -- Check if the command was failed
if errorlevel 1 (
    echo.
    echo Kubernetes ingress apply failed!
    pause
    exit /b 1
)

rem -- Show success message
echo Kubernetes ingress apply succeeded.
pause