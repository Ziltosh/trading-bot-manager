use crate::rspc_routes::Shared;
use rspc::{Error as RspcError, RouterBuilder, Type};
use serde::{Deserialize, Serialize};
use std::fs;
use std::fs::File;
use std::io::prelude::*;
use zip::write::FileOptionExtension;
use zip::write::FileOptions;
use zip::write::SimpleFileOptions;

pub fn mount() -> RouterBuilder<Shared> {
    RouterBuilder::<Shared>::new()
        .query("create_directory", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct ZipCreateDirectory {
                name: String,
                folder: String,
            }
            t(|_ctx, args: ZipCreateDirectory| async move {
                println!("create directory");
                let save_dir = std::path::PathBuf::from(&args.folder);
                let new_dir_path = save_dir.join(&args.name);

                if new_dir_path.exists() {
                    fs::remove_dir_all(&new_dir_path).map_err(|err| {
                        RspcError::new(rspc::ErrorCode::InternalServerError, err.to_string())
                    })?;
                }

                let result = fs::create_dir_all(&new_dir_path)
                    .map(|_| true)
                    .unwrap_or_else(|_| false);

                println!("Directory created at: {:?}", &new_dir_path);
                Ok(result)
            })
        })
        .query("create_file", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct ZipCreateFile {
                path: String,
                folder: String,
                name: String,
                content: String,
            }
            t(|_ctx, args: ZipCreateFile| async move {
                let mut save_dir = std::path::PathBuf::from(&args.path);
                save_dir = save_dir.join(&args.folder);
                let file_path = save_dir.join(&args.name);

                let result = fs::create_dir_all(&save_dir)
                    .and_then(|_| fs::write(&file_path, &args.content))
                    .map(|_| true)
                    .unwrap_or_else(|_| false);

                println!("File created at: {:?}", &file_path);
                Ok(result)
            })
        })
        .query("zip_directory", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct ZipZipDirectory {
                path: String,
                folder: String,
                zip_name: String,
            }
            t(|_ctx, args: ZipZipDirectory| async move {
                use std::fs::File;
                use std::io::{BufWriter, Write};
                use walkdir::WalkDir;
                use zip::write::FileOptions;

                let save_dir = std::path::PathBuf::from(&args.path);
                let mut zip_dir = std::path::PathBuf::from(&args.path);
                zip_dir = zip_dir.join(&args.folder);
                let zip_file_path = save_dir.join(format!("{}.zip", &args.zip_name));

                println!("save_dir: {:?}", &save_dir);
                println!("zip_dir: {:?}", &zip_dir);
                println!("zip_file_path: {:?}", &zip_file_path);

                let zip_file = File::create(&zip_file_path)
                    .map_err(|err| RspcError::new(rspc::ErrorCode::BadRequest, err.to_string()))?;
                let mut zip = zip::ZipWriter::new(BufWriter::new(zip_file));

                let options =
                    SimpleFileOptions::default().compression_method(zip::CompressionMethod::Stored);

                let mut buffer = Vec::new();
                for entry in WalkDir::new(&zip_dir) {
                    let entry = entry.map_err(|err| {
                        RspcError::new(rspc::ErrorCode::BadRequest, err.to_string())
                    })?;
                    let path = entry.path();
                    let name = path.strip_prefix(&save_dir).map_err(|err| {
                        RspcError::new(rspc::ErrorCode::BadRequest, err.to_string())
                    })?;

                    if path.is_file() {
                        let mut file = File::open(path).map_err(|err| {
                            RspcError::new(rspc::ErrorCode::BadRequest, err.to_string())
                        })?;
                        zip.start_file(name.to_string_lossy(), options)
                            .map_err(|err| {
                                RspcError::new(rspc::ErrorCode::BadRequest, err.to_string())
                            })?;

                        file.read_to_end(&mut buffer).map_err(|err| {
                            RspcError::new(rspc::ErrorCode::BadRequest, err.to_string())
                        })?;
                        zip.write_all(&buffer).map_err(|err| {
                            RspcError::new(rspc::ErrorCode::BadRequest, err.to_string())
                        })?;
                        buffer.clear();

                        std::io::copy(&mut file, &mut zip).map_err(|err| {
                            RspcError::new(rspc::ErrorCode::BadRequest, err.to_string())
                        })?;
                    } else if !name.as_os_str().is_empty() {
                        zip.add_directory(name.to_string_lossy(), options)
                            .map_err(|err| {
                                RspcError::new(rspc::ErrorCode::BadRequest, err.to_string())
                            })?;
                    }
                }

                zip.finish()
                    .map_err(|err| RspcError::new(rspc::ErrorCode::BadRequest, err.to_string()))?;

                println!("Directory zipped at: {:?}", &zip_file_path);
                Ok(zip_file_path.to_string_lossy().to_string())
            })
        })
}
