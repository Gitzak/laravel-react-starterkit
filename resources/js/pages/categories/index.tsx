import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CreateCategoryForm from './partials/create';
import { SharedData } from '@/types';

export default function CategoriesPage({ categories, parentCategories }: { categories: any[]; parentCategories: any[] }) {

    const page = usePage<SharedData>();
    const success = page.props.flash.success;
    const error = page.props.flash.error;

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (success) toast.success(success);
        if (error) toast.error(error);
    }, [success, error]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Categories', href: '/categories' }]}>
            <Head title="Categories" />

            <div className="mb-4 flex items-center justify-between p-4">
                <h1 className="text-xl font-bold">Categories</h1>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="default" className="cursor-pointer">
                            + Add Category
                        </Button>
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

            {/* dataTable */}
        </AppLayout>
    );
}
