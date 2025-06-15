import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { X } from 'lucide-react';

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    search?: string;
    onSearch?: (v: string) => void;
    sort?: string;
    direction?: 'asc' | 'desc';
    onSort?: (col: string, dir: 'asc' | 'desc') => void;
    pagination: Pagination;
    onPageChange?: (page: number) => void;
    onPerPageChange?: (size: number) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    search,
    onSearch,
    sort,
    direction,
    onSort,
    pagination,
    onPageChange,
    onPerPageChange,
}: DataTableProps<TData, TValue>) {
    const { current_page: currentPage, last_page: lastPage, per_page: perPage, total } = pagination;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });

    const handleSort = (id: string) => {
        const col = table.getAllColumns().find((c) => c.id === id);
        if (!col?.columnDef.enableSorting || !onSort) return;
        const newDir = sort === id && direction === 'asc' ? 'desc' : 'asc';
        onSort(id, newDir);
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
                            .filter((c) => c.getCanHide())
                            .map((c) => (
                                <DropdownMenuCheckboxItem key={c.id} checked={c.getIsVisible()} onCheckedChange={() => c.toggleVisibility()}>
                                    {c.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-secondary">
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id} className="rounded-t-md [&>th:first-child]:rounded-tl-md [&>th:last-child]:rounded-tr-md">
                                {hg.headers.map((h) => {
                                    const colId = h.column.id;
                                    const isSorted = sort === colId;
                                    return (
                                        <TableHead
                                            key={h.id}
                                            onClick={() => handleSort(colId)}
                                            className={`select-none ${
                                                h.column.columnDef.enableSorting === false ? 'cursor-default' : 'cursor-pointer'
                                            }`}
                                        >
                                            {flexRender(h.column.columnDef.header, h.getContext())}
                                            {h.column.columnDef.enableSorting !== false && (
                                                <span className="ml-1 text-xs">{isSorted ? (direction === 'asc' ? '↑' : '↓') : '⇅'}</span>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
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
                    Showing {(currentPage - 1) * perPage + 1}
                    {'\u2013'}
                    {Math.min(currentPage * perPage, total)} of {total}
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Rows:</span>
                        <select className="rounded border p-1 text-sm" value={perPage} onChange={(e) => onPerPageChange?.(Number(e.target.value))}>
                            {[5, 10, 20, 50, 100].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => onPageChange?.(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </Button>

                        {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                            <Button
                                key={p}
                                size="sm"
                                className="min-w-[40px]"
                                variant={p === currentPage ? 'default' : 'outline'}
                                onClick={() => onPageChange?.(p)}
                            >
                                {p}
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
