@echo off
for %%I in ("%cd%") do set "folder=%%~nxI"
title %folder%
cd %~dp0
call npm start