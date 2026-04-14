import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Show({ user, viewer, stats, articles = [] }) {
    const isMe = Number(viewer?.id) === Number(user?.id);
    const [copied, setCopied] = useState(false);

    const initials = String(user?.name ?? "")
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const copyProfileLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            const el = document.createElement("textarea");
            el.value = window.location.href;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        }
    };

    const roleLabelMap = {
        superadmin: "Superadministrador",
        admin: "Administrador",
        n1: "Suporte N1",
        n2: "Suporte N2",
        n3: "Suporte N3",
        iniciante: "Iniciante",
    };

    const roleLabel = user?.role ? roleLabelMap[user.role] ?? user.role : null;

    return (
        <AppLayout title={`Perfil — ${user.name}`}>
            <Head title={`Perfil — ${user.name}`} />

            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-xl font-semibold">
                        {user?.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={`Avatar de ${user.name}`}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            initials || "—"
                        )}
                    </div>

                    <div>
                        <div className="text-xl font-semibold">{user.name}</div>
                        {roleLabel ? (
                            <span className="mt-1 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700">
                                {roleLabel}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={copyProfileLink}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                        title="Copiar link do perfil"
                    >
                        <i className="fa-regular fa-copy" />
                        <span className="ml-2">{copied ? "Copiado" : "Copiar link"}</span>
                    </button>

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
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border bg-white p-4">
                    <div className="text-sm text-gray-500">Artigos publicados</div>
                    <div className="mt-1 text-2xl font-semibold">{stats.published_count}</div>
                </div>

                <div className="rounded-lg border bg-white p-4">
                    <div className="text-sm text-gray-500">Curtidas recebidas</div>
                    <div className="mt-1 text-2xl font-semibold">{stats.total_likes_received}</div>
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
                                            <div>Categoria: {article.category?.name ?? "—"}</div>

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
                    <div className="rounded-lg border bg-white p-6 text-sm text-gray-500">
                        <div className="font-medium text-gray-700">Nada por aqui ainda</div>
                        <div className="mt-1">Este usuário ainda não publicou nenhum artigo.</div>
                    </div>
                )}

                {articles.length > 0 && (
                    <div className="mt-4 text-right">
                        <Link
                            href={route("profiles.articles", user.username)}
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            Ver todos os artigos →
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
