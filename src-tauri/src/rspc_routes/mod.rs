use std::{path::PathBuf, sync::Arc};

use rspc::{Config, ErrorCode, Router};

use crate::service::generate_prisma::PrismaClient;

mod dbroutes;
mod robot;
mod tag;
mod optimisation;
mod optimisation_periode;
mod compte;

pub fn init_router() -> Arc<Router<Shared>> {
    let router = Router::<Shared>::new()
        .config(
            Config::new()
                .set_ts_bindings_header("/* eslint-disable */")
                .export_ts_bindings(
                    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../src/rspc_bindings.ts"),
                ),
        )
        .merge("db.", dbroutes::mount()) // Mount the db routes
        .merge("robots.", robot::mount()) // Mount the robots routes
        .merge("comptes.", compte::mount()) // Mount the comptes routes
        .merge("tags.", tag::mount()) // Mount the tags routes
        .merge("optimisations.", optimisation::mount()) // Mount the optimisations routes
        .merge("optimisation_periodes.", optimisation_periode::mount()) // Mount the optimisation_periodes routes
        .query("version", |t| {
            t(|_, _: ()| async move { env!("CARGO_PKG_VERSION") })
        })
        .query("openInDefault", |t| {
            t(|_, data: String| {
                open::that(data).map_err(|err| -> rspc::Error {
                    rspc::Error::new(ErrorCode::InternalServerError, err.to_string())
                })
            })
        });

    router.build().arced()
}

#[derive(Debug, Clone)]
pub struct Shared {
    pub client: Arc<PrismaClient>,
}