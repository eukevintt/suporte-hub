import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";

export default function Index({ auth, categories }) {
    const createForm = useForm({ name: "" });
    const editForm = useForm({ name: "" });
    const [editingId, setEditingId] = useState(null);

    const editingCategory = useMemo(() => {
        if (!editingId) return null;
        return (categories ?? []).find((c) => c.id === editingId) ?? null;
    }, [editingId, categories]);

    const startEdit = (id) => {
        const c = (categories ?? []).find((x) => x.id === id);
        if (!c) return;
        setEditingId(id);
        editForm.setData({ name: c.name ?? "" });
        editForm.clearErrors();
    };

    const cancelEdit = () => {
        setEditingId(null);
        editForm.reset("name");
        editForm.clearErrors();
    };


    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route("categories.store"), {
            preserveScroll: true,
            onSuccess: () => createForm.reset("name"),
        });
    };

    const submitUpdate = (e, id) => {
        e.preventDefault();
        editForm.put(route("categories.update", id), {
            preserveScroll: true,
            onSuccess: () => cancelEdit(),
        });
    };


    const destroy = (id) => {
        if (!confirm("Excluir categoria?")) return;
        createForm.delete(route("categories.destroy", id), { preserveScroll: true });
    };

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight">Categorias</h2>}
        >
            <Head title="Categorias" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">Nova categoria</h3>

                        <form onSubmit={submitCreate} className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <input
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData("name", e.target.value)}
                                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                    placeholder="Nome da categoria"
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
                                    {(categories ?? []).map((c) => {
                                        const isEditing = editingId === c.id;

                                        return (
                                            <tr key={c.id} className="border-b border-gray-100 dark:border-gray-700/60">
                                                <td className="py-3 pr-4">
                                                    {!isEditing ? (
                                                        <span className="text-gray-900 dark:text-gray-100">{c.name}</span>
                                                    ) : (
                                                        <form onSubmit={(e) => submitUpdate(e, c.id)} className="flex gap-2">
                                                            <div className="flex-1">
                                                                <input
                                                                    value={editForm.data.name}
                                                                    onChange={(e) => editForm.setData("name", e.target.value)}
                                                                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                                                />
                                                                {editForm.errors.name && (
                                                                    <div className="mt-2 text-sm text-red-500">{editForm.errors.name}</div>
                                                                )}
                                                            </div>

                                                            <button
                                                                type="submit"
                                                                disabled={editForm.processing}
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

                                                <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{c.slug}</td>

                                                <td className="py-3">
                                                    {!isEditing ? (
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => startEdit(c.id)}
                                                                className="rounded-md bg-gray-200 px-3 py-2 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => destroy(c.id)}
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

                                    {(!categories || categories.length === 0) && (
                                        <tr>
                                            <td colSpan="3" className="py-6 text-gray-600 dark:text-gray-300">
                                                Nenhuma categoria cadastrada.
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
