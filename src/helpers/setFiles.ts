import { XlsmPassageData } from "@/rspc_bindings.ts";

export type SetEntry = {
    name: string;
    value: string | number;
    active?: number;
    min?: number;
    step?: number;
    max?: number;
};

export function convertSetToJson(setContent: string): SetEntry[] {
    const lines = setContent.split("\n");
    const json: SetEntry[] = [];
    let currentEntry: SetEntry | null = null;

    lines.forEach((line) => {
        const indexOfEqual = line.indexOf("=");
        if (indexOfEqual !== -1) {
            const name = line.substring(0, indexOfEqual).trim();
            const value = line.substring(indexOfEqual + 1).trim();

            if (!name.includes(",")) {
                currentEntry = {
                    name: name,
                    value: isNaN(Number(value)) ? value : Number(value),
                };
                json.push(currentEntry);
            } else {
                const [baseName, suffix] = name.split(",");
                if (currentEntry && baseName.trim() === currentEntry.name) {
                    const numericValue = Number(value);
                    switch (suffix.trim()) {
                        case "F":
                            currentEntry.active = numericValue;
                            break;
                        case "1":
                            currentEntry.min = numericValue;
                            break;
                        case "2":
                            currentEntry.step = numericValue;
                            break;
                        case "3":
                            currentEntry.max = numericValue;
                            break;
                    }
                }
            }
        }
    });

    return json;
}

export function convertJsonToSet(json: SetEntry[]): string {
    let setContent = "";

    json.forEach((entry) => {
        setContent += `${entry.name}=${entry.value}\n`;
        if (typeof entry.value === "number") {
            // Only add 'F', '1', '2', and '3' lines if they are defined
            if (entry.active !== undefined) {
                setContent += `${entry.name},F=${entry.active}\n`;
            }
            if (entry.min !== undefined) {
                setContent += `${entry.name},1=${entry.min}\n`;
            }
            if (entry.step !== undefined) {
                setContent += `${entry.name},2=${entry.step}\n`;
            }
            if (entry.max !== undefined) {
                setContent += `${entry.name},3=${entry.max}\n`;
            }
        }
    });

    return setContent.trim();
}

export function generateSetFromParams(params: XlsmPassageData): string {
    // On a une liste de paramètres de la forme "param1=val1", "param2=val2", etc.
    // On extrait la valeur
    const json: SetEntry[] = params.parametres.slice(0, -1).map((param) => {
        const [name, value] = param.split("=");
        return {
            name: name,
            value: isNaN(Number(value)) ? value : Number(value),
        };
    });

    return convertJsonToSet(json);
}
