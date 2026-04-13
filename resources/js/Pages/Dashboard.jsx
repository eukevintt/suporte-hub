import AppLayout from "@/Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";

function statusBadgeClass(status) {
    const map = {
        awaiting_authorization: "bg-yellow-100 text-yellow-800",
        scheduled: "bg-blue-100 text-blue-800",
        in_progress: "bg-orange-100 text-orange-800",
        completed: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };

    return map[status] ?? "bg-gray-100 text-gray-700";
}

function updateMigrationStatus(id, status) {
    router.put(
        route("utilities.migrations.status", id),
        { status },
        { preserveScroll: true }
    );
}

function HighlightMigrationCard({ item }) {
    return (
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">
                            {item.client_email}
                        </h3>

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(item.status)}`}
                        >
                            {item.status_label}
                        </span>
                    </div>

                    <div className="grid gap-2 text-sm text-gray-700 md:grid-cols-2">
                        <div>
                            <span className="font-semibold">Node ID:</span> {item.node_id}
                        </div>
                        <div>
                            <span className="font-semibold">Horário:</span> {item.migration_time}
                        </div>
                        <div>
                            <span className="font-semibold">Origem:</span> {item.source_server}
                        </div>
                        <div>
                            <span className="font-semibold">Destino:</span> {item.destination_server}
                        </div>
                    </div>

                    {item.notes ? (
                        <div className="text-sm text-gray-700">
                            <span className="font-semibold">Observações:</span> {item.notes}
                        </div>
                    ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => updateMigrationStatus(item.id, "in_progress")}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        Em andamento
                    </button>

                    <button
                        type="button"
                        onClick={() => updateMigrationStatus(item.id, "completed")}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        Realizada
                    </button>

                    <button
                        type="button"
                        onClick={() => updateMigrationStatus(item.id, "cancelled")}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        Cancelada
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard({
    mostLiked = [],
    highlightMigrations = [],
    todayMigrations = [],
    upcomingMigrations = [],
}) {
    return (
        <AppLayout title="Dashboard">
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">Dashboard</h2>
                </div>

                {highlightMigrations.length ? (
                    <section className="space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-red-700">
                                🔴 Migrações acontecendo hoje
                            </h3>
                            <p className="text-sm text-gray-600">
                                Essas migrações ficam destacadas até serem concluídas ou canceladas.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {highlightMigrations.map((item) => (
                                <HighlightMigrationCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                ) : null}

                <div className="grid gap-6 xl:grid-cols-2">
                    <section className="rounded-lg border bg-white">
                        <div className="border-b px-4 py-3">
                            <div className="text-sm font-semibold">Próximas migrações</div>
                            <div className="text-xs text-gray-500">
                                Hoje e próximos dias
                            </div>
                        </div>

                        <div className="divide-y">
                            {upcomingMigrations.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-4 px-4 py-3"
                                >
                                    <div>
                                        <div className="font-medium">{item.client_email}</div>
                                        <div className="text-xs text-gray-500">
                                            {item.migration_date_br} às {item.migration_time}
                                        </div>
                                    </div>

                                    <div
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass(item.status)}`}
                                    >
                                        {item.status_label}
                                    </div>
                                </div>
                            ))}

                            {!upcomingMigrations.length ? (
                                <div className="px-4 py-6 text-center text-sm text-gray-500">
                                    Nenhuma próxima migração.
                                </div>
                            ) : null}
                        </div>
                    </section>

                    <section className="rounded-lg border bg-white">
                        <div className="border-b px-4 py-3">
                            <div className="text-sm font-semibold">Migrações de hoje</div>
                            <div className="text-xs text-gray-500">
                                Todas as migrações ativas agendadas para hoje
                            </div>
                        </div>

                        <div className="divide-y">
                            {todayMigrations.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-4 px-4 py-3"
                                >
                                    <div>
                                        <div className="font-medium">{item.client_email}</div>
                                        <div className="text-xs text-gray-500">
                                            Node ID: {item.node_id} • {item.migration_time}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass(item.status)}`}
                                        >
                                            {item.status_label}
                                        </div>

                                        <Link
                                            href={route("utilities.migrations.edit", item.id)}
                                            className="text-sm font-medium hover:underline"
                                        >
                                            Editar
                                        </Link>
                                    </div>
                                </div>
                            ))}

                            {!todayMigrations.length ? (
                                <div className="px-4 py-6 text-center text-sm text-gray-500">
                                    Nenhuma migração ativa para hoje.
                                </div>
                            ) : null}
                        </div>
                    </section>
                </div>

                <section className="rounded-lg border bg-white">
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
                </section>
            </div>
        </AppLayout>
    );
}
