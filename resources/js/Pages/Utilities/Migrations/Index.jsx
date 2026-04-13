import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";

function badgeClass(status) {
    const map = {
        awaiting_authorization: "bg-yellow-100 text-yellow-800",
        scheduled: "bg-blue-100 text-blue-800",
        in_progress: "bg-orange-100 text-orange-800",
        completed: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };

    return map[status] ?? "bg-gray-100 text-gray-700";
}

function QuickStatusButtons({ item }) {
    const updateStatus = (status) => {
        router.put(
            route("utilities.migrations.status", item.id),
            { status },
            { preserveScroll: true }
        );
    };

    const canQuickUpdate =
        item.status === "awaiting_authorization" ||
        item.status === "scheduled" ||
        item.status === "in_progress";

    if (!canQuickUpdate) return null;

    return (
        <div className="mt-3 flex flex-wrap gap-2">
            <button
                type="button"
                onClick={() => updateStatus("in_progress")}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
            >
                Em andamento
            </button>

            <button
                type="button"
                onClick={() => updateStatus("completed")}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
            >
                Realizada
            </button>

            <button
                type="button"
                onClick={() => updateStatus("cancelled")}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
            >
                Cancelada
            </button>
        </div>
    );
}

function MigrationCard({ item, showQuickActions = false }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold">{item.client_email}</h3>
                        <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(item.status)}`}
                        >
                            {item.status_label}
                        </span>
                    </div>

                    <div className="grid gap-2 text-sm text-gray-600 md:grid-cols-2">
                        <div>
                            <span className="font-medium text-gray-700">Node ID:</span>{" "}
                            {item.node_id}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Data:</span>{" "}
                            {item.migration_date_br}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Horário:</span>{" "}
                            {item.migration_time}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Start/Stop:</span>{" "}
                            {item.has_start_stop ? "Sim" : "Não"}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Autorização:</span>{" "}
                            {item.authorization_label}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Origem → Destino:</span>{" "}
                            {item.source_server} → {item.destination_server}
                        </div>
                    </div>

                    {item.notes ? (
                        <div className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Observações:</span>{" "}
                            {item.notes}
                        </div>
                    ) : null}

                    {showQuickActions ? <QuickStatusButtons item={item} /> : null}
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href={route("utilities.migrations.edit", item.id)}
                        className="text-sm font-medium hover:underline"
                    >
                        Editar
                    </Link>

                    <button
                        type="button"
                        onClick={() => {
                            if (confirm("Tem certeza que deseja remover esta migração?")) {
                                router.delete(route("utilities.migrations.destroy", item.id));
                            }
                        }}
                        className="text-sm font-medium text-red-600 hover:underline"
                    >
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Index({
    activeMigrations = [],
    historyMigrations = [],
}) {
    return (
        <AppLayout title="Migrações">
            <Head title="Migrações" />

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Migrações</h1>
                        <p className="text-sm text-gray-500">
                            Controle e acompanhamento de migrações
                        </p>
                    </div>

                    <Link
                        href={route("utilities.migrations.create")}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        Nova migração
                    </Link>
                </div>

                <section className="space-y-3">
                    <div>
                        <h2 className="text-lg font-semibold">Migrações ativas</h2>
                        <p className="text-sm text-gray-500">
                            Aguardando autorização, agendadas ou em andamento
                        </p>
                    </div>

                    <div className="space-y-4">
                        {activeMigrations.length ? (
                            activeMigrations.map((item) => (
                                <MigrationCard
                                    key={item.id}
                                    item={item}
                                    showQuickActions
                                />
                            ))
                        ) : (
                            <div className="rounded-xl border border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-500">
                                Nenhuma migração ativa encontrada.
                            </div>
                        )}
                    </div>
                </section>

                <section className="space-y-3">
                    <div>
                        <h2 className="text-lg font-semibold">Histórico</h2>
                        <p className="text-sm text-gray-500">
                            Migrações realizadas ou canceladas
                        </p>
                    </div>

                    <div className="space-y-4">
                        {historyMigrations.length ? (
                            historyMigrations.map((item) => (
                                <MigrationCard key={item.id} item={item} />
                            ))
                        ) : (
                            <div className="rounded-xl border border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-500">
                                Nenhuma migração no histórico.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
