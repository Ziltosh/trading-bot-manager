use rspc::{RouterBuilder, Type};
use serde::{Deserialize, Serialize};

use crate::rspc_routes::Shared;
use crate::service::generate_prisma::{compte, optimisation, robot, tag};

pub fn mount() -> RouterBuilder<Shared> {
    RouterBuilder::<Shared>::new()
        .query("get_by_robot", |t| {
            t(|ctx, _: ()| async move {
                let robots = ctx
                    .client
                    .robot()
                    .find_first(vec![])
                    .exec()
                    .await?;

                Ok(robots)
            })
        })

        .mutation("create_for_compte", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct TagCompteCreateArgs {
                tag: String,
                compte_id: i32,
            }
            t(|ctx, args: TagCompteCreateArgs| async move {
                let TagCompteCreateArgs {
                    tag,
                    compte_id,
                } = args;

                // On vérifie si le tag existe
                let tag_db: Option<tag::Data> = ctx.client
                    .tag()
                    .find_first(
                        vec![
                            tag::name::equals(tag.clone()),
                            tag::cible::equals("compte".to_string()),
                        ]
                    )
                    .exec()
                    .await?;

                // Si le tag n'existe pas, on le crée
                let tag_db = match tag_db {
                    Some(tag_db) => tag_db,
                    None => ctx.client
                        .tag()
                        .create(
                            "compte".to_string(),
                            tag,
                            vec![],
                        )
                        .exec()
                        .await?,
                };


                ctx.client
                    .compte_tag()
                    .create(
                        compte::id::equals(compte_id),
                        tag::id::equals(tag_db.id),
                        vec![],
                    ).exec().await?;

                Ok(tag_db)
            })
        })

        .mutation("create_for_robot", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct TagRobotCreateArgs {
                tag: String,
                robot_id: i32,
            }
            t(|ctx, args: TagRobotCreateArgs| async move {
                let TagRobotCreateArgs {
                    tag,
                    robot_id,
                } = args;

                // On vérifie si le tag existe
                let tag_db: Option<tag::Data> = ctx.client
                    .tag()
                    .find_first(
                        vec![
                            tag::name::equals(tag.clone()),
                            tag::cible::equals("robot".to_string()),
                        ]
                    ).exec().await?;

                // Si le tag n'existe pas, on le crée
                let tag_db = match tag_db {
                    Some(tag_db) => tag_db,
                    None => ctx.client
                        .tag()
                        .create(
                            "robot".to_string(),
                            tag,
                            vec![],
                        ).exec().await?,
                };

                ctx.client
                    .robot_tag()
                    .create(
                        robot::id::equals(robot_id),
                        tag::id::equals(tag_db.id),
                        vec![],
                    ).exec().await?;

                Ok(tag_db)
            })
        })

        .mutation("create_for_optimisation", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct TagOptimisationCreateArgs {
                tag: String,
                optimisation_id: i32,
            }
            t(|ctx, args: TagOptimisationCreateArgs| async move {
                let TagOptimisationCreateArgs {
                    tag,
                    optimisation_id,
                } = args;

                // On vérifie si le tag existe
                let tag_db: Option<tag::Data> = ctx.client
                    .tag()
                    .find_first(
                        vec![
                            tag::name::equals(tag.clone()),
                            tag::cible::equals("optimisation".to_string()),
                        ])
                    .exec().await?;

                // Si le tag n'existe pas, on le crée
                let tag_db = match tag_db {
                    Some(tag_db) => tag_db,
                    None => ctx.client
                        .tag()
                        .create(
                            "optimisation".to_string(),
                            tag,
                            vec![],
                        ).exec().await?,
                };

                ctx.client
                    .optimisation_tag()
                    .create(
                        optimisation::id::equals(optimisation_id),
                        tag::id::equals(tag_db.id),
                        vec![],
                    ).exec().await?;

                Ok(tag_db)
            })
        })
}