$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("C:\Users\ovjup\Desktop\Hazel Guardian Desk.lnk")
$Shortcut.TargetPath = "C:\Users\ovjup\Desktop\Hazel_Guardian_Desk\launch_guardian_desk.bat"
$Shortcut.WorkingDirectory = "C:\Users\ovjup\Desktop\Hazel_Guardian_Desk"
$Shortcut.IconLocation = "C:\Users\ovjup\Desktop\Hazel_Guardian_Desk\assets\guardian_desk_logo.ico, 0"
$Shortcut.Description = "Hazel Guardian Desk - Two-Way Reassurance Bridge"
$Shortcut.WindowStyle = 7
$Shortcut.Save()
Write-Output "Shortcut created successfully!"
