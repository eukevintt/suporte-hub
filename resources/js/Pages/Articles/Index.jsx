import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";

export default function Index({ articles }) {
    const { url } = usePage();
    const params = new URLSearchParams(url.split("?")[1]);
    const currentStatus = params.get("status") ?? "";

    const destroy = (id) => {
        if (!confirm("Excluir este artigo?")) return;
        router.delete(route("articles.destroy", id), { preserveScroll: true });
    };

    const toggleStatus = (article) => {
        const isDraft = article.status === "draft";
        const routeName = isDraft ? "articles.publish" : "articles.unpublish";
        router.put(route(routeName, article.id), {}, { preserveScroll: true });
    };

    return (
        <AppLayout title="Artigos">
            <Head title="Artigos" />

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">Listagem</h2>
                    <p className="text-sm text-gray-500">Clique no título para abrir o artigo.</p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        className="border rounded px-3 py-2 text-sm"
                        value={currentStatus}
                        onChange={(e) => {
                            const status = e.target.value;

                            router.get(
                                route("articles.index"),
                                status ? { status } : {},
                                { preserveScroll: true }
                            );
                        }}
                    >
                        <option value="">Todos</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>

                    <Link
                        href={route("articles.create")}
                        className="rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                        Novo artigo
                    </Link>
                </div>
            </div>

            <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b">
                        <tr>
                            <th className="py-2">Title</th>
                            <th className="py-2">Category</th>
                            <th className="py-2">Tags</th>
                            <th className="py-2">Status</th>
                            <th className="py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((a) => (
                            <tr
                                key={a.id}
                                className="border-b cursor-pointer hover:bg-gray-100"
                                onClick={() => router.visit(route("articles.show", a.slug))}
                            >
                                <td className="py-2">
                                    <div className="font-medium">{a.title}</div>
                                    <div className="text-xs text-gray-500">{a.slug}</div>
                                </td>
                                <td className="py-2">{a.category?.name ?? "-"}</td>
                                <td className="py-2">
                                    {(a.tags ?? []).length ? a.tags.map((t) => t.name).join(", ") : "-"}
                                </td>

                                <td className="py-2">
                                    <span className="inline-flex items-center rounded px-2 py-1 text-xs font-medium border">
                                        {a.status}
                                    </span>
                                </td>

                                <td className="py-2 text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            className="rounded border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                                            onClick={() => toggleStatus(a)}
                                        >
                                            {a.status === "draft" ? "Publicar" : "Voltar para draft"}
                                        </button>

                                        <button
                                            type="button"
                                            className="text-sm text-red-700 underline"
                                            onClick={() => destroy(a.id)}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!articles.length ? (
                            <tr>
                                <td colSpan="5" className="py-4 text-center text-gray-600">
                                    Nenhum artigo criado ainda.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
