interface PriceFormattedProps {
    valeur: number;
    withColors?: boolean;
}

export const NumberFormatted = ({ valeur, withColors = false }: PriceFormattedProps) => {
    let classColor = "";
    if (withColors) {
        if (valeur > 3000) {
            classColor = "text-red-500";
        } else if (valeur > 1500) {
            classColor = "text-orange-500";
        } else {
            classColor = "text-green-500";
        }
    }

    return (
        <div className={`${withColors && classColor}`}>
            {Intl.NumberFormat("fr-FR", {
                style: "decimal",
            }).format(valeur)}
        </div>
    );
};
