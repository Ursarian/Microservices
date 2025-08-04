@echo off
echo Starting port-forward for Loki service...

rem -- Port-forward for Loki service
kubectl port-forward -n monitoring svc/loki-stack 8090:3100 -n monitoring

rem -- Check if the command was failed
if errorlevel 1 (
    echo.
    echo Loki port forward failed!
    pause
    exit /b 1
)

rem -- Show success message
echo Loki port forward succeeded.
pause