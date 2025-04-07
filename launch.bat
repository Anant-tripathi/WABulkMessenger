@echo off
echo Starting Backend...
start cmd /k "cd C:\Users\anant\Downloads\WABulkMessenger-main\WABulkMessenger-main\WABulkMessenger\backend && nodemon server.js"

echo Starting Frontend...
start cmd /k "cd C:\Users\anant\Downloads\WABulkMessenger-main\WABulkMessenger-main\WABulkMessenger\frontend && npm run dev"

timeout /t 3 >nul
echo Opening Chrome at http://localhost:5173
start chrome http://localhost:5173