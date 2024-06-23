import { Input } from "@/components/ui/input.tsx";
import { Table } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { SlidersHorizontalIcon } from "lucide-react";
import { useMount } from "react-use";

interface DtProps<TData> {
    table: Table<TData>;
}

export function DtBefore<TData>({ table }: DtProps<TData>) {
    useMount(() => {
        const globalFilter = localStorage.getItem("globalFilter");
        if (globalFilter) {
            table.setGlobalFilter(globalFilter);
        }
    });

    return (
        <>
            <div className="flex items-center py-2">
                <Input
                    placeholder="Filtrer..."
                    defaultValue={localStorage.getItem("globalFilter") || ""}
                    onChange={(event) => {
                        table.setGlobalFilter(event.target.value);
                        localStorage.setItem("globalFilter", event.target.value);
                    }}
                    className="mx-1"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            <SlidersHorizontalIcon className="mr-2 h-4 w-4" />
                            Colonnes
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                        <DropdownMenuLabel>Choix des colonnes</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table
                            .getAllColumns()
                            .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="cursor-pointer capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
}
