import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Index({
    articles,
    pendingReview = [],
    canReview = false,
    canDeleteArticles = false,
    hasMorePublishedArticles = false,
}) {
    const [pending, setPending] = useState(pendingReview ?? []);

    const { url } = usePage();
    const [showPendingNotice, setShowPendingNotice] = useState(false);

    useEffect(() => {
        setPending(pendingReview ?? []);
    }, [pendingReview]);

    useEffect(() => {
        try {
            const u = new URL(url, window.location.origin);
            const submitted = u.searchParams.get("submitted");

            if (submitted === "pending_review") {
                setShowPendingNotice(true);

                const t = setTimeout(() => setShowPendingNotice(false), 7000);

                window.history.replaceState({}, "", route("articles.index"));

                return () => clearTimeout(t);
            }
        } catch { }
    }, [url]);

    const destroy = (id) => {
        if (!confirm("Excluir este artigo?")) return;
        router.delete(route("articles.destroy", id), {
            preserveScroll: true,
            onSuccess: () => {
                if (canReview) {
                    router.reload({ only: ["pendingReview", "articles"], preserveScroll: true });
                }
            },
        });
    };

    const approve = (article) => {
        setPending((prev) => prev.filter((x) => x.id !== article.id));

        router.put(route("articles.approve", article.id), {}, {
            preserveScroll: true,
            onError: () => {
                router.reload({ only: ["pendingReview"], preserveScroll: true });
            },
            onSuccess: () => {
                router.reload({ only: ["pendingReview", "articles"], preserveScroll: true });
            },
        });
    };

    const reject = (article) => {
        if (!confirm("Rejeitar este artigo?")) return;

        setPending((prev) => prev.filter((x) => x.id !== article.id));

        router.put(route("articles.reject", article.id), {}, {
            preserveScroll: true,
            onError: () => {
                router.reload({ only: ["pendingReview"], preserveScroll: true });
            },
            onSuccess: () => {
                router.reload({ only: ["pendingReview"], preserveScroll: true });
            },
        });
    };

    return (
        <AppLayout title="Artigos">
            <Head title="Artigos" />

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">Artigos</h2>
                    <p className="text-sm text-gray-500">Clique no título para abrir o artigo.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href={route("articles.create")}
                        className="rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                        Novo artigo
                    </Link>
                </div>
            </div>

            {showPendingNotice ? (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    <div className="font-semibold">Enviado para análise</div>
                    <div className="text-amber-800">
                        Seu artigo entrou na fila de revisão e ficará visível para todos após aprovação.
                    </div>
                </div>
            ) : null}

            {canReview ? (
                <div className="mt-6 rounded-lg border bg-white">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <div>
                            <div className="text-sm font-semibold">Fila de revisão</div>
                            <div className="text-xs text-gray-500">Mostrando até 5 pendentes.</div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2">Título</th>
                                    <th className="px-4 py-2">Categoria</th>
                                    <th className="px-4 py-2">Tags</th>
                                    <th className="px-4 py-2">Autor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pending.map((a) => (
                                    <tr
                                        key={a.id}
                                        className="border-t cursor-pointer hover:bg-gray-50"
                                        onClick={() => router.visit(route("articles.show", a.slug))}
                                    >
                                        <td className="px-4 py-2">
                                            <div className="font-medium">{a.title}</div>
                                            <div className="text-xs text-gray-500">{a.slug}</div>
                                        </td>
                                        <td className="px-4 py-2">{a.category?.name ?? "-"}</td>
                                        <td className="px-4 py-2">
                                            {(a.tags ?? []).length ? a.tags.map((t) => t.name).join(", ") : "-"}
                                        </td>
                                        <td className="px-4 py-2">{a.author?.name ?? "-"}</td>
                                        <td className="px-4 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                                                    onClick={() => approve(a)}
                                                >
                                                    Publicar
                                                </button>
                                                <button
                                                    type="button"
                                                    className="rounded border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                                                    onClick={() => reject(a)}
                                                >
                                                    Rejeitar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {!pending.length ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-4 text-center text-gray-600">
                                            Nenhum artigo pendente.
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : null}

            <div className="mt-6 rounded-lg border bg-white">
                <div className="border-b px-4 py-3">
                    <div className="text-sm font-semibold">Publicados</div>
                    <div className="text-xs text-gray-500">Mostrando até 10 publicados.</div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2">Título</th>
                                <th className="px-4 py-2">Categoria</th>
                                <th className="px-4 py-2">Tags</th>
                                <th className="px-4 py-2">Autor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map((a) => (
                                <tr
                                    key={a.id}
                                    className="border-t cursor-pointer hover:bg-gray-50"
                                    onClick={() => router.visit(route("articles.show", a.slug))}
                                >
                                    <td className="px-4 py-2">
                                        <div className="font-medium">{a.title}</div>
                                        <div className="text-xs text-gray-500">{a.slug}</div>
                                    </td>
                                    <td className="px-4 py-2">{a.category?.name ?? "-"}</td>
                                    <td className="px-4 py-2">
                                        {(a.tags ?? []).length ? a.tags.map((t) => t.name).join(", ") : "-"}
                                    </td>
                                    <td className="px-4 py-2">{a.author?.name ?? "-"}</td>
                                    <td className="px-4 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-end gap-3">
                                            {canDeleteArticles ? (
                                                <button
                                                    type="button"
                                                    className="text-sm text-red-700 underline"
                                                    onClick={() => destroy(a.id)}
                                                >
                                                    Excluir
                                                </button>
                                            ) : null}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!articles.length ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-4 text-center text-gray-600">
                                        Nenhum artigo publicado ainda.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                    {hasMorePublishedArticles ? (
                        <div className="border-t px-4 py-3">
                            <Link
                                href={route("articles.all")}
                                className="text-sm font-medium text-gray-900 underline hover:text-gray-700"
                            >
                                Ver todos os artigos
                            </Link>
                        </div>
                    ) : null}
                </div>
            </div>
        </AppLayout>
    );
}
