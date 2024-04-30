use std::env;
use std::path::PathBuf;

// mod db;
// mod routes;

fn main() {
    let _ = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap()).join("../../target");
    tauri_build::build()
}
