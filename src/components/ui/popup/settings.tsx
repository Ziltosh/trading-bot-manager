import { H2 } from "@/components/ui/typos.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form.tsx";

interface PopupSettingsProps {
    onClosePopup: () => void;
}

interface MyfxbookLoginResponse {
    error: boolean;
    message: string;
    session: string;
}

export const PopupSettings = ({ onClosePopup }: PopupSettingsProps) => {
    const [isCreating, setIsCreating] = useState(false);

    const formSchema = z.object({
        myfxbookUsername: z.string(),
        myfxbookPassword: z.string(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            myfxbookUsername: localStorage.getItem("api-myfxbook-username") || "",
            myfxbookPassword: localStorage.getItem("api-myfxbook-password") || "",
        },
    });

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsCreating(true);

        // On teste si les identifiants sont corrects sinon on renvoie une erreur
        const response = await fetch(
            `https://www.myfxbook.com/api/login.json?email=${values.myfxbookUsername}&password=${values.myfxbookPassword}`,
        );
        const data = (await response.json()) as MyfxbookLoginResponse;
        if (!data.error) {
            localStorage.setItem("api-myfxbook-session", data.session);
            localStorage.setItem("api-myfxbook-username", values.myfxbookUsername);
            localStorage.setItem("api-myfxbook-password", values.myfxbookPassword);
            setIsCreating(false);
            onClosePopup();
            return;
        }

        alert("Identifiants myfxbook incorrects");

        setIsCreating(false);
        onClosePopup();
    };

    return (
        <>
            <div
                className="absolute z-20 flex h-full w-full items-center overflow-y-scroll backdrop-blur-md transition-all"
                onClick={onClosePopup}
            >
                <div
                    className="m-auto flex w-1/2 flex-col gap-2 rounded-lg border bg-background p-4 shadow-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <H2>API myfxbook</H2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className={"flex flex-col space-y-4"}>
                            <FormField
                                control={form.control}
                                name={"myfxbookUsername"}
                                render={({ field }) => (
                                    <FormItem className={"tour-robots-add-name"}>
                                        <FormLabel>Email myfxbook</FormLabel>
                                        <FormControl>
                                            <Input placeholder={"JohnDoe"} {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"myfxbookPassword"}
                                render={({ field }) => (
                                    <FormItem className={"tour-robots-add-name"}>
                                        <FormLabel>Mot de passe myfxbook</FormLabel>
                                        <FormControl>
                                            <Input placeholder={"123456"} type={"password"} {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-2 self-center">
                                <Button variant={"outline"} onClick={onClosePopup}>
                                    Annuler
                                </Button>
                                <Button variant={"default"} type={"submit"} disabled={isCreating}>
                                    {isCreating ? "Création..." : "Sauvegarder"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    );
};
