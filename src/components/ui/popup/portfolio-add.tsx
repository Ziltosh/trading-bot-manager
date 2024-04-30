import {useState} from "react";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {H2} from "@/components/ui/typos.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";

interface PopupPortfolioAddProps {
    onClosePopup: () => void
}

export const PopupPortfolioAdd = ({onClosePopup}: PopupPortfolioAddProps) => {
    const [isError] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [errorMessage] = useState("")


    const formSchema = z.object({
        name: z.string().min(4).max(15),
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "Portfolio #" + Math.floor(Math.random() * 1000).toString().padStart(4, "0")
        },
    })

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsCreating(true)
        if (values) {
            console.log(values)
        }

        onClosePopup()
        setIsCreating(false)
    }

    return (
        <div className="backdrop-blur-md w-full h-full absolute flex items-center z-20 transition-all"
             onClick={onClosePopup}>
            <div
                className="p-4 flex-col gap-2 border m-auto w-1/2 bg-background rounded-lg shadow-md"
                onClick={(e) => e.stopPropagation()}>
                <H2>Ajouter un portfolio</H2>
                {isError && (
                    <Alert variant={"destructive"} className={"w-max"}>
                        <AlertCircle className={"h-4 w-4"}/>
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-4 flex flex-col"}>
                        <FormField control={form.control}
                                   name={"name"}
                                   render={({field}) => (
                                       <FormItem>
                                           <FormLabel>Nom du portfolio</FormLabel>
                                           <FormControl>
                                               <Input {...field} />
                                           </FormControl>
                                           <FormMessage/>
                                       </FormItem>
                                   )}/>

                        <div className="flex gap-2 self-center">
                            <Button type={"button"} variant={"secondary"} onClick={onClosePopup}>Annuler</Button>
                            <Button type="submit" disabled={isCreating}
                                    className={"self-center"}>{isCreating ? "Création en cours..." : "Créer"}</Button>
                        </div>

                    </form>
                </Form>
            </div>
        </div>
    )
}