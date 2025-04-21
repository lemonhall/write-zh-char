# Variables
$KeystorePath = "src-tauri\hanzi-writer.keystore"
$KeyAlias = "hanziwriter"
$KeyPassword = "ebDfP2T2G584kPPt5Skz"
$OutputApk = "HanziWriter-signed.apk"
$JarSignerPath = "E:\development\jdk17\bin\jarsigner.exe"
$UnsignedApkFolder = "src-tauri\gen\android\app\build\outputs\apk\universal\release"

# Find the APK file
$UnsignedApkFile = Get-ChildItem -Path $UnsignedApkFolder -Filter "*.apk" -Recurse | Select-Object -First 1
if (-not $UnsignedApkFile) {
    Write-Error "APK file not found in $UnsignedApkFolder"
    exit 1
}
$UnsignedApkPath = $UnsignedApkFile.FullName

# Copy APK for signing
Copy-Item -Path $UnsignedApkPath -Destination $OutputApk -Force

# Sign the APK
Write-Host "Signing APK: $OutputApk" -ForegroundColor Green
& $JarSignerPath -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $KeystorePath -storepass $KeyPassword -keypass $KeyPassword $OutputApk $KeyAlias

# Check result
if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully signed APK: $OutputApk" -ForegroundColor Green
} else {
    Write-Host "Signing failed with error code: $LASTEXITCODE" -ForegroundColor Red
} 