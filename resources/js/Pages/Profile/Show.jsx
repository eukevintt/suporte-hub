import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ user, viewer, stats, articles = [] }) {
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

                <div className="rounded-lg border bg-white p-4">
                    <div className="text-sm text-gray-500">Curtidas recebidas</div>
                    <div className="mt-1 text-2xl font-semibold">
                        {stats.total_likes_received}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <div className="mb-3 text-lg font-semibold">Artigos publicados</div>

                {articles.length ? (
                    <div className="space-y-3">
                        {articles.map((article) => (
                            <Link
                                key={article.id}
                                href={route("articles.show", article.slug)}
                                className="block rounded-lg border bg-white p-4 hover:bg-gray-50"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="font-medium">{article.title}</div>

                                        <div className="mt-1 text-sm text-gray-500 flex flex-wrap gap-x-4">
                                            <div>
                                                Categoria: {article.category?.name ?? "—"}
                                            </div>

                                            <div>
                                                Publicado em:{" "}
                                                {new Intl.DateTimeFormat("pt-BR", {
                                                    dateStyle: "short",
                                                }).format(new Date(article.created_at))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <i className="fa-regular fa-heart" />
                                        {article.likes_count}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border bg-white p-4 text-sm text-gray-500">
                        Este usuário ainda não publicou nenhum artigo.
                    </div>
                )}
            </div>

        </AppLayout>
    );
}
