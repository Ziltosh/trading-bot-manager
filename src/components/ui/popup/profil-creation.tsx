import { Button } from "@/components/ui/button.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { H2, H3 } from "@/components/ui/typos";
import { rspcClient } from "@/helpers/rspc";
import { useGlobalStore } from "@/stores/global-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { useQuery } from "@tanstack/react-query";
import { InfoIcon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import CheminRobotImg from "../../../assets/img/chemin_robot.jpg";
import { cleanParams, make } from "@/helpers/chrFiles";
import { generateChrFromParams, mergeSetParams } from "@/helpers/setFiles";
import { dialog } from "@tauri-apps/api";

interface PopupProfilCreationProps {
    onClosePopup: () => void;
}

const formSchema = z.object({
    optis: z.array(
        z.object({
            paire: z.string(),
            robotPath: z.string(),
            nonTradingDD: z.string(),
            periode: z.number(),
            xlsm_path: z.string(),
            set_path: z.string(),
        }),
    ),
});

export const PopupProfilCreation = ({ onClosePopup }: PopupProfilCreationProps) => {
    const { currentCompte } = useGlobalStore();

    const { isSuccess: isSuccessOptiByCompte, data: dataOptiByCompte } = useQuery({
        queryKey: ["optimisations.get_by_compte_id", { id: currentCompte!.id! }],
        queryFn: () => {
            return rspcClient.query(["optimisations.get_by_compte_id", { compte_id: currentCompte!.id! }]);
        },
        enabled: currentCompte !== undefined,
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "optis",
    });

    useEffect(() => {
        remove();
        if (isSuccessOptiByCompte) {
            const tfInMinutes = {
                M1: 1,
                M5: 5,
                M15: 15,
                M30: 30,
                H1: 60,
                H4: 240,
                D1: 1440,
            };

            dataOptiByCompte?.forEach((opti) => {
                append(
                    {
                        nonTradingDD: "0",
                        paire: opti.paire,
                        robotPath: `${opti.robot.name}`,
                        xlsm_path: opti.xlsm_path,
                        set_path: opti.set_path,
                        periode: tfInMinutes[opti.timeframe as keyof typeof tfInMinutes],
                    },
                    {
                        shouldFocus: false,
                    },
                );
            });
        }
    }, [dataOptiByCompte, append, remove, fields.length, isSuccessOptiByCompte]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!currentCompte) {
            return;
        }

        const savePath = await dialog.open({
            directory: true,
            multiple: false,
            title: "Sélectionnez un dossier de sauvegarde",
            // defaultPath: await appDataDir(),
            // filters: [{ name: currentCompte.name, extensions: ["zip"] }],
        });

        if (!savePath) {
            return;
        }

        if (Array.isArray(savePath)) {
            return;
        }

        await rspcClient.query(["zip.create_directory", { name: currentCompte.name, folder: savePath }]);

        let index = 1;
        for (const opti of values.optis) {
            const dataLancementData = await rspcClient.query([
                "optimisations.get_xlsm_lancement_data",
                { path: opti.xlsm_path },
            ]);

            const passageParamsStr = await rspcClient.query([
                "optimisations.get_xlsm_passage_data",
                {
                    path: opti.xlsm_path,
                    passage: dataLancementData!.check_passage,
                },
            ]);

            let optiSetParams = await rspcClient.query([
                "optimisations.get_set_data",
                {
                    path: opti.set_path,
                },
            ]);

            optiSetParams = cleanParams(optiSetParams);

            const passageSetParams = generateChrFromParams(passageParamsStr);

            let file = mergeSetParams(optiSetParams, passageSetParams, "temp", true, {
                Non_Trading_DD: opti.nonTradingDD,
            });

            file = file
                .split("\n")
                .filter((line) => line.trim() !== "")
                .join("\n");

            file = file
                .split("\r")
                .filter((line) => line.trim() !== "")
                .join("\r");

            const chr = make({
                flags: 279,
                id: Math.ceil(Math.random() * 1_000_000_000_000_000),
                symbol: opti.paire,
                period: opti.periode,
                robotPath: opti.robotPath,
                inputs: file,
            });

            await rspcClient.query([
                "zip.create_file",
                {
                    path: savePath,
                    folder: currentCompte.name,
                    name: `chart${index.toString().padStart(2, "0")}.chr`,
                    content: chr,
                },
            ]);
            index++;
        }

        await rspcClient.query([
            "zip.zip_directory",
            { path: savePath, folder: currentCompte.name, zip_name: `MT4_Profile_${currentCompte.name}` },
        ]);

        onClosePopup();
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
                <H2>Création du profil MT4</H2>
                <div className="flex flex-col gap-3">
                    <p>Vous avez 3 champs a rentrer pour chacun des robots qui tournera sur le compte.</p>
                    <p>
                        <strong>Paire:</strong> Correspond au nom de la paire exacte de votre courtier, parfois ce n'est
                        pas EURUSD mais EURUSD.p ou EURUSD+ par exemple.
                    </p>
                    <p>
                        <strong>Chemin du robot:</strong> Ce champ correspond au chemin du robot dans l'arborescence
                        MT4, le départ de l'arborescence est le "dossier" Expert Consultant. Par exemple, si vous avez
                        mis tout les robots REB dans un dossier REB, alors rentrez "REB\Nom du robot v2.0" dans le champ
                        ci-dessous.
                        <br />
                        Exemple:{" "}
                        <TooltipProvider>
                            <Tooltip delayDuration={50}>
                                <TooltipTrigger asChild>
                                    <InfoIcon className="inline-flex h-4 w-4 cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent className="space-y-2 bg-white p-4">
                                    <img src={CheminRobotImg} />
                                    <p>
                                        Dans ce cas mettre <i>REB\REB-EMA-BB v3.1</i> par exemple
                                        <br />
                                        ou <i>REB\REB Strategy Creator v3.2</i>.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </p>
                    <p>
                        <strong>Non Trading DD: </strong>Si ce champ est positif, le paramètre Non Trading DD sera
                        rempli dans les paramètres du robot. Ne fonctionne que pour les robots REB.
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className={"flex flex-col space-y-4"}>
                        {fields?.map((opti, key) => {
                            return (
                                <div key={opti.id} className="mt-2">
                                    <H3>
                                        Optimisation {key + 1} / {dataOptiByCompte?.length}
                                    </H3>
                                    <FormField
                                        control={form.control}
                                        name={`optis.${key}.paire`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Paire</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder={opti.paire} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`optis.${key}.robotPath`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Chemin du robot</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder={opti.robotPath} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`optis.${key}.nonTradingDD`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Non trading DD</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="text" placeholder="0" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`optis.${key}.xlsm_path`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} type="hidden" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`optis.${key}.set_path`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} type="hidden" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`optis.${key}.periode`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} type="hidden" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            );
                        })}

                        <div className="flex gap-2 self-center">
                            <Button type={"button"} variant={"secondary"} onClick={onClosePopup}>
                                Annuler
                            </Button>
                            <Button type="submit" className={"self-center"}>
                                Créer le profil
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};
