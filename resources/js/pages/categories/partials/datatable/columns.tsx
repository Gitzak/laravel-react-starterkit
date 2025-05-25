import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

export type Category = {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    parent_name: string | null;
};

export const columns = (
    openView: (category: Category) => void,
    openEdit: (category: Category) => void,
    openDelete: (id: number) => void,
): ColumnDef<Category>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
    },
    {
        accessorKey: 'parent_name',
        header: 'Parent Category',
        enableSorting: true,
        cell: ({ row }) => row.original.parent_name ?? '-',
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        enableSorting: true,
        cell: ({ row }) => {
            const isActive = row.original.is_active;

            return (
                <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                >
                    {isActive ? 'Active' : 'Inactive'}
                </span>
            );
        },
    },
    {
        id: 'actions',
        enableSorting: false,
        header: 'Actions',
        cell: ({ row }) => {
            const category = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openView(category)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(category)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDelete(category.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
