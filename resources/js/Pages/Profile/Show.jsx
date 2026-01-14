import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ user, viewer, stats }) {
    const isMe = Number(viewer?.id) === Number(user?.id);

    const initials = String(user?.name ?? "")
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <AppLayout title={`Perfil — ${user.name}`}>
            <Head title={`Perfil — ${user.name}`} />

            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold">
                        {initials || "—"}
                    </div>

                    <div>
                        <div className="text-xl font-semibold">{user.name}</div>
                        {user.role ? <div className="text-sm text-gray-500">{user.role}</div> : null}
                    </div>
                </div>

                {isMe ? (
                    <Link
                        href={route("profile.edit")}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                        title="Configurações do perfil"
                    >
                        <i className="fa-solid fa-gear" />
                    </Link>
                ) : null}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border bg-white p-4">
                    <div className="text-sm text-gray-500">Artigos publicados</div>
                    <div className="mt-1 text-2xl font-semibold">{stats.published_count}</div>
                </div>
            </div>
        </AppLayout>
    );
}
