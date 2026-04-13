import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";

export default function TypesManage() {
    const { types } = usePage().props;

    const destroyType = (type) => {
        if (!window.confirm(`Deseja apagar o tipo "${type.name}"?`)) return;
        router.delete(route("links.types.destroy", type.id));
    };

    return (
        <AppLayout title="Gerenciar tipos de links">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Gerenciar tipos</h1>

                    <Link
                        href={route("links.index")}
                        className="text-sm text-gray-500"
                    >
                        Voltar para links
                    </Link>
                </div>

                {types.length === 0 ? (
                    <div className="text-sm text-gray-500">
                        Nenhum tipo cadastrado.
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Nome
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Quantidade de links
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Ações
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {types.map((type) => (
                                    <tr key={type.id}>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {type.name}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {type.links_count}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route("links.types.edit", type.id)}
                                                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                                >
                                                    Editar
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => destroyType(type)}
                                                    className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600"
                                                >
                                                    Apagar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
