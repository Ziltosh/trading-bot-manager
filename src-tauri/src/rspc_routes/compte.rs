use rspc::{RouterBuilder, Type};

use serde::{Deserialize, Serialize};

use crate::rspc_routes::Shared;
use crate::service::generate_prisma::compte;

pub fn mount() -> RouterBuilder<Shared> {
    RouterBuilder::<Shared>::new()
        .query("get_demo", |t| {
            t(|ctx, _: ()| async move {
                let comptes_db = ctx
                    .client
                    .compte()
                    .find_many(vec![compte::type_compte::equals("demo".to_string())])
                    .include(compte::include!({
                        tags: include
                        {
                            tag: select
                            {
                                name
                            }
                        }
                    }))
                    .exec()
                    .await?;

                Ok(comptes_db)
            })
        })
        .query("get_prop", |t| {
            t(|ctx, _: ()| async move {
                let comptes_db = ctx
                    .client
                    .compte()
                    .find_many(vec![compte::type_compte::equals("prop".to_string())])
                    .include(compte::include!({
                        tags: include
                        {
                            tag: select
                            {
                                name
                            }
                        }
                    }))
                    .exec()
                    .await?;

                Ok(comptes_db)
            })
        })
        .query("get_reel", |t| {
            t(|ctx, _: ()| async move {
                let comptes_db = ctx
                    .client
                    .compte()
                    .find_many(vec![compte::type_compte::equals("reel".to_string())])
                    .include(compte::include!({
                        tags: include
                        {
                            tag: select
                            {
                                name
                            }
                        }
                    }))
                    .exec()
                    .await?;

                Ok(comptes_db)
            })
        })
        .query("get_by_id", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct CompteGetByIdArgs {
                id: i32,
            }
            t(|ctx, args: CompteGetByIdArgs| async move {
                let compte_db = ctx
                    .client
                    .compte()
                    .find_unique(compte::id::equals(args.id))
                    .include(compte::include!({
                        tags: include
                        {
                            tag: select
                            {
                                name
                            }
                        }
                    }))
                    .exec()
                    .await?;

                Ok(compte_db)
            })
        })
        .mutation("create", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct CompteCreateArgs {
                name: String,
                type_compte: String,
                capital: f64,
                devise: String,
                courtier: String,
                plateforme: String,
                numero: String,
                password: String,
                serveur: String,
                status: String,
            }
            t(|ctx, args: CompteCreateArgs| async move {
                let CompteCreateArgs {
                    name,
                    type_compte,
                    capital,
                    devise,
                    courtier,
                    plateforme,
                    numero,
                    password,
                    serveur,
                    status,
                } = args;

                let compte = ctx
                    .client
                    .compte()
                    .create(
                        name,
                        type_compte,
                        capital,
                        devise,
                        courtier,
                        plateforme,
                        numero,
                        serveur,
                        status,
                        vec![compte::password::set(Some(password))],
                    )
                    .exec()
                    .await?;

                Ok(compte)
            })
        })
        .mutation("update", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct CompteUpdateArgs {
                id: i32,
                name: String,
                type_compte: String,
                capital: f64,
                devise: String,
                courtier: String,
                plateforme: String,
                numero: String,
                password: String,
                serveur: String,
                status: String,
            }
            t(|ctx, args: CompteUpdateArgs| async move {
                let CompteUpdateArgs {
                    id,
                    name,
                    type_compte,
                    capital,
                    devise,
                    courtier,
                    plateforme,
                    numero,
                    password,
                    serveur,
                    status,
                } = args;

                let compte;

                compte = ctx
                    .client
                    .compte()
                    .update(
                        compte::id::equals(id),
                        vec![
                            compte::name::set(name),
                            compte::type_compte::set(type_compte),
                            compte::capital::set(capital),
                            compte::devise::set(devise),
                            compte::courtier::set(courtier),
                            compte::plateforme::set(plateforme),
                            compte::numero::set(numero),
                            compte::serveur::set(serveur),
                            compte::status::set(status),
                        ],
                    )
                    .exec()
                    .await?;

                Ok(compte)
            })
        })
        .mutation("delete", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct CompteDeleteArgs {
                id: i32,
            }
            t(|ctx, args: CompteDeleteArgs| async move {
                let CompteDeleteArgs { id } = args;

                let compte = ctx
                    .client
                    .compte()
                    .delete(compte::id::equals(id))
                    .exec()
                    .await?;

                Ok(compte)
            })
        })
}
