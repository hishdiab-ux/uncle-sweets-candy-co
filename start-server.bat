@echo off
title Uncle Sweet's Candy Co. - Local Server
echo.
echo   *** Uncle Sweet's Candy Co. ***
echo   Serving on http://localhost:8000
echo   Close this window to stop the server.
echo.
start http://localhost:8000
python -m http.server 8000
pause
