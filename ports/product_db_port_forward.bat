@echo off
echo Starting port-forward for MongoDB service...

rem -- Port-forward for product service MongoDB
kubectl port-forward svc/product-service-db 27018:27017

rem -- Check if the command was failed
if errorlevel 1 (
    echo.
    echo Mongo port forward failed!
    pause
    exit /b 1
)

rem -- Show success message
echo Mongo port forward succeeded.
pause