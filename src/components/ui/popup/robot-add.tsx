import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { H2 } from "@/components/ui/typos.tsx";
import { rspcClient } from "@/helpers/rspc.ts";
import { convertSetToJson } from "@/helpers/setFiles.ts";
import useAppContext from "@/hooks/useAppContext.ts";
import { RobotCreateArgs } from "@/rspc_bindings.ts";
import { TourSteps } from "@/WelcomeTourSteps.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { open } from "@tauri-apps/api/dialog";
import { AlertCircle, InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMount } from "react-use";
import * as z from "zod";

import CheminRobotImg from "../../../assets/img/chemin_robot.jpg";

interface PopupPortfolioAddProps {
    onClosePopup: () => void;
}

export const PopupRobotAdd = ({ onClosePopup }: PopupPortfolioAddProps) => {
    /** TOUR **/
    const {
        setState,
        state: { tourActive },
    } = useAppContext();

    useMount(() => {
        if (tourActive) {
            setTimeout(() => {
                setState({ run: true, stepIndex: TourSteps.TOUR_ROBOT_ADD_NAME });
            }, 100);
        }
    });
    /** END TOUR **/

    const fileNameRegex = /^[^<>:"/\\|?*]+$/;
    const [isError] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [errorMessage] = useState("");
    const [defaultTags] = useState([
        { value: "Grid" },
        { value: "Scalping" },
        { value: "Martingale" },
        { value: "REB" },
        { value: "IA" },
        { value: "M1" },
        { value: "M5" },
        { value: "M15" },
        { value: "M30" },
        { value: "H1" },
        { value: "H4" },
        { value: "D" },
        { value: "MT4" },
        { value: "MT5" },
        { value: "All TF" },
    ]);

    const [jsonSettings, setJsonSettings] = useState("");

    const queryClient = useQueryClient();

    const formSchema = z.object({
        name: z.string().min(4).max(20).regex(fileNameRegex, "Cacactères non autorisés"),
        chemin: z.string(),
        description: z.string(),
        tags: z
            .array(
                z.object({
                    value: z.string(),
                }),
            )
            .min(1),
        json_settings: z.string(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            name:
                "Robot #" +
                Math.floor(Math.random() * 1000)
                    .toString()
                    .padStart(4, "0"),
            tags: [],
        },
    });

    const [settingsFilePath, setSettingsFilePath] = useState("");
    useEffect(() => {
        if (settingsFilePath === "") return;
        rspcClient.query(["robots.open_set_file", { path: settingsFilePath }]).then((res) => {
            setJsonSettings(JSON.stringify(convertSetToJson(res)));
            form.setValue("json_settings", JSON.stringify(convertSetToJson(res)));
        });
    }, [form, settingsFilePath]);

    const { fields, append, remove } = useFieldArray({
        name: "tags",
        control: form.control,
    });

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsCreating(true);

        const args: RobotCreateArgs = {
            ...values,
            json_settings: jsonSettings,
        };
        const robot = await rspcClient.mutation(["robots.create", args]);

        for (let i = 0; i < values.tags.length; i++) {
            await rspcClient.mutation([
                "tags.create_for_robot",
                {
                    tag: values.tags[i].value,
                    robot_id: robot.id,
                },
            ]);
        }

        await queryClient.invalidateQueries({ queryKey: ["robots"] });

        setIsCreating(false);
        onClosePopup();
    };

    return (
        <div
            className="absolute z-20 flex h-full w-full items-center overflow-y-scroll backdrop-blur-md transition-all"
            onClick={onClosePopup}
        >
            <div
                className="m-auto w-1/2 flex-col gap-2 rounded-lg border bg-background p-4 shadow-md"
                onClick={(e) => e.stopPropagation()}
            >
                <H2>Ajouter un robot</H2>
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
                                <FormItem className={"tour-robots-add-name"}>
                                    <FormLabel>Nom du robot</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={"chemin"}
                            render={({ field }) => (
                                <FormItem className={"tour-robots-add-chemin"}>
                                    <FormLabel>
                                        Chemin du robot dans MT4{" "}
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
                                    </FormLabel>
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
                                <FormItem className={"tour-robots-add-desc"}>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="tour-robots-add-tags space-y-2">
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
                            name={"json_settings"}
                            render={({ field }) => (
                                <FormItem className={"tour-robots-add-set flex flex-col"}>
                                    <FormLabel>Fichier .set</FormLabel>
                                    <Input {...field} readOnly={true} type="hidden" />
                                    <Input readOnly={true} value={settingsFilePath} />
                                    <FormDescription>
                                        Pensez à bien utiliser la "Remise à zéro" des paramètres via MetaTrader avant
                                        d'envoyer le fichier. Ca permettra de pouvoir comparer les settings par défaut
                                        par rapport a ceux utilisés lors des optimisations.
                                    </FormDescription>
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
                                                setSettingsFilePath(path.toString());
                                            }
                                        }}
                                    >
                                        Choisir le fichier
                                    </Button>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2 self-center">
                            <Button type={"button"} variant={"secondary"} onClick={onClosePopup}>
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={isCreating}
                                className={"tour-robots-add-create self-center"}
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
