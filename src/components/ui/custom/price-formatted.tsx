import { $discret } from "@/signals/components/ui/discret.ts";
import { useSignal } from "@/hooks/useSignal.ts";
import { cn } from "@/lib/utils.ts";

interface PriceFormattedProps {
    valeur: number;
    withColors?: boolean;
    currency?: string;
    className?: string;
}

export const PriceFormatted = ({ valeur, withColors = false, currency = "EUR", className }: PriceFormattedProps) => {
    let classColor = "";
    if (withColors) {
        if (valeur > 0) {
            classColor = "text-green-500";
        } else if (valeur < 0) {
            classColor = "text-red-500";
        } else {
            classColor = "text-gray-500";
        }
    }

    const discretSignal = useSignal($discret);

    return (
        <div className={cn(withColors && classColor, discretSignal && "blur-sm", className)}>
            {Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: currency,
                currencySign: "standard",
                notation: "standard",
                maximumFractionDigits: 2,
                signDisplay: withColors ? "always" : "auto",
            }).format(valeur)}
        </div>
    );
};
