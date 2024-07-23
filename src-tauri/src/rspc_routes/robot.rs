use std::fs;

use rspc::{RouterBuilder, Type};

use serde::{Deserialize, Serialize};

use crate::rspc_routes::Shared;
use crate::service::generate_prisma::robot;

pub fn mount() -> RouterBuilder<Shared> {
    RouterBuilder::<Shared>::new()
        .query("all", |t| {
            t(|ctx, _: ()| async move {
                let robots_db = ctx
                    .client
                    .robot()
                    .find_many(vec![])
                    .include(robot::include!({
                        tags: include {
                            tag: select {
                                name
                            }
                        }
                    }))
                    .exec()
                    .await?;

                Ok(robots_db)
            })
        })
        .query("get_by_id", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct RobotGetByIdArgs {
                id: i32,
            }
            t(|ctx, args: RobotGetByIdArgs| async move {
                let robot_db = ctx
                    .client
                    .robot()
                    .find_unique(robot::id::equals(args.id))
                    .include(robot::include!({
                        tags: include {
                            tag: select {
                                name
                            }
                        }
                    }))
                    .exec()
                    .await?;

                Ok(robot_db)
            })
        })
        .query("open_set_file", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct OpenSetFileArgs {
                path: String,
            }
            t(|_ctx, args: OpenSetFileArgs| async move {
                println!("Opening file: {:?}", &args.path);
                let content =
                    fs::read_to_string(&args.path).expect("Something went wrong reading the file");
                Ok(content)
            })
        })
        .mutation("create", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct RobotCreateArgs {
                name: String,
                chemin: String,
                description: String,
                json_settings: String,
            }
            t(|ctx, args: RobotCreateArgs| async move {
                let RobotCreateArgs {
                    name,
                    chemin,
                    description,
                    json_settings,
                } = args;

                let robot = ctx
                    .client
                    .robot()
                    .create(
                        name,
                        vec![
                            robot::description::set(description),
                            robot::chemin::set(chemin),
                            robot::json_settings::set(json_settings),
                        ],
                    )
                    .exec()
                    .await?;

                Ok(robot)
            })
        })
        .mutation("update", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct RobotUpdateArgs {
                id: i32,
                name: String,
                chemin: String,
                description: String,
                json_settings: String,
            }
            t(|ctx, args: RobotUpdateArgs| async move {
                let RobotUpdateArgs {
                    id,
                    name,
                    chemin,
                    description,
                    json_settings,
                } = args;

                let robot;

                robot = ctx
                    .client
                    .robot()
                    .update(
                        robot::id::equals(id),
                        vec![
                            robot::name::set(name),
                            robot::chemin::set(chemin),
                            robot::description::set(description),
                            robot::json_settings::set(json_settings),
                        ],
                    )
                    .exec()
                    .await?;

                Ok(robot)
            })
        })
        .mutation("delete", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct RobotDeleteArgs {
                id: i32,
            }
            t(|ctx, args: RobotDeleteArgs| async move {
                let RobotDeleteArgs { id } = args;

                let compte = ctx
                    .client
                    .robot()
                    .delete(robot::id::equals(id))
                    .exec()
                    .await?;

                Ok(compte)
            })
        })
}
