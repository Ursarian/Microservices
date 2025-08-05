@echo off
echo Starting port-forward for Grafana service...

rem -- Port-forward for Grafana service
kubectl port-forward -n monitoring svc/prometheus-stack-grafana 8080:80

rem -- Check if the command was failed
if errorlevel 1 (
    echo.
    echo Grafana port forward failed!
    pause
    exit /b 1
)

rem -- Show success message
echo Grafana port forward succeeded.
pause