@echo off
REM 设置环境变量
set ANDROID_HOME=E:\Android\SDK
set NDK_HOME=E:\Android\SDK\ndk\29.0.13113456
set JAVA_HOME=E:\development\jdk17

REM 设置代理
set HTTP_PROXY=http://127.0.0.1:7897
set HTTPS_PROXY=http://127.0.0.1:7897
set http_proxy=http://127.0.0.1:7897
set https_proxy=http://127.0.0.1:7897
set ALL_PROXY=http://127.0.0.1:7897

echo ANDROID_HOME设置为: %ANDROID_HOME%
echo NDK_HOME设置为: %NDK_HOME%
echo JAVA_HOME设置为: %JAVA_HOME%
echo 代理设置为: %HTTP_PROXY%

REM 运行tauri android init命令
call npm run tauri android init

REM 如果初始化成功，继续构建
if %ERRORLEVEL% EQU 0 (
  echo 初始化成功，开始构建Android APK...
  cd src-tauri
  call npm run tauri android build
) 