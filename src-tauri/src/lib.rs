// Learn more about Tauri commands at https://tauri.app/v2/guides/features/command
use tauri::Manager;

pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // 应用启动时的额外设置
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("汉字描红应用运行出错");
}
