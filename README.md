# 汉字描红练习应用

这是一个交互式汉字描红练习应用，帮助用户学习汉字书写。应用提供静态描红、动态描红和自主练习三种模式，支持PC和手机设备，并提供即时反馈与动画效果。

## 🎯 主要功能

### 1. 静态描红
- 展示汉字轮廓供用户描摹
- 支持多字练习
- 根据设备自动调整横/竖排布局

### 2. 动态描红
- 动画展示汉字笔画书写过程
- 通过动画清晰展示笔画顺序和方向
- 完成后显示烟花特效

### 3. 自主练习
- 用户主动书写汉字
- 笔画正确性实时反馈
- 完成后提供成功提示和特效

## 📱 设备兼容

- **PC端**：横排布局，适合宽屏显示
- **手机端**：竖排布局，优化触摸操作

## 🛠️ 技术实现

- 使用**cnchar**库处理汉字数据和书写功能
- 纯前端JavaScript实现，无后端依赖
- 本地存储汉字笔画数据，避免网络请求
- 模块化设计，便于扩展新功能
- 使用**Tauri**框架打包为桌面应用，支持Windows、macOS和Linux

## 📦 项目结构

```
write-zh-char/
├── js/                  # JavaScript模块
│   ├── config.js        # 基础配置和通用函数
│   ├── core.js          # 核心绘图功能
│   ├── effects.js       # 特效和音效
│   ├── static-draw.js   # 静态描红功能
│   ├── animate-draw.js  # 动态描红功能
│   ├── test-draw.js     # 自主练习功能
│   └── main.js          # 主程序入口
├── css/                 # 样式文件
│   └── styles.css       # 主样式表
├── data/                # 本地数据
│   └── dict/            # 汉字笔画数据JSON文件
├── sounds/              # 音效文件
├── dist/                # 打包输出目录，用于Tauri构建
├── src-tauri/           # Tauri相关文件
│   ├── src/             # Rust源代码
│   ├── Cargo.toml       # Rust依赖配置
│   ├── tauri.conf.json  # Tauri配置文件
│   └── icons/           # 应用图标
├── cnchar.all.min.js    # cnchar核心库
├── draw-chinese-congrats.html  # 主页面
├── package.json         # 项目依赖配置
└── README.md            # 项目说明文档
```

## 🚀 安装与使用

### 前提条件
- Node.js (推荐v14或更高版本)
- npm或yarn包管理器
- 现代浏览器 (Chrome, Firefox, Safari, Edge等)

### Web版本安装步骤

1. **克隆仓库**
   ```bash
   git clone <仓库地址>
   cd write-zh-char
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **复制汉字数据文件**
   ```bash
   # 创建数据目录
   mkdir -p data/dict

   # 复制汉字数据文件
   cp -r node_modules/cnchar-data/draw/*.json data/dict/
   ```
   > 注意：Windows系统下请使用`xcopy`命令：`xcopy node_modules\cnchar-data\draw\*.json data\dict\ /Y`

4. **启动本地服务器**
   ```bash
   # 如果安装了http-server
   http-server
   
   # 或者使用Python内置的HTTP服务器
   python -m http.server
   ```

5. **访问应用**
   - 打开浏览器访问 `http://localhost:8000/draw-chinese-congrats.html`

### Tauri桌面应用开发

#### 前提条件
Tauri要求安装特定的系统依赖，请根据不同操作系统安装必要组件：

- **Windows**：
  - [Microsoft Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
  - [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
  - [Rust](https://www.rust-lang.org/tools/install)

- **macOS**：
  ```bash
  xcode-select --install
  brew install rustup
  rustup-init
  ```

- **Linux**：
  ```bash
  # Ubuntu示例
  sudo apt update
  sudo apt install libwebkit2gtk-4.0-dev build-essential curl libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```

#### 开发流程

1. **准备构建环境**
   ```bash
   # 确保依赖已安装
   npm install
   
   # 准备dist目录
   mkdir -p dist/data/dict dist/sounds dist/js dist/css
   cp -r data/dict/* dist/data/dict/
   cp -r sounds/* dist/sounds/
   cp -r js/* dist/js/
   cp -r css/* dist/css/
   cp cnchar.all.min.js dist/
   cp draw-chinese-congrats.html dist/index.html
   ```

2. **开发模式运行Tauri应用**
   ```bash
   npm run tauri dev
   ```
   这将启动一个开发模式的桌面应用，可以实时测试和调试。

3. **构建桌面应用**
   ```bash
   npm run tauri build
   ```
   生成的安装程序将位于 `src-tauri/target/release/bundle` 目录。

4. **仅使用可执行文件**
   构建完成后，可以在 `src-tauri/target/release/` 目录找到独立的可执行文件，可以直接复制使用，无需安装。

## 📋 Tauri配置说明

Tauri配置文件位于 `src-tauri/tauri.conf.json`，包含以下重要配置：

### 应用信息配置
```json
{
  "productName": "HanziWriter",  // 应用名称
  "version": "1.0.0",           // 应用版本
  "identifier": "com.hanzi.writer"  // 应用标识符
}
```

### 窗口配置
```json
"windows": [
  {
    "title": "汉字描红练习",  // 窗口标题
    "width": 1024,         // 窗口宽度
    "height": 768,         // 窗口高度
    "resizable": true,     // 是否可调整大小
    "fullscreen": false,   // 是否全屏
    "center": true         // 是否居中显示
  }
]
```

### 打包配置
```json
"bundle": {
  "active": true,
  "targets": ["nsis"],  // 打包格式，如nsis(安装包)、msi等
  "icon": [            // 应用图标
    "icons/32x32.png",
    "icons/128x128.png",
    "icons/icon.ico"
  ],
  "resources": [      // 需要打包的资源文件
    "../dist/data/**/*.json",
    "../dist/sounds/*"
  ]
}
```

### 资源加载机制

在Tauri应用中，资源文件的加载路径与普通Web应用不同：

```javascript
// 在浏览器环境：
let dataPath = './data/dict/';

// 在Tauri环境：
if (window.tauriApi && window.tauriApi.isTauri) {
  dataPath = await window.tauriApi.getResourcePath('data/dict/');
}
```

## 🔧 自定义配置

- **修改样式**：编辑`css/styles.css`文件
- **调整动画速度**：在`js/animate-draw.js`中修改相关参数
- **增加新功能**：可在`js/`目录下创建新模块，并在`main.js`中引入
- **自定义Tauri配置**：编辑`src-tauri/tauri.conf.json`文件

## 📘 汉字数据说明

应用使用`cnchar-data`包中的汉字笔画数据，包含约9500个常用汉字，每个汉字对应一个JSON文件，存储于`data/dict/`目录。

每个JSON文件包含以下信息：
- 汉字编码
- 笔画数量
- 每个笔画的坐标点
- 笔画类型（横、竖、撇、捺等）

## 🤝 贡献指南

欢迎贡献代码，提交问题或建议：

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📝 开发注意事项

- PC/手机使用不同的布局方式，通过`isDevicePC()`函数判断
- 添加新功能时建议创建独立模块并按依赖顺序引入
- 本地data/dict目录存储汉字数据，避免网络请求和CORS问题
- Tauri应用中的路径处理与Web应用不同，需使用`window.tauriApi.getResourcePath`获取资源路径
- 开发期间建议同时测试Web版本和Tauri版本，确保兼容性

## 📄 许可证

[MIT License](LICENSE)

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 电子邮件：[your-email@example.com]
- GitHub Issues：[项目Issues页面]
