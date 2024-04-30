import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { convertSetToJson, SetEntry } from "@/helpers/setFiles.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { NumberFormatted } from "@/components/ui/custom/number-formatted.tsx";

interface RobotSettingsProps {
    jsonData?: SetEntry[];
    setFile?: string;
    readOnly?: boolean;
    displayAll?: boolean;
    displayPassages?: boolean;
}

export const RobotSettings = ({
    jsonData,
    setFile,
    readOnly = true,
    displayAll = false,
    displayPassages = false,
}: RobotSettingsProps) => {
    let data: SetEntry[] = [];
    if (!jsonData && setFile) {
        data = convertSetToJson(setFile);
    } else if (jsonData) {
        data = jsonData;
    }

    let produitPassages = 1;
    let passages = 0;

    return (
        <Table className={""}>
            <TableHeader>
                <TableRow>
                    <TableHead colSpan={2}>Paramètre</TableHead>
                    <TableHead>Valeur</TableHead>
                    <TableHead className={"text-center"}>Minimum</TableHead>
                    <TableHead className={"text-center"}>Pas</TableHead>
                    <TableHead className={"text-center"}>Maximum</TableHead>
                    {displayPassages && <TableHead className={"text-center"}>Passages</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((param, index) => {
                    if (
                        displayPassages &&
                        param.max !== undefined &&
                        param.min !== undefined &&
                        param.step !== undefined &&
                        param.active === 1 &&
                        param.step > 0
                    ) {
                        passages = Math.floor((param.max - param.min) / param.step) + 1;
                        produitPassages *= passages;
                    }

                    if (
                        displayPassages &&
                        param.max !== undefined &&
                        param.min !== undefined &&
                        param.step !== undefined &&
                        param.active === 1 &&
                        param.step === 0
                    ) {
                        passages = param.max - param.min + 1;
                        produitPassages *= passages;
                    }

                    return (
                        <TableRow key={`param_${index}`}>
                            <TableCell className={"p-1"}>
                                <Checkbox disabled={readOnly} checked={param.active === 1} />
                            </TableCell>
                            <TableCell className={"p-1"}>{param.name}</TableCell>
                            <TableCell
                                className={"p-1"}
                                colSpan={param.active === 1 || displayAll ? 0 : displayPassages ? 5 : 4}
                            >
                                {param.value}
                            </TableCell>
                            {(param.active === 1 || displayAll) && (
                                <>
                                    <TableCell className={"p-1 text-center"}>{param.min}</TableCell>
                                    <TableCell className={"p-1 text-center"}>{param.step}</TableCell>
                                    <TableCell className={"p-1 text-center"}>{param.max}</TableCell>
                                </>
                            )}
                            {displayPassages && param.active === 1 && (
                                <TableCell className={"p-1 text-center"}>
                                    <NumberFormatted valeur={passages} withColors={false} />
                                </TableCell>
                            )}
                        </TableRow>
                    );
                })}
            </TableBody>
            {displayPassages && (
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6} className={"text-right"}>
                            Total
                        </TableCell>
                        <TableCell className={"text-center"}>
                            <NumberFormatted valeur={produitPassages} withColors={true} />
                        </TableCell>
                    </TableRow>
                </TableFooter>
            )}
        </Table>
    );
};
