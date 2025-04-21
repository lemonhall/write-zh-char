// Learn more about Tauri commands at https://tauri.app/v2/guides/features/command
use tauri::Manager;

// 添加移动端入口点宏
#[cfg(mobile)]
#[tauri::mobile_entry_point]
pub fn mobile_entry_point() {
    run();
}

pub fn run() {
    tauri::Builder::default()
        .setup(|_app| {
            // 应用启动时的额外设置
            #[cfg(debug_assertions)]
            {
                let window = _app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("汉字描红应用运行出错");
}
