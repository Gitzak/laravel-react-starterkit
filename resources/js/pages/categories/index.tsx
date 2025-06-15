import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';
import { PaginatedCategories, SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import CreateCategoryForm from './partials/create';
import { columns as baseColumns, Category } from './partials/datatable/columns';
import { DataTable } from './partials/datatable/data-table';
import { DeleteCategoryModal } from './partials/delete';
import EditCategoryForm from './partials/update';

type Query = {
    search?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
    is_active?: string | null;
};

type Pagination = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export default function CategoriesPage({
    categories,
    pagination,
    parentCategories,
    filters: initialFilters,
}: {
    categories: PaginatedCategories;
    pagination: Pagination; 
    parentCategories: any[];
    filters: Query;
}) {
    const [query, setQuery] = useState<Query>({
        ...initialFilters,
        search: initialFilters.search ?? '',
        per_page: initialFilters.per_page ?? pagination.per_page,
        page: initialFilters.page ?? pagination.current_page,
    });

    const page = usePage<SharedData>();
    const hasMount = useRef(false);
    const { success, error } = page.props.flash;

    useEffect(() => {
        if (!hasMount.current) {
            hasMount.current = true;
            return;
        }
        if (success) toast.success(success);
        if (error) toast.error(error);
    }, [success, error]);

    const refresh = (patch: Partial<Query>) => {
        const next = { ...query, ...patch };
        setQuery(next);
        router.get('/categories', next, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleSearch        = (v: string) => refresh({ search: v, page: 1 });
    const handleSort          = (c: string, d: 'asc' | 'desc') => refresh({ sort: c, direction: d, page: 1 });
    const handlePageChange    = (p: number) => refresh({ page: p });
    const handlePerPageChange = (n: number) => refresh({ per_page: n, page: 1 });

    const [openCreate, setOpenCreate] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const closeModals = () => {
        setSelectedCategory(null);
        setDeleteId(null);
    };

    const columns = baseColumns(
        (cat) => console.log('View:', cat),
        (cat) => setSelectedCategory(cat),
        (id) => setDeleteId(id),
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'Categories', href: '/categories' }]}>
            <Head title="Categories" />

            <div className="mb-4 flex items-center justify-between p-4">
                <h1 className="text-xl font-bold">Categories</h1>

                <Sheet open={openCreate} onOpenChange={setOpenCreate}>
                    <SheetTrigger asChild>
                        <Button>+ Add Category</Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="flex h-screen w-[400px] flex-col sm:w-[480px]">
                        <SheetHeader className="border-b p-6">
                            <SheetTitle>Create Category</SheetTitle>
                            <SheetDescription>Fill the form to create a new category</SheetDescription>
                        </SheetHeader>
                        <CreateCategoryForm parentCategories={parentCategories} onCancel={() => setOpenCreate(false)} />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="px-4">
                <DataTable
                    columns={columns}
                    data={categories.data}
                    search={query.search}
                    onSearch={handleSearch}
                    sort={query.sort}
                    direction={query.direction as 'asc' | 'desc'}
                    onSort={handleSort}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            </div>

            {selectedCategory && (
                <Sheet open onOpenChange={closeModals}>
                    <SheetContent side="right" className="flex h-screen w-[400px] flex-col sm:w-[480px]">
                        <SheetHeader className="border-b p-6">
                            <SheetTitle>Edit Category</SheetTitle>
                            <SheetDescription>Update the category information</SheetDescription>
                        </SheetHeader>
                        <EditCategoryForm category={selectedCategory} parentCategories={parentCategories} onCancel={closeModals} />
                    </SheetContent>
                </Sheet>
            )}

            {deleteId && <DeleteCategoryModal categoryId={deleteId} open onClose={closeModals} />}
        </AppLayout>
    );
}
