@echo off
REM 设置系统环境变量（需要管理员权限）

setx ANDROID_HOME "E:\Android\SDK" /M
setx NDK_HOME "E:\Android\SDK\ndk\29.0.13113456" /M
setx JAVA_HOME "E:\development\jdk17" /M

echo 系统环境变量已设置，请重新启动命令提示符或PowerShell以使更改生效。
pause 