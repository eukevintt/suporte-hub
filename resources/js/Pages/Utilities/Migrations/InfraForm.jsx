import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";

export default function InfraForm({ migration = null, mode = "create" }) {
    const { data, setData, post, put, processing, errors } = useForm({
        source_server: migration?.source_server ?? "",
        destination_server: migration?.destination_server ?? "",
        infra_start_date: migration?.infra_start_date ?? "",
        infra_end_forecast: migration?.infra_end_forecast ?? "",
        infra_finished_at: migration?.infra_finished_at ?? "",
        total_containers: migration?.total_containers ?? "",
        remaining_containers: migration?.remaining_containers ?? "",
        status: migration?.status ?? "awaiting_authorization",
    });

    const submit = (e) => {
        e.preventDefault();

        if (mode === "edit") {
            put(route("utilities.migrations.infra.update", migration.id));
            return;
        }

        post(route("utilities.migrations.infra.store"));
    };

    const inputClass =
        "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none";
    const labelClass = "mb-1 block text-sm font-medium text-gray-700";
    const errorClass = "mt-1 text-sm text-red-600";

    return (
        <AppLayout title="Nova migração infra">
            <Head title="Nova migração infra" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Nova migração infra
                    </h1>
                    <p className="text-sm text-gray-500">
                        Cadastro de migração de infraestrutura.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>Servidor de origem</label>
                            <input
                                type="text"
                                value={data.source_server}
                                onChange={(e) =>
                                    setData("source_server", e.target.value)
                                }
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
                                onChange={(e) =>
                                    setData("destination_server", e.target.value)
                                }
                                className={inputClass}
                            />
                            {errors.destination_server && (
                                <div className={errorClass}>
                                    {errors.destination_server}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Data de início</label>
                            <input
                                type="datetime-local"
                                value={data.infra_start_date}
                                onChange={(e) =>
                                    setData("infra_start_date", e.target.value)
                                }
                                className={inputClass}
                            />
                            {errors.infra_start_date && (
                                <div className={errorClass}>
                                    {errors.infra_start_date}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>
                                Data previsão de término
                            </label>
                            <input
                                type="date"
                                value={data.infra_end_forecast}
                                onChange={(e) => setData("infra_end_forecast", e.target.value)}
                                className={inputClass}
                            />
                            {errors.infra_end_forecast && (
                                <div className={errorClass}>
                                    {errors.infra_end_forecast}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Total de containers</label>
                            <input
                                type="number"
                                min="0"
                                value={data.total_containers}
                                onChange={(e) =>
                                    setData("total_containers", e.target.value)
                                }
                                className={inputClass}
                            />
                            {errors.total_containers && (
                                <div className={errorClass}>
                                    {errors.total_containers}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>
                                Containers restantes
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.remaining_containers}
                                onChange={(e) =>
                                    setData("remaining_containers", e.target.value)
                                }
                                className={inputClass}
                            />
                            {errors.remaining_containers && (
                                <div className={errorClass}>
                                    {errors.remaining_containers}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>
                                Data e horário da finalização
                            </label>
                            <input
                                type="datetime-local"
                                value={data.infra_finished_at}
                                onChange={(e) =>
                                    setData("infra_finished_at", e.target.value)
                                }
                                className={inputClass}
                            />
                            {errors.infra_finished_at && (
                                <div className={errorClass}>
                                    {errors.infra_finished_at}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData("status", e.target.value)}
                                className={inputClass}
                            >
                                <option value="awaiting_authorization">Aguardando</option>
                                <option value="scheduled">Agendado</option>
                                <option value="in_progress">Em execução</option>
                                <option value="completed">Finalizado</option>
                            </select>
                            {errors.status && (
                                <div className={errorClass}>{errors.status}</div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                            style={{ backgroundColor: "#192344" }}
                        >
                            {mode === "edit" ? "Salvar alterações" : "Criar migração infra"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
