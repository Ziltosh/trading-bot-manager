// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Arc;

use crate::rspc_routes::init_router;
use crate::rspc_routes::Shared;

#[allow(warnings, unused)]
pub mod rspc_routes;
pub mod errors;
pub mod service;
mod commands;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    pretty_env_logger::init();

    let router = init_router();

    // On cherche le path app data pour y mettre la bdd
    use tauri::{
        api::path::{BaseDirectory, resolve_path},
        Env,
    };
    let context = tauri::generate_context!();
    let path = resolve_path(
        context.config(),
        context.package_info(),
        &Env::default(),
        "db.sqlite",
        Some(BaseDirectory::AppData),
    )
        .expect("failed to resolve path");

    println!("path: {:?}", path);

    // Create file if it doesn't exist, create subdirectories if necessary
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent).expect("failed to create parent directories");
    }
    if !path.exists() {
        std::fs::File::create(&path).expect("failed to create file");
    }

    // Migrate the database
    let client = Arc::new(service::migrator::new_client(&path).await.unwrap());

    #[cfg(debug_assertions)]
        let _ = client._db_push().accept_data_loss().await;


    tauri::Builder::default()
        .plugin(rspc::integrations::tauri::plugin(router, move || Shared {
            client: Arc::clone(&client),
        }))
        .invoke_handler(tauri::generate_handler![
            // dev_db_test_connexion,
            commands::open_file,
            commands::replace_file,
            commands::get_db_path,
            // commands::portfolio::portfolio_select_by_user_id,
            // commands::portfolio::portfolio_select_by_id,
            // commands::portfolio::portfolio_insert,
            // commands::portfolio::portfolio_delete,
            // commands::portfolio::portfolio_update,
            
        ])
        .run(context)
        .expect("error while running tauri application");
}

// #[tauri::command]
// async fn dev_db_test_connexion(state: tauri::State<'_, AppState>) -> Result<String, String> {
//     println!("tauri command: dev_db_test_connexion");
//
//     let ping = state.conn.ping().await.is_ok();
//     // Test si ping ok
//
//     if ping {
//         Ok("Database ping successful".to_string())
//     } else {
//         Err("Database ping failed".to_string())
//     }
// }


// #[derive(Clone)]
// pub struct AppState {
//     conn: DatabaseConnection,
// }
