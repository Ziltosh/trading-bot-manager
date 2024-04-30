use std::path::PathBuf;

use prisma_client_rust::NewClientError;

use crate::service::generate_prisma::{new_client_with_url, PrismaClient};

pub async fn new_client(path: &PathBuf) -> Result<PrismaClient, NewClientError> {
    println!(
        "Connecting to database at {:?}",
        path
    );

    new_client_with_url(&("file:".to_string() + path.to_str().unwrap())).await
}