use std::sync::Arc;

use generate_prisma::PrismaClient;

#[allow(unused, warnings)]
pub mod generate_prisma;
pub mod migrator;

#[derive(Debug, Clone)]
pub struct Shared {
    pub client: Arc<PrismaClient>,
}