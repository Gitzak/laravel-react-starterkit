import { ColumnDef } from '@tanstack/react-table';

export type Category = {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    parent?: { name: string };
};

export const columns: ColumnDef<Category>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
    },
    {
        accessorKey: 'parent.name',
        header: 'Parent Category',
        cell: ({ row }) => row.original.parent?.name ?? '-',
    },
    {
        accessorKey: 'is_active',
        header: 'Active',
        cell: ({ row }) => (row.original.is_active ? 'Yes' : 'No'),
    },
];
