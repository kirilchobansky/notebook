fn main() {
    // Get the directory of the Cargo.toml file (which is src-tauri)
    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR").unwrap();
    let manifest_path = std::path::Path::new(&manifest_dir);

    // Go up one level to the project root (where package.json is)
    let project_root = manifest_path.parent().expect("Failed to get project root");

    // Create the full path to the .env file
    let env_path = project_root.join(".env");

    // Try to load the .env file
    match dotenvy::from_path(&env_path) {
        Ok(_) => {
            // Tell cargo to re-run this build script if .env changes
            println!("cargo:rerun-if-changed={}", env_path.display());

            // --- THIS IS THE NEW PART ---
            // Get the key from the build script's environment (which dotenvy just loaded)
            let api_key =
                std::env::var("DEEPL_API_KEY").expect("DEEPL_API_KEY not found in .env file");

            // Set the env var for the *application's* compile process
            println!("cargo:rustc-env=DEEPL_API_KEY={}", api_key);
        }
        Err(e) => {
            // If it fails, panic with a helpful error message
            panic!(
                "Failed to load .env file. Error: {}. \nI looked for the file at: {}",
                e,
                env_path.display()
            );
        }
    }

    // Tell Tauri to run its build script
    tauri_build::build()
}
