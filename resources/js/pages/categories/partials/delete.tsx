import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function DeleteCategoryModal({ categoryId, open, onClose }: { categoryId: number; open: boolean; onClose: () => void }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = () => {
        setLoading(true);
        router.delete(route('categories.destroy', categoryId), {
            onSuccess: () => {
                onClose();
            },
            onError: () => {
                toast.error('Something went wrong while deleting.');
                setLoading(false);
                onClose();
            },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="text-center sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>This action cannot be undone.</DialogDescription>
                </DialogHeader>

                <DialogFooter className="justify-center pt-6">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
