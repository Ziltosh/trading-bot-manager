import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
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
import { useGlobalStore } from "@/stores/global-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { open } from "@tauri-apps/api/dialog";
import { AlertCircle, InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import CheminRobotImg from "../../../assets/img/chemin_robot.jpg";
import { RobotUpdateArgs } from "@/rspc_bindings";

interface PopupRobotEditProps {
    onClosePopup: () => void;
}

export const PopupRobotEdit = ({ onClosePopup }: PopupRobotEditProps) => {
    const { currentRobot: robot } = useGlobalStore();

    const fileNameRegex = /^[^<>:"/\\|?*]+$/;
    const [isError] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [errorMessage] = useState("");
    const [jsonSettings, setJsonSettings] = useState("");

    const queryClient = useQueryClient();

    const formSchema = z.object({
        name: z.string().min(4).max(20).regex(fileNameRegex, "Cacactères non autorisés"),
        chemin: z.string(),
        description: z.string(),
        json_settings: z.string(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            name: robot?.name,
            chemin: robot?.chemin,
            description: robot?.description,
            json_settings: robot?.json_settings,
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

    useEffect(() => {
        if (!robot) return;
        form.setValue("name", robot.name);
        form.setValue("chemin", robot.chemin);
        form.setValue("description", robot.description);
        form.setValue("json_settings", robot.json_settings);
    }, [robot, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsCreating(true);

        try {
            const args: RobotUpdateArgs = {
                ...values,
                json_settings: jsonSettings,
                id: robot!.id,
            };

            console.log(args);

            const test = await rspcClient.mutation(["robots.update", args]);
            console.log(test);

            queryClient.invalidateQueries({
                queryKey: ["robots"],
            });
        } catch (e) {
            console.error(e);
            alert("Erreur lors de l'édition du robot");
        }

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
                <H2>Modifier le robot {robot?.name}</H2>
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
                                {isCreating ? "Modification en cours..." : "Modifier"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};
