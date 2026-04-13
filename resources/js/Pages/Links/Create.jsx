import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { useForm, usePage, Link } from "@inertiajs/react";

export default function Create() {
    const { types } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        url: "",
        description: "",
        link_type_id: "",
        new_type: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("links.store"));
    };

    return (
        <AppLayout title="Adicionar link">
            <div className="max-w-xl space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Adicionar link</h1>

                    <Link
                        href={route("links.index")}
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
                            className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2"
                        />
                        {errors.name && (
                            <div className="text-xs text-red-500 mt-1">
                                {errors.name}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm">URL</label>
                        <input
                            type="text"
                            value={data.url}
                            onChange={(e) => setData("url", e.target.value)}
                            className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2"
                        />
                        {errors.url && (
                            <div className="text-xs text-red-500 mt-1">
                                {errors.url}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm">Descrição</label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm">Tipo existente</label>
                        <select
                            value={data.link_type_id}
                            onChange={(e) =>
                                setData("link_type_id", e.target.value)
                            }
                            className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2"
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
                            onChange={(e) =>
                                setData("new_type", e.target.value)
                            }
                            className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-gray-900 text-white px-4 py-2 text-sm"
                    >
                        Salvar
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
