use std::fs;
use std::time::SystemTime;


use rspc::{RouterBuilder, Type, Error as RspcError};
use calamine::{Reader, open_workbook, Xlsx, DataType};
use rspc::ErrorCode::BadRequest;

use serde::{Deserialize, Serialize};


use crate::service::generate_prisma::robot;
use crate::service::generate_prisma::compte;
use crate::service::generate_prisma::optimisation;


use crate::rspc_routes::Shared;

pub fn mount() -> RouterBuilder<Shared> {
    RouterBuilder::<Shared>::new()
        .query("all", |t| {
            t(|ctx, _: ()| async move {
                let optimisations_db = ctx
                    .client
                    .optimisation()
                    .find_many(vec![])
                    .include(optimisation::include!({
                        tags: include
                        {
                            tag: select
                            {
                                name
                            }
                        }
                        robot: select
                        {
                            name
                        }
                        compte: select
                        {
                            name
                        }
                    }))
                    .exec()
                    .await?;

                Ok(optimisations_db)
            })
        })
        .query("get_by_id", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct OptimisationGetByIdArgs {
                id: i32,
            }
            t(|ctx, args: OptimisationGetByIdArgs| async move {
                let optimisation_db = ctx
                    .client
                    .optimisation()
                    .find_unique(optimisation::id::equals(args.id))
                    .include(optimisation::include!({
                        tags: include
                        {
                            tag: select
                            {
                                name
                            }
                        }
                        robot: select
                        {
                            name
                        }
                        compte: select
                        {
                            name
                        }
                    }))
                    .exec()
                    .await?;

                Ok(optimisation_db)
            })
        })
        .query("get_by_compte_id", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct OptimisationGetByCompteIdArgs {
                compte_id: i32,
            }
            t(|ctx, args: OptimisationGetByCompteIdArgs| async move {
                let optimisation_db = ctx
                    .client
                    .optimisation()
                    .find_many(vec![optimisation::compte_id::equals(Some(args.compte_id))])
                    .include(optimisation::include!({
                        tags: include
                        {
                            tag: select
                            {
                                name
                            }
                        }
                        robot: select
                        {
                            name
                        }
                        compte: select
                        {
                            name
                        }
                    }))
                    .exec()
                    .await?;

                Ok(optimisation_db)
            })
        })
        .query("get_set_data", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct GetSetDataArgs {
                path: String,
            }
            t(|_ctx, args: GetSetDataArgs| async move {
                println!("Opening file: {:?}", &args.path);

                let content = fs::read_to_string(&args.path).map_err(|err| -> RspcError {
                    RspcError::new(BadRequest, err.to_string())
                })?;

                Ok(content)
            })
        })

        .query("get_xlsm_basic_data", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct GetBasicDataArgs {
                path: String,
            }
            t(|_ctx, args: GetBasicDataArgs| async move {
                println!("Opening file: {:?}", &args.path);

                #[derive(Debug, Clone, Deserialize, Serialize, Type)]
                struct XlsmBasicData {
                    capital: f64,
                    date_debut: String,
                    decalage_court: f64,
                    decalage_court_unite: String,
                    decalage_long: f64,
                    decalage_long_unite: String,
                }

                // Si une des lignes suivantes plante, je veux retourner une erreur
                let workbook = open_workbook(&args.path);
                if workbook.is_err() {
                    return Err(RspcError::new(BadRequest, "Cannot open workbook".to_string()))
                }
                let mut workbook: Xlsx<_> = workbook.unwrap();

                let range = workbook.worksheet_range("Demarrage");
                if range.is_err() {
                    return Err(RspcError::new(BadRequest, "Cannot find worksheet 'Demarrage'".to_string()));
                }
                let range = range.unwrap();


                println!("Found worksheet 'Demarrage' {:?}", range.get_size());

                let date_debut_b2 = range.get((1, 1)).expect("Cannot get value at 1, 1");
                let decalage_court_b3 = range.get((2, 1)).expect("Cannot get value at 3, 1");
                let decalage_court_unite_c3 = range.get((2, 2)).expect("Cannot get value at 3, 2");
                let decalage_long_b4 = range.get((3, 1)).expect("Cannot get value at 4, 1");
                let decalage_long_unite_c4 = range.get((3, 2)).expect("Cannot get value at 4, 2");
                let capital_b5 = range.get((4, 1)).expect("Cannot get value at 1, 4");

                println!("Value at B2: {:?}", date_debut_b2);
                println!("Value at B3: {:?}", decalage_court_b3);
                println!("Value at C3: {:?}", decalage_court_unite_c3);
                println!("Value at B4: {:?}", decalage_long_b4);
                println!("Value at C4: {:?}", decalage_long_unite_c4);
                println!("Value at B5: {:?}", capital_b5);

                let data = XlsmBasicData {
                    capital: capital_b5.as_f64().unwrap(),
                    date_debut: date_debut_b2.as_date().unwrap().to_string(),
                    decalage_court: decalage_court_b3.as_f64().unwrap(),
                    decalage_court_unite: decalage_court_unite_c3.as_string().unwrap(),
                    decalage_long: decalage_long_b4.as_f64().unwrap(),
                    decalage_long_unite: decalage_long_unite_c4.as_string().unwrap(),
                };

                println!("Data: {:?}", data);

                Ok(data)
            })
        })

        .query("get_xlsm_lancement_data", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct GetLancementDataArgs {
                path: String,
            }
            t(|_ctx, args: GetLancementDataArgs| async move {
                println!("Opening file: {:?}", &args.path);

                #[derive(Debug, Clone, Deserialize, Serialize, Type)]
                struct XlsmLancementData {
                    nb_periodes: f64,
                    pct_periodes_rentables: String,
                    resultat_total: f64,
                    periode_resultat_moyen: f64,
                    periode_meilleur_resultat: f64,
                    periode_pire_resultat: f64,
                    dd_max: f64,
                    check_periode_validation_debut: String,
                    check_periode_validation_fin: String,
                    check_passage: f64,
                    check_resultat: f64,
                    check_resultat_mensuel: String,
                    check_dd: f64,
                    check_trades: f64,
                }

                // Si une des lignes suivantes plante, je veux retourner une erreur
                let workbook = open_workbook(&args.path);
                if workbook.is_err() {
                    return Err(RspcError::new(BadRequest, "Cannot open workbook".to_string()))
                }
                let mut workbook: Xlsx<_> = workbook.unwrap();

                let range = workbook.worksheet_range("Demarrage");
                if range.is_err() {
                    return Err(RspcError::new(BadRequest, "Cannot find worksheet 'Demarrage'".to_string()));
                }
                let range = range.unwrap();


                println!("Found worksheet 'Demarrage' {:?}", range.get_size());

                let nb_periodes_b22 = range.get((21, 1)).expect("Cannot get value at 21, 1");
                let pct_periodes_rentables_b23 = range.get((22, 1)).expect("Cannot get value at 22, 1");
                let resultat_total_b24 = range.get((23, 1)).expect("Cannot get value at 23, 1");
                let periode_resultat_moyen_b25 = range.get((24, 1)).expect("Cannot get value at 24, 1");
                let periode_meilleur_resultat_b26 = range.get((25, 1)).expect("Cannot get value at 25, 1");
                let periode_pire_resultat_b27 = range.get((26, 1)).expect("Cannot get value at 26, 1");
                let dd_max_b28 = range.get((27, 1)).expect("Cannot get value at 27, 1");
                let check_periode_validation_debut_b30 = range.get((29, 1)).expect("Cannot get value at 28, 1");
                let check_periode_validation_fin_b31 = range.get((30, 1)).expect("Cannot get value at 30, 1");
                let check_passage_b32 = range.get((31, 1)).expect("Cannot get value at 31, 1");
                let check_resultat_b33 = range.get((32, 1)).expect("Cannot get value at 32, 1");
                let check_resultat_mensuel_b34 = range.get((33, 1)).expect("Cannot get value at 33, 1");
                let check_dd_b35 = range.get((34, 1)).expect("Cannot get value at 34, 1");
                let check_trades_b36 = range.get((35, 1)).expect("Cannot get value at 35, 1");

                println!("Value at B22: {:?}", nb_periodes_b22);
                println!("Value at B23: {:?}", pct_periodes_rentables_b23);
                println!("Value at B24: {:?}", resultat_total_b24);
                println!("Value at B25: {:?}", periode_resultat_moyen_b25);
                println!("Value at B26: {:?}", periode_meilleur_resultat_b26);
                println!("Value at B27: {:?}", periode_pire_resultat_b27);
                println!("Value at B28: {:?}", dd_max_b28);
                println!("Value at B30: {:?}", check_periode_validation_debut_b30);
                println!("Value at B31: {:?}", check_periode_validation_fin_b31);
                println!("Value at B32: {:?}", check_passage_b32);
                println!("Value at B33: {:?}", check_resultat_b33);
                println!("Value at B34: {:?}", check_resultat_mensuel_b34);
                println!("Value at B35: {:?}", check_dd_b35);
                println!("Value at B36: {:?}", check_trades_b36);


                let data = XlsmLancementData {
                    nb_periodes: nb_periodes_b22.as_f64().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B22".to_string()))?,
                    pct_periodes_rentables: pct_periodes_rentables_b23.as_string().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B23".to_string()))?,
                    resultat_total: resultat_total_b24.as_f64().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B24".to_string()))?,
                    periode_resultat_moyen: periode_resultat_moyen_b25.as_f64().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B25".to_string()))?,
                    periode_meilleur_resultat: periode_meilleur_resultat_b26.as_f64().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B26".to_string()))?,
                    periode_pire_resultat: periode_pire_resultat_b27.as_f64().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B27".to_string()))?,
                    dd_max: dd_max_b28.as_f64().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B28".to_string()))?,
                    check_periode_validation_debut: check_periode_validation_debut_b30.as_datetime().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B30".to_string())).unwrap().to_string(),
                    check_periode_validation_fin: check_periode_validation_fin_b31.as_datetime().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B31".to_string())).unwrap().to_string(),
                    check_passage: check_passage_b32.as_f64().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B32".to_string()))?,
                    check_resultat: check_resultat_b33.as_f64().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B33".to_string()))?,
                    check_resultat_mensuel: check_resultat_mensuel_b34.as_string().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B34".to_string()))?,
                    check_dd: check_dd_b35.as_f64().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B35".to_string()))?,
                    check_trades: check_trades_b36.as_f64().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B36".to_string()))?,
                };

                println!("Data: {:?}", data);

                Ok(data)
            })
        })

        .query("get_xlsm_optimisation_data", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct GetOptimisationDataArgs {
                path: String,
                nb_periodes: i32
            }
            t(|_ctx, args: GetOptimisationDataArgs| async move {
                println!("Opening file: {:?}", &args.path);

                #[derive(Debug, Clone, Deserialize, Serialize, Type)]
                struct XlsmOptimisationData {
                    periodes: std::vec::Vec<String>,
                    resultats: std::vec::Vec<String>,
                    drawdowns: std::vec::Vec<String>
                }

                // Si une des lignes suivantes plante, je veux retourner une erreur
                let workbook = open_workbook(&args.path);
                if workbook.is_err() {
                    return Err(RspcError::new(BadRequest, "Cannot open workbook".to_string()))
                }
                let mut workbook: Xlsx<_> = workbook.unwrap();

                let range = workbook.worksheet_range("Optimisation");
                if range.is_err() {
                    return Err(RspcError::new(BadRequest, "Cannot find worksheet 'Optimisation'".to_string()));
                }
                let range = range.unwrap();

                println!("Found worksheet 'Optimisation' {:?}", range.get_size());

                // On commence a récupérer a la cellule B14 et on récupère un nombre de lignes qui correspond
                // au nombre de périodes

                let mut periodes = vec![];
                let mut resultats = vec![];
                let mut drawdowns = vec![];

                for i in 0..args.nb_periodes {
                    let periode = range.get(((13 + i).try_into().unwrap(), 0)).ok_or_else(|| RspcError::new(BadRequest, "Cannot get value A".to_string())).unwrap();
                    let resultat = range.get(((13 + i).try_into().unwrap(), 1)).ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B".to_string())).unwrap();
                    let drawdown = range.get(((13 + i).try_into().unwrap(), 2)).ok_or_else(|| RspcError::new(BadRequest, "Cannot get value C".to_string())).unwrap();
                    periodes.push(periode.as_datetime().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B22".to_string())).unwrap().to_string());
                    resultats.push(resultat.as_string().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B22".to_string()))?.to_string());
                    drawdowns.push(drawdown.as_string().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value B22".to_string()))?.to_string());
                }

                let data = XlsmOptimisationData {
                    periodes: periodes,
                    resultats: resultats,
                    drawdowns: drawdowns
                };

                println!("Data: {:?}", data);

                Ok(data)
            })
        })

        .query("get_xlsm_passage_data", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct GetPassageDataArgs {
                path: String,
                passage: i32
            }
            t(|_ctx, args: GetPassageDataArgs| async move {
                println!("Opening file: {:?}", &args.path);

                #[derive(Debug, Clone, Deserialize, Serialize, Type)]
                struct XlsmPassageData {
                    parametres: std::vec::Vec<String>,
                }

                // Si une des lignes suivantes plante, je veux retourner une erreur
                let workbook = open_workbook(&args.path);
                if workbook.is_err() {
                    return Err(RspcError::new(BadRequest, "Cannot open workbook".to_string()))
                }
                let mut workbook: Xlsx<_> = workbook.unwrap();

                let range = workbook.worksheet_range("AnalyseurPassages");
                if range.is_err() {
                    return Err(RspcError::new(BadRequest, "Cannot find worksheet 'AnalyseurPassages'".to_string()));
                }
                let range = range.unwrap();

                println!("Found worksheet 'AnalyseurPassages' {:?}", range.get_size());

                // On commence a récupérer a la cellule B14 et on récupère un nombre de lignes qui correspond
                // au nombre de périodes

                let mut parametres = vec![];

                // On cherche la ligne qui correspond au passage
                let mut i = 5;
                while i < range.get_size().0 {
                    let passage = range.get((i, 0)).ok_or_else(|| RspcError::new(BadRequest, "Cannot get value A".to_string())).unwrap();
                    println!("Passage: {:?}, i: {:?}", passage.as_f64().unwrap(), i);
                    if passage.as_f64().unwrap() == args.passage as f64 {
                        break;
                    }
                    i += 1;
                }

                if i == range.get_size().0 {
                    return Err(RspcError::new(BadRequest, "Cannot find passage".to_string()));
                }

                let mut j = 2;
                while j < range.get_size().1 {
                    let parametre = range.get((i, j)).ok_or_else(|| RspcError::new(BadRequest, "Cannot get value".to_string())).unwrap();
                    parametres.push(parametre.as_string().ok_or_else(|| RspcError::new(BadRequest, "Cannot get value".to_string()))?.to_string());
                    j += 1;
                }

                let data = XlsmPassageData {
                    parametres: parametres,
                };

                println!("Data: {:?}", data);

                Ok(data)
            })
        })

        .query("check_xlsm_exists", |t| {
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct CheckXlsmExistsArgs {
                path: String,
            }
            t(|_ctx, args: CheckXlsmExistsArgs| async move {
                let exists = fs::metadata(&args.path).is_ok();
                Ok(exists)
            })
        })
    .mutation("create", |t| {
        #[derive(Debug, Clone, Deserialize, Serialize, Type)]
        struct OptimisationCreateArgs {
            name: String,
            description: String,
            robot_id: i32,
            compte_id: Option<i32>,
            robot_name: String,
            capital: f64,
            date_debut: String,
            decalage_ct: i32,
            decalage_ct_unit: String,
            decalage_lt: i32,
            decalage_lt_unit: String,
            timeframe: String,
            paire: String,
            set_path: String,
            xlsm_path: String,
            app_data_dir: String
        }
        t(|ctx, args: OptimisationCreateArgs| async move {
            let OptimisationCreateArgs {
                name,
                description,
                robot_id,
                compte_id,
                robot_name,
                capital,
                date_debut,
                decalage_ct,
                decalage_ct_unit,
                decalage_lt,
                decalage_lt_unit,
                timeframe,
                paire,
                set_path,
                xlsm_path,
                app_data_dir
            } = args;

            // On cherche le path app data pour y mettre la bdd

            println!("app_data_dir: {:?}", app_data_dir);

            let now = SystemTime::now().duration_since(SystemTime::UNIX_EPOCH);

            let dir_set_path = format!("{}/{}/{}/{}", app_data_dir, robot_name, name, "sets");
            fs::create_dir_all(&dir_set_path).expect("failed to create parent directories");
            let new_set_path = format!("{}/SET_{}_{}_{}_{}.set", &dir_set_path, timeframe, paire, robot_id, now.clone().unwrap().as_secs());
            println!("set path: {:?}", set_path);
            println!("new set path: {:?}", new_set_path);
            fs::copy(set_path.clone(), new_set_path.clone()).unwrap().to_string();

            let dir_xlsm_path = format!("{}/{}/{}", app_data_dir, robot_name, name);
            fs::create_dir_all(&dir_xlsm_path).expect("failed to create parent directories");
            let new_xlsm_path = format!("{}/CO_{}_{}_{}_{}.xlsm", &dir_xlsm_path, timeframe, paire, robot_id, now.clone().unwrap().as_secs());
            println!("xslm path: {:?}", xlsm_path);
            println!("new xlsm path: {:?}", new_xlsm_path);
            fs::copy(xlsm_path.clone(), new_xlsm_path.clone()).unwrap().to_string();

            let optimisation;

            if (compte_id.is_none()) {
                optimisation = ctx.client
                    .optimisation().create(
                    robot::id::equals(robot_id),
                    name,
                    description,
                    capital,
                    date_debut,
                    decalage_ct,
                    decalage_ct_unit,
                    decalage_lt,
                    decalage_lt_unit,
                    timeframe,
                    paire,
                    new_set_path,
                    new_xlsm_path,
                    vec![],
                ).exec().await?;
            } else {
                optimisation = ctx.client
                    .optimisation().create(
                    robot::id::equals(robot_id),
                    name,
                    description,
                    capital,
                    date_debut,
                    decalage_ct,
                    decalage_ct_unit,
                    decalage_lt,
                    decalage_lt_unit,
                    timeframe,
                    paire,
                    new_set_path,
                    new_xlsm_path,
                    vec![
                        optimisation::compte_id::set(compte_id)
                    ],
                ).exec().await?;
            }

            Ok(optimisation)
        })
    })

    .mutation("delete", |t| {
        #[derive(Debug, Clone, Deserialize, Serialize, Type)]
        struct OptimisationDeleteArgs {
            id: i32,
        }
        t(|ctx, args: OptimisationDeleteArgs| async move {
            let OptimisationDeleteArgs {
                id
            } = args;

            let op = ctx.client
                .optimisation()
                .delete(optimisation::id::equals(id))
                .exec()
                .await?;

            Ok(op)
        })
    })

    .mutation("update", |t| {
        #[derive(Debug, Clone, Deserialize, Serialize, Type)]
        struct OptimisationUpdateArgs {
            id: i32,
            name: String,
            description: String,
            compte_id: Option<i32>,
            timeframe: String,
            paire: String,
        }
        t(|ctx, args: OptimisationUpdateArgs| async move {
            let OptimisationUpdateArgs {
                id,
                name,
                compte_id,
                description,
                timeframe,
                paire
            } = args;

            let op = ctx.client
                .optimisation()
                .update(
                    optimisation::id::equals(id),
                    vec![
                        optimisation::name::set(name),
                        optimisation::description::set(description),
                        optimisation::timeframe::set(timeframe),
                        optimisation::paire::set(paire),
                        optimisation::compte_id::set(compte_id)
                    ]
                )
                .exec()
                .await?;

            Ok(op)
        })
    })
}