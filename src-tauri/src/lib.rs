// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// --- Add these `use` statements ---
use reqwest;
use serde::Deserialize;
// use tauri_plugin_store::Builder;

// --- Define the DeepL response structures ---
#[derive(Deserialize, Debug)]
struct DeepLTranslation {
    text: String,
}

#[derive(Deserialize, Debug)]
struct DeepLResponse {
    translations: Vec<DeepLTranslation>,
}

#[tauri::command]
async fn translate(text: String, from: String, to: String) -> Result<String, String> {
    // 1. Get the API key securely from the environment
    let api_key = env!("DEEPL_API_KEY");

    // 2. Build the request for DeepL
    let client = reqwest::Client::new();
    let api_url = "https://api-free.deepl.com/v2/translate";

    let params = [
        ("auth_key", api_key),
        ("text", &text),
        ("source_lang", &from),
        ("target_lang", &to),
    ];

    // 3. Send the request
    let res = client
        .post(api_url)
        .form(&params)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    // 4. Parse the response
    if res.status().is_success() {
        let response_json = res
            .json::<DeepLResponse>()
            .await
            .map_err(|e| e.to_string())?;

        // 5. Return the translated text
        if let Some(first_translation) = response_json.translations.get(0) {
            Ok(first_translation.text.clone())
        } else {
            Err("No translation found".into())
        }
    } else {
        // Handle API errors
        let error_text = res
            .text()
            .await
            .unwrap_or_else(|_| "Unknown API error".into());
        Err(format!("DeepL API Error: {}", error_text))
    }
}

// --- This is your application's entry point ---
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // If you want to enable the `tauri-plugin-store` plugin, add the crate to Cargo.toml
        // and initialize it according to the plugin's documentation.
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![translate])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
