import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { useState } from "react";
import { DtBefore } from "@/components/ui/datatable/before.tsx";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading: boolean;
}

export function RobotsDataTable<TData, TValue>({ columns, data, isLoading = true }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [paginationState, setPaginationState] = useState<PaginationState>({ pageSize: 20, pageIndex: 0 });
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPaginationState,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            pagination: paginationState,
            globalFilter,
        },
    });

    return (
        <>
            <DtBefore table={table} />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length > 0 &&
                            !isLoading &&
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className={"p-1"}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        {table.getRowModel().rows.length === 0 && !isLoading && (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 p-1 text-center">
                                    Aucun résultat.
                                </TableCell>
                            </TableRow>
                        )}
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 p-1 text-center">
                                    Chargement...
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/*<DtPagination table={table} />*/}
        </>
    );
}
