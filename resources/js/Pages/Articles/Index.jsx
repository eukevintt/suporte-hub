import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";

export default function Index({ articles, categories, tags }) {
    const [editingId, setEditingId] = useState(null);

    // Chat 07 (Passo 2): filtro por status via query string (?status=draft|published)
    const { url } = usePage();
    const params = new URLSearchParams(url.split("?")[1]);
    const currentStatus = params.get("status") ?? "";

    const editingArticle = useMemo(() => {
        if (!editingId) return null;
        return articles.find((a) => a.id === editingId) ?? null;
    }, [editingId, articles]);

    const form = useForm({
        title: "",
        excerpt: "",
        content: "",
        category_id: "",
        tag_ids: [],
    });

    const reset = () => {
        setEditingId(null);
        form.setData({
            title: "",
            excerpt: "",
            content: "",
            category_id: "",
            tag_ids: [],
        });
        form.clearErrors();
    };

    const startEdit = (a) => {
        setEditingId(a.id);
        form.setData({
            title: a.title ?? "",
            excerpt: a.excerpt ?? "",
            content: a.content ?? "",
            category_id: a.category_id ?? "",
            tag_ids: (a.tags ?? []).map((t) => t.id),
        });
        form.clearErrors();
    };

    const onTagsChange = (e) => {
        const selected = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
        form.setData("tag_ids", selected);
    };

    const submit = (e) => {
        e.preventDefault();

        if (editingId) {
            form.put(route("articles.update", editingId), {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
            return;
        }

        form.post(route("articles.store"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const destroy = (id) => {
        if (!confirm("Excluir este artigo?")) return;
        form.delete(route("articles.destroy", id), { preserveScroll: true });
    };

    // Chat 06: alternar status draft <-> published
    const toggleStatus = (article) => {
        const isDraft = article.status === "draft";
        const routeName = isDraft ? "articles.publish" : "articles.unpublish";

        router.put(route(routeName, article.id), {}, { preserveScroll: true });
    };

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Articles</h2>}>
            <Head title="Articles" />

            <div className="py-6">
                <div className="mx-auto max-w-6xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{editingId ? "Editar artigo" : "Novo artigo"}</h3>
                            {editingId ? (
                                <button type="button" className="text-sm underline" onClick={reset}>
                                    Cancelar
                                </button>
                            ) : null}
                        </div>

                        {editingArticle ? (
                            <div className="mt-2 text-xs text-gray-500">
                                Slug: <span className="font-medium">{editingArticle.slug}</span> • Status:{" "}
                                <span className="font-medium">{editingArticle.status}</span>
                            </div>
                        ) : (
                            <div className="mt-2 text-xs text-gray-500">Status inicial: draft • Slug é gerado automaticamente</div>
                        )}

                        <form onSubmit={submit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Title</label>
                                <input
                                    className="mt-1 block w-full rounded border-gray-300"
                                    value={form.data.title}
                                    onChange={(e) => form.setData("title", e.target.value)}
                                />
                                {form.errors.title ? <div className="mt-1 text-sm text-red-600">{form.errors.title}</div> : null}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Category</label>
                                <select
                                    className="mt-1 block w-full rounded border-gray-300"
                                    value={form.data.category_id}
                                    onChange={(e) => form.setData("category_id", e.target.value ? Number(e.target.value) : "")}
                                >
                                    <option value="">Selecione</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.category_id ? (
                                    <div className="mt-1 text-sm text-red-600">{form.errors.category_id}</div>
                                ) : null}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Tags (opcional)</label>
                                <select
                                    multiple
                                    className="mt-1 block w-full rounded border-gray-300"
                                    value={form.data.tag_ids.map(String)}
                                    onChange={onTagsChange}
                                >
                                    {tags.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.tag_ids ? <div className="mt-1 text-sm text-red-600">{form.errors.tag_ids}</div> : null}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Excerpt (opcional)</label>
                                <input
                                    className="mt-1 block w-full rounded border-gray-300"
                                    value={form.data.excerpt}
                                    onChange={(e) => form.setData("excerpt", e.target.value)}
                                />
                                {form.errors.excerpt ? <div className="mt-1 text-sm text-red-600">{form.errors.excerpt}</div> : null}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Content</label>
                                <textarea
                                    className="mt-1 block w-full rounded border-gray-300"
                                    rows={8}
                                    value={form.data.content}
                                    onChange={(e) => form.setData("content", e.target.value)}
                                />
                                {form.errors.content ? <div className="mt-1 text-sm text-red-600">{form.errors.content}</div> : null}
                            </div>

                            <button
                                type="submit"
                                className="rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                disabled={form.processing}
                            >
                                {editingId ? "Salvar" : "Criar"}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Listagem</h3>

                            <div>
                                <select
                                    className="border rounded px-3 py-2 text-sm"
                                    value={currentStatus}
                                    onChange={(e) => {
                                        const status = e.target.value;

                                        router.get(route("articles.index"), status ? { status } : {}, {
                                            preserveScroll: true,
                                        });
                                    }}
                                >
                                    <option value="">Todos</option>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b">
                                    <tr>
                                        <th className="py-2">Title</th>
                                        <th className="py-2">Category</th>
                                        <th className="py-2">Tags</th>
                                        <th className="py-2">Status</th>
                                        <th className="py-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {articles.map((a) => (
                                        <tr key={a.id} className="border-b">
                                            <td className="py-2">
                                                <div className="font-medium">{a.title}</div>
                                                <div className="text-xs text-gray-500">{a.slug}</div>
                                            </td>
                                            <td className="py-2">{a.category?.name ?? "-"}</td>
                                            <td className="py-2">{(a.tags ?? []).length ? a.tags.map((t) => t.name).join(", ") : "-"}</td>

                                            <td className="py-2">
                                                <span className="inline-flex items-center rounded px-2 py-1 text-xs font-medium border">
                                                    {a.status}
                                                </span>
                                            </td>

                                            <td className="py-2 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        type="button"
                                                        className="rounded border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                                                        onClick={() => toggleStatus(a)}
                                                    >
                                                        {a.status === "draft" ? "Publicar" : "Voltar para draft"}
                                                    </button>

                                                    <button type="button" className="text-sm underline" onClick={() => startEdit(a)}>
                                                        Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="text-sm text-red-700 underline"
                                                        onClick={() => destroy(a.id)}
                                                    >
                                                        Excluir
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {!articles.length ? (
                                        <tr>
                                            <td colSpan="5" className="py-4 text-center text-gray-600">
                                                Nenhum artigo criado ainda.
                                            </td>
                                        </tr>
                                    ) : null}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
