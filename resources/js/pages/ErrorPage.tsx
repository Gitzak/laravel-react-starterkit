import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function ErrorPage({ status }: { status: number }) {
    const title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }[status];

    const description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }[status];

    return (
        <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
            <h1 className="mb-2 text-4xl font-bold">{title}</h1>
            <p className="text-muted-foreground mb-6">{description}</p>

            <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
            </Link>
        </div>
    );
}
