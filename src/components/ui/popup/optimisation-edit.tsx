import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { H2 } from "@/components/ui/typos.tsx";
import { rspcClient } from "@/helpers/rspc.ts";
import { useGlobalStore } from "@/stores/global-store.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface PopupPortfolioEditProps {
    onClosePopup: () => void;
}

export const PopupOptimisationEdit = ({ onClosePopup }: PopupPortfolioEditProps) => {
    const fileNameRegex = /^[^<>:"/\\|?*]+$/;
    const [isError] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [errorMessage] = useState("");
    let forceRefresh = new Date().getTime();

    const timeframes = ["M1", "M5", "M15", "M30", "H1", "H4", "D"];

    const { currentOptimisation: optimisation } = useGlobalStore();

    const queryClient = useQueryClient();

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
        name: z.string().min(4).max(50).regex(fileNameRegex, "Cacactères non autorisés"),
        description: z.string(),
        capital: z.number(),
        compte_id: z.string().optional(),
        timeframe: z.string().refine((val) => ["M1", "M5", "M15", "M30", "H1", "H4", "D"].includes(val)),
        paire: z.string().length(6),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            name: optimisation?.name,
            capital: optimisation?.capital,
            description: optimisation?.description,
            paire: optimisation?.paire,
            compte_id: optimisation?.compteId?.toString(),
            timeframe: optimisation?.timeframe,
        },
    });

    useEffect(() => {
        if (!optimisation) return;
        form.setValue("name", optimisation.name);
        form.setValue("description", optimisation.description);
        form.setValue("paire", optimisation.paire);
        if (optimisation.compteId !== null) form.setValue("compte_id", optimisation.compteId.toString());
        form.setValue("timeframe", optimisation.timeframe);
        forceRefresh = new Date().getTime();
    }, [optimisation, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsCreating(true);

        await rspcClient.mutation([
            "optimisations.update",
            {
                id: optimisation!.id,
                name: values.name,
                description: values.description,
                compte_id: values.compte_id ? parseInt(values.compte_id, 10) : null,
                paire: values.paire,
                timeframe: values.timeframe,
            },
        ]);

        await queryClient.invalidateQueries({ queryKey: ["optimisations.all"] });

        setIsCreating(false);
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
                <H2>Modifier une optimisation</H2>
                {isError && (
                    <Alert variant={"destructive"} className={"w-max"}>
                        <AlertCircle className={"h-4 w-4"} />
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className={"flex flex-col space-y-4"}>
                        <FormField
                            control={form.control}
                            name={"name"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom de l'optimisation</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={"description"}
                            render={({ field }) => (
                                <FormItem>
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
                                <FormItem>
                                    <FormLabel>Paire</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/*<FormField*/}
                        {/*    control={form.control}*/}
                        {/*    name={"robot_id"}*/}
                        {/*    render={({ field }) => (*/}
                        {/*        <FormItem>*/}
                        {/*            <FormLabel>Robot</FormLabel>*/}
                        {/*            <FormControl>*/}
                        {/*                <Select onValueChange={field.onChange}>*/}
                        {/*                    <FormControl>*/}
                        {/*                        <SelectTrigger>*/}
                        {/*                            <SelectValue placeholder="Choisir un robot" />*/}
                        {/*                        </SelectTrigger>*/}
                        {/*                    </FormControl>*/}
                        {/*                    <SelectContent>*/}
                        {/*                        {isSuccessRobotsAll &&*/}
                        {/*                            dataRobotsAll.map((robot) => (*/}
                        {/*                                <SelectItem key={robot.id} value={robot.id.toString()}>*/}
                        {/*                                    {robot.name}*/}
                        {/*                                </SelectItem>*/}
                        {/*                            ))}*/}
                        {/*                    </SelectContent>*/}
                        {/*                </Select>*/}
                        {/*            </FormControl>*/}
                        {/*            <FormMessage />*/}
                        {/*        </FormItem>*/}
                        {/*    )}*/}
                        {/*/>*/}

                        <FormField
                            control={form.control}
                            name={"compte_id"}
                            key={`cpt_${forceRefresh}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Compte (facultatif)</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choisir un compte" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {isSuccessComptesAll &&
                                                    dataComptesAll.map((compte) => (
                                                        <SelectItem
                                                            key={compte.id}
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
                            key={`tf_${forceRefresh}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unité de temps</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={optimisation?.timeframe}>
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

                        {/*<FormLabel>Tags</FormLabel>*/}
                        {/*<div className={"flex flex-row flex-wrap gap-2"}>*/}
                        {/*    {fields.map((field, index) => (*/}
                        {/*        <div key={`div_${field.id}`}>*/}
                        {/*            <Badge*/}
                        {/*                key={`badge_${field.id}`}*/}
                        {/*                variant={"secondary"}*/}
                        {/*                className={"cursor-pointer bg-accent"}*/}
                        {/*                onClick={() => remove(index)}*/}
                        {/*            >*/}
                        {/*                {field.value}*/}
                        {/*            </Badge>*/}
                        {/*            <FormField*/}
                        {/*                control={form.control}*/}
                        {/*                key={field.id}*/}
                        {/*                name={`tags.${index}.value`}*/}
                        {/*                render={({ field }) => (*/}
                        {/*                    <FormItem>*/}
                        {/*                        <FormControl>*/}
                        {/*                            <Input className={"hidden"} {...field} />*/}
                        {/*                        </FormControl>*/}
                        {/*                        <FormMessage />*/}
                        {/*                    </FormItem>*/}
                        {/*                )}*/}
                        {/*            />*/}
                        {/*        </div>*/}
                        {/*    ))}*/}
                        {/*</div>*/}

                        {/*<FormLabel>Ajouter un tag</FormLabel>*/}
                        {/*<div className="flex flex-wrap gap-2">*/}
                        {/*    {defaultTags.map((tag, index) => (*/}
                        {/*        <Badge*/}
                        {/*            key={`badge_${index}`}*/}
                        {/*            variant={*/}
                        {/*                fields.filter((el) => el.value === tag.value).length > 0*/}
                        {/*                    ? "outline"*/}
                        {/*                    : "secondary"*/}
                        {/*            }*/}
                        {/*            className={*/}
                        {/*                fields.filter((el) => el.value === tag.value).length === 0*/}
                        {/*                    ? "cursor-pointer hover:bg-accent"*/}
                        {/*                    : ""*/}
                        {/*            }*/}
                        {/*            onClick={() => {*/}
                        {/*                if (fields.filter((el) => el.value === tag.value).length === 0) {*/}
                        {/*                    append({ value: tag.value });*/}
                        {/*                }*/}
                        {/*            }}*/}
                        {/*        >*/}
                        {/*            {tag.value}*/}
                        {/*        </Badge>*/}
                        {/*    ))}*/}
                        {/*</div>*/}
                        {/*<Input*/}
                        {/*    type={"text"}*/}
                        {/*    placeholder={"Tag personnalisé, entrée pour valider"}*/}
                        {/*    onKeyDown={(e) => {*/}
                        {/*        // Si la touche entrée est pressée, on ajoute un tag avec la valeur de l'input*/}
                        {/*        if (e.key === "Enter") {*/}
                        {/*            e.preventDefault();*/}
                        {/*            append({ value: e.currentTarget.value });*/}
                        {/*            e.currentTarget.value = "";*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*/>*/}

                        {/*<FormField*/}
                        {/*    control={form.control}*/}
                        {/*    name={"set_path"}*/}
                        {/*    render={({ field }) => (*/}
                        {/*        <FormItem className={"flex flex-col"}>*/}
                        {/*            <FormLabel>Fichier .set</FormLabel>*/}
                        {/*            <FormMessage />*/}
                        {/*            <Input {...field} readOnly={true} />*/}
                        {/*            <Button*/}
                        {/*                type={"button"}*/}
                        {/*                variant={"secondary"}*/}
                        {/*                onClick={async () => {*/}
                        {/*                    const path = await open({*/}
                        {/*                        filters: [*/}
                        {/*                            {*/}
                        {/*                                name: "Fichier .set",*/}
                        {/*                                extensions: ["set"],*/}
                        {/*                            },*/}
                        {/*                        ],*/}
                        {/*                    });*/}
                        {/*                    if (path) {*/}
                        {/*                        form.setValue("set_path", path.toString());*/}
                        {/*                    }*/}
                        {/*                }}*/}
                        {/*            >*/}
                        {/*                Choisir le fichier*/}
                        {/*            </Button>*/}
                        {/*        </FormItem>*/}
                        {/*    )}*/}
                        {/*/>*/}

                        {/*<FormField*/}
                        {/*    control={form.control}*/}
                        {/*    name={"xlsm_path"}*/}
                        {/*    render={({ field }) => (*/}
                        {/*        <FormItem className={"flex flex-col"}>*/}
                        {/*            <FormLabel>Fichier Excel</FormLabel>*/}
                        {/*            <FormMessage />*/}
                        {/*            <Input {...field} readOnly={true} />*/}
                        {/*            <Button*/}
                        {/*                type={"button"}*/}
                        {/*                variant={"secondary"}*/}
                        {/*                onClick={async () => {*/}
                        {/*                    const path = await open({*/}
                        {/*                        filters: [*/}
                        {/*                            {*/}
                        {/*                                name: "Fichier Excel",*/}
                        {/*                                extensions: ["xlsm"],*/}
                        {/*                            },*/}
                        {/*                        ],*/}
                        {/*                    });*/}
                        {/*                    if (path) {*/}
                        {/*                        form.setValue("xlsm_path", path.toString());*/}
                        {/*                        setXlsmFilePath(path.toString());*/}
                        {/*                    }*/}
                        {/*                }}*/}
                        {/*            >*/}
                        {/*                Choisir le fichier*/}
                        {/*            </Button>*/}
                        {/*        </FormItem>*/}
                        {/*    )}*/}
                        {/*/>*/}

                        {/*<Separator />*/}

                        {/*{xlsmFilePath !== "" && (*/}
                        {/*    <>*/}
                        {/*        <p>*/}
                        {/*            Les paramètres suivants ne sont pas modifiables et sont importés directement depuis*/}
                        {/*            le fichier excel. Ils permettent de vérifier les infos avant de valider l'ajout.*/}
                        {/*        </p>*/}

                        {/*        <FormField*/}
                        {/*            control={form.control}*/}
                        {/*            name={"capital"}*/}
                        {/*            render={({ field }) => (*/}
                        {/*                <FormItem className={"flex flex-col"}>*/}
                        {/*                    <FormLabel>Capital</FormLabel>*/}
                        {/*                    <FormMessage />*/}
                        {/*                    <Input type={"number"} {...field} readOnly={true} />*/}
                        {/*                </FormItem>*/}
                        {/*            )}*/}
                        {/*        />*/}

                        {/*        <FormField*/}
                        {/*            control={form.control}*/}
                        {/*            name={"date_debut"}*/}
                        {/*            render={({ field }) => (*/}
                        {/*                <FormItem className={"flex flex-col"}>*/}
                        {/*                    <FormLabel>Date de début</FormLabel>*/}
                        {/*                    <FormMessage />*/}
                        {/*                    <Input type={"date"} {...field} readOnly={true} />*/}
                        {/*                </FormItem>*/}
                        {/*            )}*/}
                        {/*        />*/}

                        {/*        <FormLabel>Décalage court terme</FormLabel>*/}
                        {/*        <div className="flex gap-2">*/}
                        {/*            <FormField*/}
                        {/*                control={form.control}*/}
                        {/*                name={"decalage_ct"}*/}
                        {/*                render={({ field }) => (*/}
                        {/*                    <FormItem className={"flex flex-col"}>*/}
                        {/*                        <FormMessage />*/}
                        {/*                        <Input {...field} readOnly={true} />*/}
                        {/*                    </FormItem>*/}
                        {/*                )}*/}
                        {/*            />*/}
                        {/*            <FormField*/}
                        {/*                control={form.control}*/}
                        {/*                name={"decalage_ct_unit"}*/}
                        {/*                render={({ field }) => (*/}
                        {/*                    <FormItem className={"flex flex-col"}>*/}
                        {/*                        <FormMessage />*/}
                        {/*                        <Input {...field} readOnly={true} />*/}
                        {/*                    </FormItem>*/}
                        {/*                )}*/}
                        {/*            />*/}
                        {/*        </div>*/}

                        {/*        <FormLabel>Décalage long terme</FormLabel>*/}
                        {/*        <div className="flex gap-2">*/}
                        {/*            <FormField*/}
                        {/*                control={form.control}*/}
                        {/*                name={"decalage_lt"}*/}
                        {/*                render={({ field }) => (*/}
                        {/*                    <FormItem className={"flex flex-col"}>*/}
                        {/*                        <FormMessage />*/}
                        {/*                        <Input {...field} readOnly={true} />*/}
                        {/*                    </FormItem>*/}
                        {/*                )}*/}
                        {/*            />*/}
                        {/*            <FormField*/}
                        {/*                control={form.control}*/}
                        {/*                name={"decalage_lt_unit"}*/}
                        {/*                render={({ field }) => (*/}
                        {/*                    <FormItem className={"flex flex-col"}>*/}
                        {/*                        <FormMessage />*/}
                        {/*                        <Input {...field} readOnly={true} />*/}
                        {/*                    </FormItem>*/}
                        {/*                )}*/}
                        {/*            />*/}
                        {/*        </div>*/}
                        {/*    </>*/}
                        {/*)}*/}

                        <div className="flex gap-2 self-center">
                            <Button type={"button"} variant={"secondary"} onClick={onClosePopup}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isCreating} className={"self-center"}>
                                {isCreating ? "Modification en cours..." : "Modifier"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};
