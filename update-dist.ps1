# 准备dist目录的脚本
Write-Host "开始准备dist目录..." 

# 创建dist目录（如果不存在）
if (-not (Test-Path -Path "dist" -PathType Container)) {
    Write-Host "创建dist目录..." 
    New-Item -Path "dist" -ItemType Directory | Out-Null
} else {
    Write-Host "清理dist目录..." 
    Remove-Item -Path "dist\*" -Recurse -Force
}

# 复制必要的文件和文件夹到dist目录
Write-Host "复制文件到dist目录..." 

# 复制文件夹
$folders = @("css", "js", "data", "sounds")
foreach ($folder in $folders) {
    if (Test-Path -Path $folder -PathType Container) {
        Write-Host "复制$folder文件夹..." 
        Copy-Item -Path $folder -Destination "dist\" -Recurse -Force
    } else {
        Write-Host "警告: $folder文件夹不存在" 
    }
}

# 复制JS文件
Copy-Item -Path "cnchar.all.min.js" -Destination "dist\" -Force
Copy-Item -Path "script.js" -Destination "dist\" -Force

# 复制HTML文件作为index.html
Copy-Item -Path "draw-chinese-congrats.html" -Destination "dist\index.html" -Force

Write-Host "准备完成! 现在你可以运行 'npm run tauri build' 来构建应用"
