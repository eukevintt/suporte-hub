import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function Form({
    mode = "edit",
    migration = null,
    authorizationOptions = [],
    statusOptions = [],
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        client_email: migration?.client_email ?? "",
        node_id: migration?.node_id ?? "",
        has_start_stop: Boolean(migration?.has_start_stop ?? false),
        authorization: migration?.authorization ?? "no_response",
        migration_date: migration?.migration_date ?? "",
        migration_time: migration?.migration_time ?? "",
        source_server: migration?.source_server ?? "",
        destination_server: migration?.destination_server ?? "",
        status: migration?.status ?? "awaiting_authorization",
        notes: migration?.notes ?? "",
    });

    useEffect(() => {
        if (!migration) return;

        setData({
            client_email: migration.client_email ?? "",
            node_id: migration.node_id ?? "",
            has_start_stop: Boolean(migration.has_start_stop ?? false),
            authorization: migration.authorization ?? "no_response",
            migration_date: migration.migration_date ?? "",
            migration_time: migration.migration_time ?? "",
            source_server: migration.source_server ?? "",
            destination_server: migration.destination_server ?? "",
            status: migration.status ?? "awaiting_authorization",
            notes: migration.notes ?? "",
        });
    }, [migration]);

    const submit = (e) => {
        e.preventDefault();

        if (mode === "edit") {
            put(route("utilities.migrations.update", migration.id));
            return;
        }

        post(route("utilities.migrations.store"));
    };

    const inputClass =
        "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none";
    const labelClass = "mb-1 block text-sm font-medium text-gray-700";
    const errorClass = "mt-1 text-sm text-red-600";

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className={labelClass}>E-mail do cliente</label>
                    <input
                        type="email"
                        value={data.client_email}
                        onChange={(e) => setData("client_email", e.target.value)}
                        className={inputClass}
                    />
                    {errors.client_email && (
                        <div className={errorClass}>{errors.client_email}</div>
                    )}
                </div>

                <div>
                    <label className={labelClass}>Node ID</label>
                    <input
                        type="text"
                        value={data.node_id}
                        onChange={(e) => setData("node_id", e.target.value)}
                        className={inputClass}
                    />
                    {errors.node_id && (
                        <div className={errorClass}>{errors.node_id}</div>
                    )}
                </div>

                <div>
                    <label className={labelClass}>Autorização</label>
                    <select
                        value={data.authorization}
                        onChange={(e) => setData("authorization", e.target.value)}
                        className={inputClass}
                    >
                        {authorizationOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.authorization && (
                        <div className={errorClass}>{errors.authorization}</div>
                    )}
                </div>

                <div>
                    <label className={labelClass}>Situação</label>
                    <select
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                        className={inputClass}
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.status && (
                        <div className={errorClass}>{errors.status}</div>
                    )}
                </div>

                <div>
                    <label className={labelClass}>Data da migração</label>
                    <input
                        type="date"
                        value={data.migration_date}
                        onChange={(e) => setData("migration_date", e.target.value)}
                        className={inputClass}
                    />
                    {errors.migration_date && (
                        <div className={errorClass}>{errors.migration_date}</div>
                    )}
                </div>

                <div>
                    <label className={labelClass}>Horário da migração</label>
                    <input
                        type="time"
                        value={data.migration_time}
                        onChange={(e) => setData("migration_time", e.target.value)}
                        className={inputClass}
                    />
                    {errors.migration_time && (
                        <div className={errorClass}>{errors.migration_time}</div>
                    )}
                </div>

                <div>
                    <label className={labelClass}>Servidor de origem</label>
                    <input
                        type="text"
                        value={data.source_server}
                        onChange={(e) => setData("source_server", e.target.value)}
                        className={inputClass}
                    />
                    {errors.source_server && (
                        <div className={errorClass}>{errors.source_server}</div>
                    )}
                </div>

                <div>
                    <label className={labelClass}>Servidor de destino</label>
                    <input
                        type="text"
                        value={data.destination_server}
                        onChange={(e) => setData("destination_server", e.target.value)}
                        className={inputClass}
                    />
                    {errors.destination_server && (
                        <div className={errorClass}>{errors.destination_server}</div>
                    )}
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 p-4">
                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={data.has_start_stop}
                        onChange={(e) =>
                            setData("has_start_stop", e.target.checked)
                        }
                    />
                    <span className="text-sm font-medium text-gray-700">
                        Possui start/stop
                    </span>
                </label>
                {errors.has_start_stop && (
                    <div className={errorClass}>{errors.has_start_stop}</div>
                )}
            </div>

            <div>
                <label className={labelClass}>Observações</label>
                <textarea
                    rows={5}
                    value={data.notes}
                    onChange={(e) => setData("notes", e.target.value)}
                    className={inputClass}
                />
                {errors.notes && (
                    <div className={errorClass}>{errors.notes}</div>
                )}
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                    {mode === "edit" ? "Salvar alterações" : "Criar migração"}
                </button>
            </div>
        </form>
    );
}
