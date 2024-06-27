import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { H2 } from "@/components/ui/typos.tsx";
import { courtiers } from "@/helpers/courtiers.ts";
import { rspcClient } from "@/helpers/rspc.ts";
import { cn } from "@/lib/utils.ts";
import { CompteUpdateArgs } from "@/rspc_bindings.ts";
import { useGlobalStore } from "@/stores/global-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface PopupCompteEditProps {
    onClosePopup: () => void;
}

export const PopupCompteEdit = ({ onClosePopup }: PopupCompteEditProps) => {
    let forceRefresh = new Date().getTime();

    const { currentCompte: compte } = useGlobalStore();

    console.log(compte);

    const fileNameRegex = /^[^<>:"/\\|?*]+$/;
    const [isError] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [errorMessage] = useState("");

    const [openCombobox, setOpenCombobox] = useState(false);

    const queryClient = useQueryClient();

    const formSchema = z.object({
        name: z.string().min(4).max(20).regex(fileNameRegex, "Cacactères non autorisés"),
        type_compte: z.string().refine((value) => ["reel", "demo", "prop"].includes(value)),
        capital: z.string().refine((value) => parseFloat(value) > 0),
        devise: z.string().refine((value) => ["USD", "EUR", "GBP"].includes(value)),
        courtier: z.string(),
        plateforme: z.string().refine((value) => ["mt4", "mt5"].includes(value)),
        numero: z.string(),
        password: z.string(),
        serveur: z.string(),
        status: z.string().refine((value) => ["actif", "phase 1", "phase 2", "financé", "cloturé"].includes(value)),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            name: compte?.name,
            capital: compte?.capital.toString(),
            password: compte?.password || "",
            devise: compte?.devise,
            courtier: compte?.courtier,
            plateforme: compte?.plateforme,
            numero: compte?.numero,
            serveur: compte?.serveur,
            type_compte: compte?.type_compte,
            status: compte?.status,
        },
    });

    useEffect(() => {
        if (!compte) return;
        form.setValue("name", compte.name);
        form.setValue("type_compte", compte.type_compte);
        form.setValue("status", compte.status);
        form.setValue("devise", compte.devise);
        form.setValue("plateforme", compte.plateforme);
        form.setValue("numero", compte.numero);
        form.setValue("serveur", compte.serveur);
        form.setValue("courtier", compte.courtier);
        form.setValue("capital", compte.capital.toString());
        form.setValue("password", compte.password || "");
        forceRefresh = new Date().getTime();
    }, [compte, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsCreating(true);

        try {
            const args: CompteUpdateArgs = {
                ...values,
                capital: parseFloat(values.capital),
                id: compte!.id,
            };

            await rspcClient.mutation(["comptes.update", args]);

            queryClient.invalidateQueries({
                queryKey: ["comptes"],
            });
        } catch (e) {
            console.error(e);
            alert("Erreur lors de l'édition du compte");
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
                <H2 className={"tour-comptes-add-popup"}>Modifier le compte</H2>
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
                                <FormItem className={"tour-comptes-add-name"}>
                                    <FormLabel>Nom du compte</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type_compte"
                            key={`type_compte_${forceRefresh}`}
                            render={({ field }) => (
                                <FormItem className="tour-comptes-add-type">
                                    <FormLabel>Type de compte</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={compte?.type_compte}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Type du compte" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={"demo"}>Démo</SelectItem>
                                                <SelectItem value={"reel"}>Réel</SelectItem>
                                                <SelectItem value={"prop"}>Prop firm</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.getValues("type_compte") === "prop" && (
                            <FormField
                                control={form.control}
                                name={"courtier"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prop firm</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {form.getValues("type_compte") !== "prop" && (
                            <FormField
                                control={form.control}
                                name={"courtier"}
                                render={({ field }) => (
                                    <FormItem className={"tour-comptes-add-courtier flex flex-col"}>
                                        <FormLabel>Courtier</FormLabel>
                                        <Popover open={openCombobox}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        onClick={() => setOpenCombobox(!openCombobox)}
                                                        className={cn(
                                                            "justify-between",
                                                            !field.value && "text-foreground",
                                                        )}
                                                    >
                                                        {field.value
                                                            ? courtiers.find(
                                                                  (courtier) => courtier.value === field.value,
                                                              )?.label
                                                            : "Choisir un courtier"}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                <Command>
                                                    <CommandInput placeholder="Chercher..." className="h-9" />
                                                    <CommandList>
                                                        <CommandEmpty>Aucun courtier</CommandEmpty>
                                                        <CommandGroup className={"text-foreground"}>
                                                            {courtiers.map((courtier) => (
                                                                <CommandItem
                                                                    key={courtier.label}
                                                                    value={courtier.value}
                                                                    className={"cursor-pointer text-foreground"}
                                                                    data-disabled="false"
                                                                    onSelect={() => {
                                                                        form.setValue("courtier", courtier.value);
                                                                        setOpenCombobox(false);
                                                                    }}
                                                                >
                                                                    {courtier.label}
                                                                    <CheckIcon
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            courtier.value === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0",
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name={"status"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={compte?.status}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {form.getValues("type_compte") !== "prop" && (
                                                    <SelectItem value={"actif"}>Actif</SelectItem>
                                                )}
                                                {form.getValues("type_compte") === "prop" && (
                                                    <>
                                                        <SelectItem value={"phase 1"}>Phase 1</SelectItem>
                                                        <SelectItem value={"phase 2"}>Phase 2</SelectItem>
                                                        <SelectItem value={"financé"}>Financé</SelectItem>
                                                    </>
                                                )}
                                                <SelectItem value={"cloturé"}>Cloturé</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={"capital"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Capital</FormLabel>
                                    <FormControl>
                                        <Input {...field} type={"number"} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={"devise"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Devise</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={compte?.devise}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Devise du compte" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={"EUR"}>EUR</SelectItem>
                                                <SelectItem value={"USD"}>USD</SelectItem>
                                                <SelectItem value={"GBP"}>GBP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="tour-comptes-add-infos flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name={"plateforme"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plateforme</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={compte?.plateforme}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Plateforme" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={"mt4"}>MT4</SelectItem>
                                                    <SelectItem value={"mt5"}>MT5</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"numero"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Numéro de compte</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"password"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"serveur"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Serveur</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-2 self-center">
                            <Button type={"button"} variant={"secondary"} onClick={onClosePopup}>
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={isCreating}
                                className={"tour-comptes-add-create self-center"}
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
