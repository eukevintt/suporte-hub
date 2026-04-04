import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";

export default function Index({ auth, tags }) {

    const createForm = useForm({ name: "" });
    const editForm = useForm({ name: "" });
    const [editingId, setEditingId] = useState(null);

    const editingTags = useMemo(() => {
        if (!editingId) return null;
        return (tags ?? []).find((t) => t.id === editingId) ?? null;
    }, [editingId, tags]);

    const startEdit = (id) => {
        const c = (tags ?? []).find((x) => x.id === id);
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
        createForm.post(route("tags.store"), {
            preserveScroll: true,
            onSuccess: () => createForm.reset("name"),
        });
    };

    const submitUpdate = (e, id) => {
        e.preventDefault();
        editForm.put(route("tags.update", id), {
            preserveScroll: true,
            onSuccess: () => cancelEdit(),
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

            <div>
                <h2 className="text-lg font-semibold">Tags</h2>
                <p className="text-sm text-gray-500">Gerencie suas tags aqui.</p>
            </div>

            <div className="py-6">
                <div className="max-w-7xl space-y-6">

                    {/* Nova Tag */}
                    <div className="rounded-lg border border-gray-200 bg-white-50 p-4">
                        <h3 className="text-lg font-medium mb-4">Nova tag</h3>

                        <form onSubmit={submitCreate} className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <input
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData("name", e.target.value)}
                                    className="mt-1 w-full rounded-md border px-3 py-2"
                                    placeholder="Nome da tag"
                                />
                                {createForm.errors.name && (
                                    <div className="mt-2 text-sm text-red-500">{createForm.errors.name}</div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                            >
                                Criar
                            </button>
                        </form>
                    </div>

                    {/* Lista */}
                    <div className="rounded-lg border border-gray-200 bg-white-50 p-4">
                        <h3 className="text-lg font-medium mb-4">Lista</h3>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left border-b border-gray-400 text-gray-600">
                                        <th className="py-3 pr-4">Nome</th>
                                        <th className="py-3 pr-4">Slug</th>
                                        <th className="py-3 w-56">Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {(tags ?? []).map((t) => {
                                        const isEditing = editingId === t.id;

                                        return (
                                            <tr key={t.id} className="border-b border-gray-400">
                                                <td className="py-3 pr-4">
                                                    {!isEditing ? (
                                                        <span className="text-gray-500">{t.name}</span>
                                                    ) : (
                                                        <form onSubmit={(e) => submitUpdate(e, t.id)} className="flex gap-2">
                                                            <div className="flex-1">
                                                                <input
                                                                    value={editForm.data.name}
                                                                    onChange={(e) => editForm.setData("name", e.target.value)}
                                                                    className="w-full rounded-md border-gray-300 text-gray-500"
                                                                />
                                                                {editForm.errors.name && (
                                                                    <div className="mt-2 text-sm text-red-500">{editForm.errors.name}</div>
                                                                )}
                                                            </div>

                                                            <button
                                                                type="submit"
                                                                disabled={editForm.processing}
                                                                className="rounded bg-green-600 px-2 text-white hover:bg-green-800"
                                                            >
                                                                Salvar
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={cancelEdit}
                                                                className="rounded px-1 bg-slate-200 text-slate-700 hover:bg-slate-300"
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </form>
                                                    )}
                                                </td>

                                                <td className="py-3 pr-4 text-gray-500">{t.slug}</td>

                                                <td className="py-3">
                                                    {!isEditing ? (
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => startEdit(t.id)}
                                                                className="text-slate-700 hover:text-slate-900"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => destroy(t.id)}
                                                                className="text-red-600 hover:text-red-800"
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
                                            <td colSpan="3" className="py-6 text-gray-600">
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
