import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ query, articles }) {
    return (
        <AppLayout title="Busca">
            <Head title="Busca" />

            {query && (
                <p className="mb-4 text-sm text-gray-500">
                    Resultados para <strong>“{query}”</strong>
                </p>
            )}

            {articles.length === 0 && query && (
                <p className="text-gray-500">Nenhum resultado encontrado.</p>
            )}

            <div className="space-y-4">
                {articles.map((article) => (
                    <Link
                        key={article.id}
                        href={`/articles/${article.slug}`}
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
        </AppLayout>
    );
}
