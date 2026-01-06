import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";

export default function Index({ auth, tags }) {
    const createForm = useForm({ name: "" });
    const [editingId, setEditingId] = useState(null);

    const editForms = useMemo(() => {
        const map = new Map();
        (tags ?? []).forEach((t) => {
            map.set(t.id, useForm({ name: t.name }));
        });
        return map;
    }, [tags]);

    const startEdit = (id) => setEditingId(id);
    const cancelEdit = () => setEditingId(null);

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route("tags.store"), {
            preserveScroll: true,
            onSuccess: () => createForm.reset("name"),
        });
    };

    const submitUpdate = (e, id) => {
        e.preventDefault();
        const form = editForms.get(id);
        form.put(route("tags.update", id), {
            preserveScroll: true,
            onSuccess: () => setEditingId(null),
        });
    };

    const destroy = (id) => {
        if (!confirm("Excluir tag?")) return;
        createForm.delete(route("tags.destroy", id), { preserveScroll: true });
    };

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight">Tags</h2>}
        >
            <Head title="Tags" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">Nova tag</h3>

                        <form onSubmit={submitCreate} className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <input
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData("name", e.target.value)}
                                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                    placeholder="Nome da tag"
                                />
                                {createForm.errors.name && (
                                    <div className="mt-2 text-sm text-red-500">{createForm.errors.name}</div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
                            >
                                Criar
                            </button>
                        </form>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">Lista</h3>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                                        <th className="py-3 pr-4">Nome</th>
                                        <th className="py-3 pr-4">Slug</th>
                                        <th className="py-3 w-56">Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {(tags ?? []).map((t) => {
                                        const form = editForms.get(t.id);
                                        const isEditing = editingId === t.id;

                                        return (
                                            <tr key={t.id} className="border-b border-gray-100 dark:border-gray-700/60">
                                                <td className="py-3 pr-4">
                                                    {!isEditing ? (
                                                        <span className="text-gray-900 dark:text-gray-100">{t.name}</span>
                                                    ) : (
                                                        <form onSubmit={(e) => submitUpdate(e, t.id)} className="flex gap-2">
                                                            <div className="flex-1">
                                                                <input
                                                                    value={form.data.name}
                                                                    onChange={(e) => form.setData("name", e.target.value)}
                                                                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                                                />
                                                                {form.errors.name && (
                                                                    <div className="mt-2 text-sm text-red-500">{form.errors.name}</div>
                                                                )}
                                                            </div>

                                                            <button
                                                                type="submit"
                                                                disabled={form.processing}
                                                                className="rounded-md bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700 disabled:opacity-60"
                                                            >
                                                                Salvar
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={cancelEdit}
                                                                className="rounded-md bg-gray-200 px-3 py-2 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </form>
                                                    )}
                                                </td>

                                                <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{t.slug}</td>

                                                <td className="py-3">
                                                    {!isEditing ? (
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => startEdit(t.id)}
                                                                className="rounded-md bg-gray-200 px-3 py-2 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => destroy(t.id)}
                                                                className="rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                                                            >
                                                                Excluir
                                                            </button>
                                                        </div>
                                                    ) : null}
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {(!tags || tags.length === 0) && (
                                        <tr>
                                            <td colSpan="3" className="py-6 text-gray-600 dark:text-gray-300">
                                                Nenhuma tag cadastrada.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
