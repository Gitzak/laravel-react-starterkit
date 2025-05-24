import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useForm } from '@inertiajs/react';
import React from 'react';

type Category = {
    id: number;
    name: string;
    description?: string;
    parent_id?: number | null;
    is_active?: boolean;
    children?: Category[];
};

function flattenCategories(categories: Category[], prefix = ''): { id: number; name: string }[] {
    let items: { id: number; name: string }[] = [];

    categories.forEach((category) => {
        items.push({
            id: category.id,
            name: `${prefix}${category.name}`,
        });

        if (category.children && category.children.length > 0) {
            items = items.concat(flattenCategories(category.children, prefix + '— '));
        }
    });

    return items;
}

export default function CreateCategoryForm({ parentCategories = [], onCancel }: { parentCategories?: Category[]; onCancel?: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        description: string;
        parent_id: number | null;
        is_active: boolean;
    }>({
        name: '',
        description: '',
        parent_id: null,
        is_active: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('categories.store'), {
            onSuccess: () => {
                reset();
                onCancel?.();
            },
        });
    };

    return (
        <form onSubmit={submit} className="flex h-full flex-col">
            {/* scrollable content */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
                <div>
                    <Label>Name</Label>
                    <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                    <Label>Description</Label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="w-full rounded border px-3 py-2"
                        rows={3}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>

                <div>
                    <Label>Parent Category</Label>
                    <select
                        className="w-full rounded border px-3 py-2"
                        value={data.parent_id ?? ''}
                        onChange={(e) => setData('parent_id', e.target.value ? Number(e.target.value) : null)}
                    >
                        <option value="">None</option>
                        {flattenCategories(parentCategories).map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.parent_id && <p className="text-sm text-red-500">{errors.parent_id}</p>}
                </div>

                <div className="flex items-center space-x-2">
                    <Switch checked={data.is_active as boolean} onCheckedChange={(checked) => setData('is_active', Boolean(checked))} />
                    <Label>{data.is_active ? 'Active' : 'Inactive'}</Label>
                </div>
            </div>

            <div className="flex justify-end gap-2 border-t p-4">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    Create
                </Button>
            </div>
        </form>
    );
}
