import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export type Category = {
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
        items.push({ id: category.id, name: `${prefix}${category.name}` });
        if (category.children && category.children.length > 0) {
            items = items.concat(flattenCategories(category.children, prefix + '— '));
        }
    });
    return items;
}

export default function EditCategoryForm({
    category,
    parentCategories = [],
    onCancel,
}: {
    category: Category;
    parentCategories?: Category[];
    onCancel?: () => void;
}) {
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const { data, setData, put, processing, errors } = useForm<{
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

    useEffect(() => {
        axios
            .get(route('categories.show', category.id))
            .then((res) => {
                const cat = res.data;
                setData({
                    name: cat.name,
                    description: cat.description ?? '',
                    parent_id: cat.parent_id ?? null,
                    is_active: cat.is_active ?? true,
                });
                setLoading(false);
            })
            .catch(() => {
                setNotFound(true);
                setLoading(false);
            });
    }, [category.id]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('categories.update', category.id), {
            onSuccess: () => {
                onCancel?.();
            },
        });
    };

    if (loading) return <p className="p-6 text-sm">Loading...</p>;
    if (notFound) return <p className="p-6 text-sm text-red-500">Category not found.</p>;

    return (
        <form onSubmit={submit} className="flex h-full flex-col">
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
                    <Switch checked={data.is_active} onCheckedChange={(val) => setData('is_active', val)} />
                    <Label>{data.is_active ? 'Active' : 'Inactive'}</Label>
                </div>
            </div>
            <div className="flex justify-end gap-2 border-t p-4">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update
                </Button>
            </div>
        </form>
    );
}
