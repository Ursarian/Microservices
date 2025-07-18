@echo off
setlocal enabledelayedexpansion

rem -- Go to the parrent folder of this script
cd /d %~dp0/..

rem -- Get current folder name
for %%I in ("%cd%") do set "folder=%%~nxI"

rem -- Go back to the directory of this script
cd /d %~dp0

rem -- Set the title of the command prompt window
title !folder!

rem -- Delete service and deployment with the current folder name
kubectl delete service !folder!
kubectl delete deployment !folder!

rem -- Check if the command was failed
if errorlevel 1 (
    echo.
    echo Kubernetes delete failed!
    pause
    exit /b 1
)

rem -- Show success message
echo Kubernetes delete succeeded.
pause