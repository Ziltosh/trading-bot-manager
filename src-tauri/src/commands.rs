// use tauri;

// #[tauri::command]
// pub fn test(app_handle: tauri::AppHandle) -> Result<String, String> {
//     // On cherche le path app data pour y mettre la bdd
//     let binding = app_handle.path_resolver().app_data_dir().unwrap();
//     let app_data_dir = binding.to_str().unwrap();
//
//     Ok(app_data_dir.to_string())
// }

#[tauri::command]
pub fn open_file(path: String) -> Result<String, String> {
    // On cherche le path app data pour y mettre la bdd
    match open::that(path)
    {
        Ok(_) => Ok("File opened".to_string()),
        Err(e) => Err(e.to_string())
    }
}

#[tauri::command]
pub fn replace_file(original: String, nouveau: String) -> Result<String, String> {
    // Si les noms sont identiques, on ne fait rien
    println!("Original: {:?}", original);
    println!("Nouveau: {:?}", nouveau);
    if original == nouveau
    {
        return Ok("File replaced".to_string());
    }

    match std::fs::copy(nouveau, original)
    {
        Ok(_) => Ok("File replaced".to_string()),
        Err(e) => Err(e.to_string())
    }
}