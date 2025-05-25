import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';
import { PaginatedCategories, SharedData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CreateCategoryForm from './partials/create';
import { columns } from './partials/datatable/columns';
import { DataTable } from './partials/datatable/data-table';

export default function CategoriesPage({
    categories,
    parentCategories,
    filters,
}: {
    categories: PaginatedCategories;
    parentCategories: any[];
    filters: {
        search?: string;
        sort?: string;
        direction?: string;
        page?: number;
    };
}) {
    const page = usePage<SharedData>();
    const success = page.props.flash.success;
    const error = page.props.flash.error;

    const [open, setOpen] = useState(false);

    const { data, setData } = useForm({
        search: filters.search ?? '',
    });

    useEffect(() => {
        if (success) toast.success(success);
        if (error) toast.error(error);
    }, [success, error]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/categories',
                {
                    ...filters,
                    page: 1,
                    search: data.search,
                    sort: filters.sort,
                    direction: filters.direction,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        }, 800);

        return () => clearTimeout(timeout);
    }, [data.search]);

    const handleSort = (column: string, direction: 'asc' | 'desc') => {
        router.get(
            '/categories',
            {
                ...filters,
                page: 1,
                search: data.search,
                sort: column,
                direction,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/categories',
            {
                ...filters,
                page,
                search: data.search,
                sort: filters.sort,
                direction: filters.direction,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Categories', href: '/categories' }]}>
            <Head title="Categories" />

            <div className="mb-4 flex items-center justify-between p-4">
                <h1 className="text-xl font-bold">Categories</h1>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="default">+ Add Category</Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="flex h-screen w-[400px] flex-col sm:w-[500px]">
                        <SheetHeader className="border-b p-6">
                            <SheetTitle>Create Category</SheetTitle>
                            <SheetDescription>Fill the form to create a new category</SheetDescription>
                        </SheetHeader>

                        <CreateCategoryForm parentCategories={parentCategories} onCancel={() => setOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="px-4">
                <DataTable
                    columns={columns}
                    data={categories.data}
                    search={data.search}
                    onSearch={(value) => setData('search', value)}
                    sort={filters.sort}
                    direction={filters.direction as 'asc' | 'desc'}
                    onSort={handleSort}
                    currentPage={categories.current_page}
                    lastPage={categories.last_page}
                    perPage={categories.per_page}
                    total={categories.total}
                    onPageChange={handlePageChange}
                />
            </div>
        </AppLayout>
    );
}
