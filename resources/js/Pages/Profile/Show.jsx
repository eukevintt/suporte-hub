import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";

export default function Show({ user, stats }) {
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <AppLayout title={`Perfil — ${user.name}`}>
            <Head title={`Perfil — ${user.name}`} />

            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold">
                    {initials}
                </div>

                <div>
                    <div className="text-xl font-semibold">{user.name}</div>
                    {user.role ? (
                        <div className="text-sm text-gray-500">{user.role}</div>
                    ) : null}
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border bg-white p-4">
                    <div className="text-sm text-gray-500">Artigos publicados</div>
                    <div className="mt-1 text-2xl font-semibold">
                        {stats.published_count}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
