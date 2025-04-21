$KeytoolPath = "E:\Android\Android Studio\jbr\bin\keytool.exe"
$KeystoreName = "hanzi-writer.keystore"
$KeyAlias = "hanziwriter"

# Generate keystore
& $KeytoolPath -genkey -v -keystore $KeystoreName -alias $KeyAlias -keyalg RSA -keysize 2048 -validity 10000

# Copy to src-tauri directory if successful
if (Test-Path $KeystoreName) {
    Copy-Item -Path $KeystoreName -Destination "src-tauri\" -Force
    Write-Host "Keystore created and copied to src-tauri directory."
} 