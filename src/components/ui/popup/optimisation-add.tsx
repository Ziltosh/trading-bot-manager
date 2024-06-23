import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { H2 } from "@/components/ui/typos.tsx";
import { rspcClient } from "@/helpers/rspc.ts";
import useAppContext from "@/hooks/useAppContext.ts";
import { OptimisationCreateArgs } from "@/rspc_bindings.ts";
import { TourSteps } from "@/WelcomeTourSteps.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { open } from "@tauri-apps/api/dialog";
import { appDataDir } from "@tauri-apps/api/path";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMount } from "react-use";
import * as z from "zod";
import { util } from "zod";

import isInteger = util.isInteger;

interface PopupPortfolioAddProps {
    onClosePopup: () => void;
}

export const PopupOptimisationAdd = ({ onClosePopup }: PopupPortfolioAddProps) => {
    /** TOUR **/
    const {
        setState,
        state: { tourActive },
    } = useAppContext();

    useMount(() => {
        if (tourActive) {
            setTimeout(() => {
                setState({ run: true, stepIndex: TourSteps.TOUR_OPTIMISATION_ADD_POPUP });
            }, 100);
        }
    });
    /** END TOUR **/

    // const fileNameRegex = /^[^<>:"/\\|?*]+$/;
    const [isError] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [errorMessage] = useState("");
    const [defaultTags] = useState([
        { value: "Grid" },
        { value: "Martingale" },
        { value: "REB" },
        { value: "MT4" },
        { value: "MT5" },
        { value: "Lot fixe" },
        { value: "Lot variable" },
        { value: "Stop loss" },
        { value: "Safe" },
        { value: "Aggressif" },
        { value: "Prop firm" },
        { value: "Non Trading DD" },
        { value: "Tick par tick" },
        { value: "Filtre news" },
    ]);
    const [timeframes] = useState(["M1", "M5", "M15", "M30", "H1", "H4", "D"]);
    // const [optimisationName, setOptimisationName] = useState(
    //     "OP #" +
    //         Math.floor(Math.random() * 10_000_000)
    //             .toString(16)
    //             .toUpperCase()
    //             .padStart(6, "0"),
    // );

    const queryClient = useQueryClient();

    const { data: dataRobotsAll, isSuccess: isSuccessRobotsAll } = useQuery({
        queryKey: ["robots.all"],
        queryFn: async () => {
            return await rspcClient.query(["robots.all"]);
        },
    });

    const { data: dataComptesAll, isSuccess: isSuccessComptesAll } = useQuery({
        queryKey: ["comptes.all"],
        queryFn: async () => {
            const comptes = [];
            comptes.push(...(await rspcClient.query(["comptes.get_reel"])));
            comptes.push(...(await rspcClient.query(["comptes.get_prop"])));
            comptes.push(...(await rspcClient.query(["comptes.get_demo"])));
            return comptes;
        },
    });

    const formSchema = z.object({
        // name: z.string().min(4).max(25).regex(fileNameRegex, "Cacactères non autorisés"),
        robot_id: z.string().refine((val) => isInteger(parseInt(val, 10)) && parseInt(val, 10) > 0),
        compte_id: z.string().optional(),
        description: z.string(),
        capital: z.number(),
        date_debut: z.string(),
        decalage_ct: z.number(),
        decalage_ct_unit: z.string().refine((val) => ["mois", "jours"].includes(val)),
        decalage_lt: z.number(),
        decalage_lt_unit: z.string().refine((val) => ["années", "mois"].includes(val)),
        timeframe: z.string().refine((val) => ["M1", "M5", "M15", "M30", "H1", "H4", "D"].includes(val)),
        paire: z.string().length(6),
        set_path: z.string(),
        xlsm_path: z.string(),
        tags: z
            .array(
                z.object({
                    value: z.string(),
                }),
            )
            .min(1),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            description: "",
            paire: "EURUSD",
            timeframe: "H4",
            tags: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "tags",
        control: form.control,
    });

    const [xlsmFilePath, setXlsmFilePath] = useState("");
    useEffect(() => {
        if (xlsmFilePath === "") return;
        rspcClient
            .query(["optimisations.get_xlsm_basic_data", { path: xlsmFilePath }])
            .then((res) => {
                form.setValue("capital", res.capital);
                form.setValue("date_debut", res.date_debut);
                form.setValue("decalage_ct", res.decalage_court);
                form.setValue("decalage_ct_unit", res.decalage_court_unite);
                form.setValue("decalage_lt", res.decalage_long);
                form.setValue("decalage_lt_unit", res.decalage_long_unite);
            })
            .catch((err) => {
                console.log(err);
                form.setError("xlsm_path", {
                    type: "manual",
                    message: "Erreur lors du parcours du fichier, êtes vous sûr que c'est un fichier d'optimisation ?",
                });
            });
    }, [form, xlsmFilePath]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsCreating(true);

        try {
            const nomRobot = dataRobotsAll!.find((robot) => robot.id === parseInt(values.robot_id, 10))!.name;

            const optimisationName = `${nomRobot} - ${values.paire} - ${values.timeframe}`;

            const args: OptimisationCreateArgs = {
                ...values,
                name: optimisationName,
                robot_id: parseInt(values.robot_id, 10),
                compte_id: values.compte_id ? parseInt(values.compte_id, 10) : null,
                app_data_dir: await appDataDir(),
                robot_name: dataRobotsAll!.find((robot) => robot.id === parseInt(values.robot_id, 10))!.name,
            };
            console.log(args);
            const optimisation = await rspcClient.mutation(["optimisations.create", args]);
            console.log(optimisation);
            for (let i = 0; i < values.tags.length; i++) {
                await rspcClient.mutation([
                    "tags.create_for_optimisation",
                    {
                        tag: values.tags[i].value,
                        optimisation_id: optimisation.id,
                    },
                ]);
            }
            //
            await queryClient.invalidateQueries({ queryKey: ["optimisations.all"] });

            onClosePopup();
        } catch (e) {
            console.error(e);
            // setError(e.message);
        }
        setIsCreating(false);
    };

    return (
        <div
            className="absolute z-20 flex h-full w-full items-center overflow-y-scroll py-2 backdrop-blur-md transition-all"
            onClick={onClosePopup}
        >
            <div
                className="m-auto w-2/3 flex-col gap-2 rounded-lg border bg-background p-4 shadow-md"
                onClick={(e) => e.stopPropagation()}
            >
                <H2 className={"tour-optimisations-add-popup"}>Ajouter une optimisation</H2>
                {isError && (
                    <Alert variant={"destructive"} className={"w-max"}>
                        <AlertCircle className={"h-4 w-4"} />
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className={"flex flex-col space-y-4"}>
                        {/*<FormField*/}
                        {/*    control={form.control}*/}
                        {/*    name={"name"}*/}
                        {/*    render={({ field }) => (*/}
                        {/*        <FormItem>*/}
                        {/*            <FormLabel>Nom de l'optimisation</FormLabel>*/}
                        {/*            <FormControl>*/}
                        {/*                <Input {...field} />*/}
                        {/*            </FormControl>*/}
                        {/*            <FormMessage />*/}
                        {/*        </FormItem>*/}
                        {/*    )}*/}
                        {/*/>*/}

                        <FormField
                            control={form.control}
                            name={"description"}
                            render={({ field }) => (
                                <FormItem className={"tour-optimisations-add-description"}>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder={"Description..."} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={"paire"}
                            render={({ field }) => (
                                <FormItem className={"tour-optimisations-add-paire"}>
                                    <FormLabel>Paire</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={"robot_id"}
                            render={({ field }) => (
                                <FormItem className={"tour-optimisations-add-robot"}>
                                    <FormLabel>Robot</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choisir un robot" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {isSuccessRobotsAll &&
                                                    dataRobotsAll.map((robot) => (
                                                        <SelectItem key={robot.id} value={robot.id.toString()}>
                                                            {robot.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={"compte_id"}
                            render={({ field }) => (
                                <FormItem className={"tour-optimisations-add-compte"}>
                                    <FormLabel>Compte (facultatif)</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choisir un compte" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {isSuccessComptesAll &&
                                                    dataComptesAll.map((compte) => (
                                                        <SelectItem
                                                            key={compte.id.toString()}
                                                            value={compte.id.toString()}
                                                            className={"flex flex-col items-start"}
                                                        >
                                                            {compte.name}
                                                            <div className={"uppercase text-accent"}>
                                                                {compte.type_compte}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={"timeframe"}
                            render={({ field }) => (
                                <FormItem className={"tour-optimisations-add-timeframe"}>
                                    <FormLabel>Unité de temps</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choisir une timeframe" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {timeframes.map((tf) => (
                                                    <SelectItem key={tf} value={tf}>
                                                        {tf}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="tour-optimisations-add-tags space-y-2">
                            <FormLabel>Tags</FormLabel>
                            <div className={"flex flex-row flex-wrap gap-2"}>
                                {fields.map((field, index) => (
                                    <div key={`div_${field.id}`}>
                                        <Badge
                                            key={`badge_${field.id}`}
                                            variant={"secondary"}
                                            className={"cursor-pointer bg-accent"}
                                            onClick={() => remove(index)}
                                        >
                                            {field.value}
                                        </Badge>
                                        <FormField
                                            control={form.control}
                                            key={field.id}
                                            name={`tags.${index}.value`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input className={"hidden"} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>

                            <FormLabel>Ajouter un tag</FormLabel>
                            <div className="flex flex-wrap gap-2">
                                {defaultTags.map((tag, index) => (
                                    <Badge
                                        key={`badge_${index}`}
                                        variant={
                                            fields.filter((el) => el.value === tag.value).length > 0
                                                ? "outline"
                                                : "secondary"
                                        }
                                        className={
                                            fields.filter((el) => el.value === tag.value).length === 0
                                                ? "cursor-pointer hover:bg-accent"
                                                : ""
                                        }
                                        onClick={() => {
                                            if (fields.filter((el) => el.value === tag.value).length === 0) {
                                                append({ value: tag.value });
                                            }
                                        }}
                                    >
                                        {tag.value}
                                    </Badge>
                                ))}
                            </div>
                            <Input
                                type={"text"}
                                placeholder={"Tag personnalisé, entrée pour valider"}
                                onKeyDown={(e) => {
                                    // Si la touche entrée est pressée, on ajoute un tag avec la valeur de l'input
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        append({ value: e.currentTarget.value });
                                        e.currentTarget.value = "";
                                    }
                                }}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name={"set_path"}
                            render={({ field }) => (
                                <FormItem className={"tour-optimisations-add-set flex flex-col"}>
                                    <FormLabel>Fichier .set</FormLabel>
                                    <FormMessage />
                                    <Input {...field} readOnly={true} />
                                    <Button
                                        type={"button"}
                                        variant={"secondary"}
                                        onClick={async () => {
                                            const path = await open({
                                                filters: [
                                                    {
                                                        name: "Fichier .set",
                                                        extensions: ["set"],
                                                    },
                                                ],
                                            });
                                            if (path) {
                                                form.setValue("set_path", path.toString());
                                            }
                                        }}
                                    >
                                        Choisir le fichier
                                    </Button>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={"xlsm_path"}
                            render={({ field }) => (
                                <FormItem className={"tour-optimisations-add-xlsm flex flex-col"}>
                                    <FormLabel>Fichier Excel</FormLabel>
                                    <FormMessage />
                                    <Input {...field} readOnly={true} />
                                    <Button
                                        type={"button"}
                                        variant={"secondary"}
                                        onClick={async () => {
                                            const path = await open({
                                                filters: [
                                                    {
                                                        name: "Fichier Excel",
                                                        extensions: ["xlsm"],
                                                    },
                                                ],
                                            });
                                            if (path) {
                                                form.setValue("xlsm_path", path.toString());
                                                setXlsmFilePath(path.toString());
                                            }
                                        }}
                                    >
                                        Choisir le fichier
                                    </Button>
                                </FormItem>
                            )}
                        />

                        <Separator />

                        {xlsmFilePath !== "" && (
                            <>
                                <p>
                                    Les paramètres suivants ne sont pas modifiables et sont importés directement depuis
                                    le fichier excel. Ils permettent de vérifier les infos avant de valider l'ajout.
                                </p>

                                <FormField
                                    control={form.control}
                                    name={"capital"}
                                    render={({ field }) => (
                                        <FormItem className={"flex flex-col"}>
                                            <FormLabel>Capital</FormLabel>
                                            <FormMessage />
                                            <Input type={"number"} {...field} readOnly={true} />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={"date_debut"}
                                    render={({ field }) => (
                                        <FormItem className={"flex flex-col"}>
                                            <FormLabel>Date de début</FormLabel>
                                            <FormMessage />
                                            <Input type={"date"} {...field} readOnly={true} />
                                        </FormItem>
                                    )}
                                />

                                <FormLabel>Décalage court terme</FormLabel>
                                <div className="flex gap-2">
                                    <FormField
                                        control={form.control}
                                        name={"decalage_ct"}
                                        render={({ field }) => (
                                            <FormItem className={"flex flex-col"}>
                                                <FormMessage />
                                                <Input {...field} readOnly={true} />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={"decalage_ct_unit"}
                                        render={({ field }) => (
                                            <FormItem className={"flex flex-col"}>
                                                <FormMessage />
                                                <Input {...field} readOnly={true} />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormLabel>Décalage long terme</FormLabel>
                                <div className="flex gap-2">
                                    <FormField
                                        control={form.control}
                                        name={"decalage_lt"}
                                        render={({ field }) => (
                                            <FormItem className={"flex flex-col"}>
                                                <FormMessage />
                                                <Input {...field} readOnly={true} />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={"decalage_lt_unit"}
                                        render={({ field }) => (
                                            <FormItem className={"flex flex-col"}>
                                                <FormMessage />
                                                <Input {...field} readOnly={true} />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex gap-2 self-center">
                            <Button type={"button"} variant={"secondary"} onClick={onClosePopup}>
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={isCreating}
                                className={"tour-optimisations-add-create self-center"}
                            >
                                {isCreating ? "Création en cours..." : "Créer"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};
