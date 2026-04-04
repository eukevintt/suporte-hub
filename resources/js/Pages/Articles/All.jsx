import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function All({ articles, canDeleteArticles = false }) {
    const items = articles?.data ?? [];
    const links = articles?.links ?? [];

    const destroy = (id) => {
        if (!confirm("Excluir este artigo?")) return;

        router.delete(route("articles.destroy", id), {
            preserveScroll: true,
        });
    };

    const normalizeLabel = (label) => {
        if (label.includes("Previous") || label.includes("pagination.previous")) {
            return "Anterior";
        }

        if (label.includes("Next") || label.includes("pagination.next")) {
            return "Próxima";
        }

        return label;
    };

    return (
        <AppLayout title="Todos os artigos">
            <Head title="Todos os artigos" />

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">Todos os artigos</h2>
                    <p className="text-sm text-gray-500">
                        Lista completa de artigos publicados.
                    </p>
                </div>

                <Link
                    href={route("articles.index")}
                    className="rounded border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                    Voltar
                </Link>
            </div>

            <div className="mt-6 rounded-lg border bg-white">
                <div className="border-b px-4 py-3">
                    <div className="text-sm font-semibold">Publicados</div>
                    <div className="text-xs text-gray-500">
                        Lista paginada de artigos publicados.
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th>Título</th>
                                <th>Categoria</th>
                                <th>Tags</th>
                                <th>Autor</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((a) => (
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
                                    <td
                                        className="px-4 py-2 text-right"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {canDeleteArticles ? (
                                            <button
                                                type="button"
                                                className="text-sm text-red-700 underline"
                                                onClick={() => destroy(a.id)}
                                            >
                                                Excluir
                                            </button>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}

                            {!items.length ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-4 text-center text-gray-600">
                                        Nenhum artigo publicado ainda.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                {links.length > 3 ? (
                    <div className="flex flex-wrap items-center gap-2 border-t px-4 py-3">
                        {links.map((link, index) => (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url || "#"}
                                preserveScroll
                                className={`rounded-md border px-3 py-2 text-sm ${link.active
                                    ? "border-gray-900 bg-gray-900 text-white"
                                    : link.url
                                        ? "border-gray-200 bg-white hover:bg-gray-50"
                                        : "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                                    }`}
                            >
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: normalizeLabel(link.label),
                                    }}
                                />
                            </Link>
                        ))}
                    </div>
                ) : null}
            </div>
        </AppLayout>
    );
}
