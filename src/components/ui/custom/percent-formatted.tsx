interface PriceFormattedProps {
    valeur: number;
    withColors?: boolean;
    currency?: string;
}

export const PercentFormatted = ({ valeur, withColors = false }: PriceFormattedProps) => {
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

    return (
        <div className={`${withColors && classColor}`}>
            {Intl.NumberFormat("fr-FR", {
                style: "percent",
                notation: "standard",
                maximumFractionDigits: 2,
                signDisplay: withColors ? "always" : "auto",
            }).format(valeur)}
        </div>
    );
};
