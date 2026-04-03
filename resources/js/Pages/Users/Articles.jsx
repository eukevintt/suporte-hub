import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";

export default function Articles({ user, articles = [] }) {
    const initials = String(user?.name ?? "")
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <AppLayout title={`Artigos de ${user.name}`}>
            <Head title={`Artigos de ${user.name}`} />

            <div className="space-y-8">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold">
                            {initials || "—"}
                        </div>

                        <div>
                            <div className="text-xl font-semibold">{user.name}</div>
                            <div className="mt-1 text-sm text-gray-500">
                                Todos os artigos publicados
                            </div>
                        </div>
                    </div>

                    <Link
                        href={route("profiles.show", user.username)}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        Voltar ao perfil
                    </Link>
                </div>

                <div>
                    <div className="mb-3 text-lg font-semibold">
                        Artigos publicados
                    </div>

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
                                            <div className="font-medium">
                                                {article.title}
                                            </div>

                                            <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-gray-500">
                                                <div>
                                                    Categoria:{" "}
                                                    {article.category?.name ?? "—"}
                                                </div>

                                                <div>
                                                    Publicado em{" "}
                                                    {new Intl.DateTimeFormat(
                                                        "pt-BR",
                                                        {
                                                            dateStyle: "short",
                                                        },
                                                    ).format(
                                                        new Date(article.created_at),
                                                    )}
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
                        <div className="rounded-lg border bg-white p-6 text-sm text-gray-500">
                            <div className="font-medium text-gray-700">
                                Nada por aqui ainda
                            </div>
                            <div className="mt-1">
                                Este usuário ainda não publicou nenhum artigo.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
