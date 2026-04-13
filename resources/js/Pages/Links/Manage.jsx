import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";

export default function Manage() {
    const { links } = usePage().props;

    const destroyLink = (link) => {
        if (!window.confirm(`Deseja apagar o link "${link.name}"?`)) return;
        router.delete(route("links.destroy", link.id));
    };

    return (
        <AppLayout title="Gerenciar links">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Gerenciar links</h1>

                    <Link
                        href={route("links.create")}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
                    >
                        Adicionar link
                    </Link>
                </div>

                {links.length === 0 ? (
                    <div className="text-sm text-gray-500">
                        Nenhum link cadastrado.
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
                                        Tipo
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        URL
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Ações
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {links.map((link) => (
                                    <tr key={link.id}>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            <div className="font-medium">{link.name}</div>
                                            {link.description && (
                                                <div className="mt-1 text-xs text-gray-500">
                                                    {link.description}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {link.type?.name ?? "-"}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline"
                                            >
                                                Abrir link
                                            </a>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route("links.edit", link.id)}
                                                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                                >
                                                    Editar
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => destroyLink(link)}
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
