import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Link, useForm, usePage } from "@inertiajs/react";

export default function TypeEdit() {
    const { type } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: type.name ?? "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("links.types.update", type.id));
    };

    return (
        <AppLayout title="Editar tipo">
            <div className="max-w-xl space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Editar tipo</h1>

                    <Link
                        href={route("links.types.manage")}
                        className="text-sm text-gray-500"
                    >
                        Voltar
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="text-sm">Nome do tipo</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                        />
                        {errors.name && (
                            <div className="mt-1 text-xs text-red-500">
                                {errors.name}
                            </div>
                        )}
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
