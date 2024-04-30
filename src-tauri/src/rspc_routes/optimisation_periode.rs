use rspc::{RouterBuilder, Type};
use serde::{Deserialize, Serialize};

use crate::rspc_routes::Shared;
use crate::service::generate_prisma::{optimisation, optimisation_periode};

pub fn mount() -> RouterBuilder<Shared> {
    RouterBuilder::<Shared>::new()
        .query("get_by_optimisation_id", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct OptimisationPeriodeGetByOptimisationIdArgs {
                optimisation_id: i32,
            }
            t(|ctx, args: OptimisationPeriodeGetByOptimisationIdArgs| async move {
                let periodes_db = ctx
                    .client
                    .optimisation_periode()
                    .find_many(vec![optimisation_periode::optimisation_id::equals(args.optimisation_id)])
                    .exec()
                    .await?;

                Ok(periodes_db)
            })
        })
        .mutation("create", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct OptimisationPeriodeUpsertArgs {
                optimisation_id: i32,
                periode: String,
                profit: f64,
                drawdown: f64,
            }
            t(|ctx, args: OptimisationPeriodeUpsertArgs| async move {
                let OptimisationPeriodeUpsertArgs {
                    optimisation_id,
                    periode,
                    profit,
                    drawdown,
                } = args;

                // println!("optimisation_id = {:?}", optimisation_id);
                // println!("periode = {:?}", periode);
                // println!("profit = {:?}", profit);
                // println!("drawdown = {:?}", drawdown);

                // On teste si le même enregistrement existe déjà
                let periodes_db = ctx
                    .client
                    .optimisation_periode()
                    .find_many(vec![
                        optimisation_periode::optimisation_id::equals(optimisation_id),
                        optimisation_periode::periode::equals(periode.clone()),
                        optimisation_periode::profit::equals(profit),
                        optimisation_periode::drawdown::equals(drawdown),
                    ])
                    .exec()
                    .await?;

                // println!("periodes_db.len() = {:?}", periodes_db.len());

                if periodes_db.len() > 0 {
                    return Ok(periodes_db[0].clone());
                }

                let optimisation_periode = ctx.client
                    .optimisation_periode().create(
                    optimisation::id::equals(optimisation_id),
                    periode,
                    profit,
                    drawdown,
                    vec![],
                ).exec().await?;

                Ok(optimisation_periode)
            })
        })
        .mutation("delete_for_optimisation_id", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct OptimisationPeriodeDeleteOptimisationIdArgs {
                optimisation_id: i32,
            }
            t(|ctx, args: OptimisationPeriodeDeleteOptimisationIdArgs| async move {
                let OptimisationPeriodeDeleteOptimisationIdArgs {
                    optimisation_id,
                } = args;

                ctx.client
                    .optimisation_periode()
                    .delete_many(vec![optimisation_periode::optimisation_id::equals(optimisation_id)])
                    .exec()
                    .await?;

                Ok(())
            })
        })
}