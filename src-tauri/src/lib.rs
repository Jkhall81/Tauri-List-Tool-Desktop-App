// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod upload_file;

#[tauri::command]
fn extract_numbers_from_file(file_path: String, output_dir: String) -> Result<String, String> {
    upload_file::extract_phone_numbers(&file_path, &output_dir).map(|_| output_dir).map_err(|e| e.to_string())
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, extract_numbers_from_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
