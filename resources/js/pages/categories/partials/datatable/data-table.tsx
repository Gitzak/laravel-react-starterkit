import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { X } from 'lucide-react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    search?: string;
    onSearch?: (value: string) => void;
    sort?: string;
    direction?: 'asc' | 'desc';
    onSort?: (column: string, direction: 'asc' | 'desc') => void;
    currentPage?: number;
    lastPage?: number;
    perPage?: number;
    total?: number;
    onPageChange?: (page: number) => void;
    onPerPageChange?: (value: number) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    search,
    onSearch,
    sort,
    direction,
    onSort,
    currentPage = 1,
    lastPage = 1,
    perPage = 10,
    total = 0,
    onPageChange,
    onPerPageChange,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleSort = (columnId: string) => {
        const column = table.getAllColumns().find((col) => col.id === columnId);
        if (!column?.columnDef.enableSorting || !onSort) return;
        const newDirection = sort === columnId && direction === 'asc' ? 'desc' : 'asc';
        onSort(columnId, newDirection);
    };

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-4">
                <div className="relative w-full max-w-sm">
                    <Input placeholder="Search..." value={search ?? ''} onChange={(e) => onSearch?.(e.target.value)} className="pr-10" />
                    {search && (
                        <button
                            type="button"
                            onClick={() => onSearch?.('')}
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        {table
                            .getAllColumns()
                            .filter((col) => col.getCanHide())
                            .map((col) => (
                                <DropdownMenuCheckboxItem key={col.id} checked={col.getIsVisible()} onCheckedChange={() => col.toggleVisibility()}>
                                    {col.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-secondary">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow className="rounded-t-md [&>th:first-child]:rounded-tl-md [&>th:last-child]:rounded-tr-md" key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const columnId = header.column.id;
                                    const isSorted = sort === columnId;

                                    return (
                                        <TableHead
                                            key={header.id}
                                            onClick={() => handleSort(columnId)}
                                            className={`select-none ${
                                                header.column.columnDef.enableSorting === false ? 'cursor-default' : 'cursor-pointer'
                                            }`}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.columnDef.enableSorting !== false && (
                                                <span className="ml-1 text-xs">{isSorted ? (direction === 'asc' ? '↑' : '↓') : '⇅'}</span>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between px-2 py-6">
                <div className="text-muted-foreground text-sm">
                    Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, total)} of {total} results
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Rows per page:</span>
                        <select className="rounded border p-1 text-sm" value={perPage} onChange={(e) => onPerPageChange?.(Number(e.target.value))}>
                            {[5, 10, 20, 50, 100].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => onPageChange?.(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </Button>

                        {Array.from({ length: lastPage || 1 }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                size="sm"
                                className="min-w-[40px]"
                                variant={page === currentPage ? 'default' : 'outline'}
                                onClick={() => onPageChange?.(page)}
                            >
                                {page}
                            </Button>
                        ))}

                        <Button size="sm" variant="outline" onClick={() => onPageChange?.(currentPage + 1)} disabled={currentPage === lastPage}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
