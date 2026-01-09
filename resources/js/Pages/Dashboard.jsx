import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";

export default function Dashboard({ mostLiked = [] }) {
    return (
        <AppLayout title="Dashboard">
            <div className="space-y-6">
                <h2 className="text-lg font-semibold">Dashboard</h2>

                <div className="rounded-lg border bg-white">
                    <div className="border-b px-4 py-3">
                        <div className="text-sm font-semibold">Mais curtidos</div>
                        <div className="text-xs text-gray-500">Top 5 artigos publicados</div>
                    </div>

                    <div className="divide-y">
                        {mostLiked.map((a) => (
                            <div key={a.id} className="flex items-center justify-between px-4 py-3">
                                <div>
                                    <Link
                                        href={route("articles.show", a.slug)}
                                        className="font-medium hover:underline"
                                    >
                                        {a.title}
                                    </Link>
                                    <div className="text-xs text-gray-500">
                                        Autor: {a.author?.name ?? "—"}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <i className="fa-solid fa-heart text-red-500" />
                                    <span className="font-medium">{a.likes_count}</span>
                                </div>
                            </div>
                        ))}

                        {!mostLiked.length ? (
                            <div className="px-4 py-6 text-center text-sm text-gray-500">
                                Nenhum artigo curtido ainda.
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
