import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Link, useForm, usePage } from "@inertiajs/react";

export default function Edit() {
    const { link, types } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: link.name ?? "",
        url: link.url ?? "",
        description: link.description ?? "",
        link_type_id: link.link_type_id ?? "",
        new_type: "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("links.update", link.id));
    };

    return (
        <AppLayout title="Editar link">
            <div className="max-w-xl space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Editar link</h1>

                    <Link
                        href={route("links.manage")}
                        className="text-sm text-gray-500"
                    >
                        Voltar
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="text-sm">Nome</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                        />
                        {errors.name && (
                            <div className="mt-1 text-xs text-red-500">{errors.name}</div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm">URL</label>
                        <input
                            type="text"
                            value={data.url}
                            onChange={(e) => setData("url", e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                        />
                        {errors.url && (
                            <div className="mt-1 text-xs text-red-500">{errors.url}</div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm">Descrição</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm">Tipo existente</label>
                        <select
                            value={data.link_type_id}
                            onChange={(e) => setData("link_type_id", e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                        >
                            <option value="">Selecione</option>
                            {types.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm">Ou criar novo tipo</label>
                        <input
                            type="text"
                            value={data.new_type}
                            onChange={(e) => setData("new_type", e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
                    >
                        Salvar alterações
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
