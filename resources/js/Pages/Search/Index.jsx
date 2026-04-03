import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ query, articles }) {
    const items = articles?.data ?? [];
    const links = articles?.links ?? [];

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
        <AppLayout title="Busca">
            <Head title="Busca" />

            {query && (
                <p className="mb-4 text-sm text-gray-500">
                    Resultados para <strong>“{query}”</strong>
                </p>
            )}

            {items.length === 0 && query && (
                <p className="text-gray-500">Nenhum resultado encontrado.</p>
            )}

            <div className="space-y-4">
                {items.map((article) => (
                    <Link
                        key={article.id}
                        href={route("articles.show", article.slug)}
                        className="block rounded-lg border p-4 hover:bg-gray-50"
                    >
                        <h2 className="font-semibold text-gray-900">
                            {article.title}
                        </h2>

                        {article.excerpt && (
                            <p className="mt-1 text-sm text-gray-600">
                                {article.excerpt}
                            </p>
                        )}
                    </Link>
                ))}
            </div>

            {links.length > 3 ? (
                <div className="mt-6 flex flex-wrap items-center gap-2">
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
        </AppLayout>
    );
}
