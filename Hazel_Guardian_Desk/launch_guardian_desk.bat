@echo off
title Hazel Guardian Desk
cd /d "%~dp0"
if exist "C:\Python314\pythonw.exe" (
    start "" "C:\Python314\pythonw.exe" guardian_desk.py
) else (
    start "" pythonw guardian_desk.py
)
