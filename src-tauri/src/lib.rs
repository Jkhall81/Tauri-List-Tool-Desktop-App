// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod upload_file;
mod final_file;
mod dnc_file;
mod generate_email_report;

#[tauri::command]
fn email_report_handler(source_file: &str, output_dir: &str, abbr: &str, color: &str) -> Result<String, String> {
    generate_email_report::generate_email_report_file(source_file, output_dir, abbr, color)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn dnc_file_handler(output_dir: &str, source_file: &str) -> Result<String, String> {
    dnc_file::generate_dnc_file(output_dir, source_file)
        .map(|_| "DNC report generated successfully".to_string())
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn final_file_handler(output_dir: &str, source_file: &str) -> Result<String, String> {
    final_file::generate_final_file(output_dir, source_file)
        .map(|_| "Final report generated successfully.".to_string())
        .map_err(|e| e.to_string())
}

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
        .invoke_handler(tauri::generate_handler![greet, extract_numbers_from_file, final_file_handler, dnc_file_handler, email_report_handler])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
