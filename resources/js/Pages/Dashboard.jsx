import AppLayout from "@/Layouts/AppLayout";
import { Link, router, Head } from "@inertiajs/react";

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

function migrationTitle(item) {
    return item.type === "infra"
        ? "Migração de Infraestrutura"
        : item.client_email;
}

function migrationSubtitle(item) {
    if (item.type === "infra") {
        return `${item.source_server} → ${item.destination_server}`;
    }

    return `Node ID: ${item.node_id} • ${item.migration_time}`;
}

function migrationEditRoute(item) {
    return item.type === "infra"
        ? route("utilities.migrations.infra.edit", item.id)
        : route("utilities.migrations.edit", item.id);
}

function updateMigrationStatus(id, status) {
    router.put(
        route("utilities.migrations.status", id),
        { status },
        { preserveScroll: true }
    );
}

function HighlightMigrationCard({ item }) {
    const isInfra = item.type === "infra";

    return (
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">
                            {migrationTitle(item)}
                        </h3>

                        {isInfra && (
                            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                                INFRA
                            </span>
                        )}

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(item.status)}`}
                        >
                            {item.status_label}
                        </span>
                    </div>

                    <div className="grid gap-2 text-sm text-gray-700 md:grid-cols-2">
                        {isInfra ? (
                            <>
                                <div>
                                    <span className="font-semibold">Origem:</span>{" "}
                                    {item.source_server}
                                </div>
                                <div>
                                    <span className="font-semibold">Destino:</span>{" "}
                                    {item.destination_server}
                                </div>
                                <div>
                                    <span className="font-semibold">Início:</span>{" "}
                                    {item.infra_start_date_br ?? item.infra_start_date}
                                </div>
                                <div>
                                    <span className="font-semibold">Containers:</span>{" "}
                                    {item.remaining_containers ?? "—"}/{item.total_containers ?? "—"}
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <span className="font-semibold">Node ID:</span>{" "}
                                    {item.node_id}
                                </div>
                                <div>
                                    <span className="font-semibold">Horário:</span>{" "}
                                    {item.migration_time}
                                </div>
                                <div>
                                    <span className="font-semibold">Origem:</span>{" "}
                                    {item.source_server}
                                </div>
                                <div>
                                    <span className="font-semibold">Destino:</span>{" "}
                                    {item.destination_server}
                                </div>
                            </>
                        )}
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
    commonArticles = [],
}) {
    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

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
                                        <div className="flex items-center gap-2 font-medium">
                                            {migrationTitle(item)}
                                            {item.type === "infra" && (
                                                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                                                    INFRA
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            {item.type === "infra"
                                                ? `${item.infra_start_date_br ?? item.infra_start_date} • ${migrationSubtitle(item)}`
                                                : `${item.migration_date_br} às ${item.migration_time}`}
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
                                        <div className="flex items-center gap-2 font-medium">
                                            {migrationTitle(item)}
                                            {item.type === "infra" && (
                                                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                                                    INFRA
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            {item.type === "infra"
                                                ? migrationSubtitle(item)
                                                : `Node ID: ${item.node_id} • ${item.migration_time}`}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass(item.status)}`}
                                        >
                                            {item.status_label}
                                        </div>

                                        <Link
                                            href={migrationEditRoute(item)}
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
                        <div className="text-sm font-semibold">Chamados comuns</div>
                        <div className="text-xs text-gray-500">
                            Problemas frequentes e soluções rápidas
                        </div>
                    </div>

                    <div className="divide-y">
                        {commonArticles.map((a) => (
                            <div key={a.id} className="px-4 py-3">
                                <Link
                                    href={route("articles.show", a.slug)}
                                    className="font-medium hover:underline"
                                >
                                    {a.title}
                                </Link>

                                <div className="text-xs text-gray-500">
                                    {a.category?.name ?? "—"} • {a.author?.name ?? "—"}
                                </div>
                            </div>
                        ))}

                        {!commonArticles.length ? (
                            <div className="px-4 py-6 text-center text-sm text-gray-500">
                                Nenhum chamado comum encontrado.
                            </div>
                        ) : null}
                    </div>
                </section>

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
