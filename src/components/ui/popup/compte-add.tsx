import { useState } from "react";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { H2 } from "@/components/ui/typos.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { AlertCircle, CheckIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils.ts";
import { courtiers } from "@/helpers/courtiers.ts";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command.tsx";
import { CompteCreateArgs } from "@/rspc_bindings.ts";
import { rspcClient } from "@/helpers/rspc.ts";
import useAppContext from "@/hooks/useAppContext.ts";
import { useMount } from "react-use";
import { TourSteps } from "@/WelcomeTourSteps.ts";

interface PopupPortfolioAddProps {
    onClosePopup: () => void;
}

export const PopupCompteAdd = ({ onClosePopup }: PopupPortfolioAddProps) => {
    /** TOUR **/
    const {
        setState,
        state: { tourActive },
    } = useAppContext();

    useMount(() => {
        if (tourActive) {
            setTimeout(() => {
                setState({ run: true, stepIndex: TourSteps.TOUR_COMPTE_ADD_POPUP });
            }, 100);
        }
    });
    /** END TOUR **/

    const fileNameRegex = /^[^<>:"/\\|?*]+$/;
    const [isError] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [errorMessage] = useState("");
    const [defaultTags] = useState([
        { value: "Long terme" },
        { value: "Court terme" },
        { value: "Set Rattrapage" },
        { value: "Set Maintien" },
        { value: "Set Idéal" },
        { value: "HFT" },
        { value: "CENTS" },
    ]);
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
        tags: z
            .array(
                z.object({
                    value: z.string(),
                }),
            )
            .min(0),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            name:
                "Compte #" +
                Math.floor(Math.random() * 1000)
                    .toString()
                    .padStart(4, "0"),
            tags: [],
            password: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "tags",
        control: form.control,
    });

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsCreating(true);

        try {
            const args: CompteCreateArgs = {
                ...values,
                capital: parseFloat(values.capital),
                password: values.password === null ? "" : values.password,
            };

            const compte = await rspcClient.mutation(["comptes.create", args]);

            for (let i = 0; i < values.tags.length; i++) {
                await rspcClient.mutation([
                    "tags.create_for_compte",
                    {
                        tag: values.tags[i].value,
                        compte_id: compte.id,
                    },
                ]);
            }

            queryClient.invalidateQueries({
                queryKey: ["comptes"],
            });
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la création du compte");
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
                <H2 className={"tour-comptes-add-popup"}>Ajouter un compte</H2>
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
                            name={"type_compte"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type de compte</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange}>
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
                                    <FormItem className={"flex flex-col"}>
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
                                        <Select onValueChange={field.onChange}>
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
                                        <Select onValueChange={field.onChange}>
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

                        <FormField
                            control={form.control}
                            name={"plateforme"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plateforme</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange}>
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

                        <div className="flex gap-2 self-center">
                            <Button type={"button"} variant={"secondary"} onClick={onClosePopup}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isCreating} className={"self-center"}>
                                {isCreating ? "Création en cours..." : "Créer"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};
