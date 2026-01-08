import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";

export default function Show({ article, categories, tagsList }) {
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm({
        title: article.title ?? "",
        excerpt: article.excerpt ?? "",
        content: article.content ?? "",
        category_id: article.category_id ?? "",
        tag_ids: (article.tags ?? []).map((t) => t.id),
    });

    const onTagsChange = (e) => {
        const selected = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
        form.setData("tag_ids", selected);
    };

    const publishedLabel = useMemo(() => {
        // regra temporária: se está published, usamos updated_at como "Publicado em"
        // (no CHAT 11 podemos trocar por published_at real)
        const iso = article.status === "published" ? article.updated_at : article.created_at;
        if (!iso) return "—";
        try {
            return new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
            }).format(new Date(iso));
        } catch {
            return "—";
        }
    }, [article]);

    const updatedLabel = useMemo(() => {
        if (!article.updated_at) return "—";
        try {
            return new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
            }).format(new Date(article.updated_at));
        } catch {
            return "—";
        }
    }, [article]);

    const submit = (e) => {
        e.preventDefault();

        form.put(route("articles.update", article.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    return (
        <AppLayout title={article?.title ?? "Artigo"}>
            <Head title={article?.title ?? "Artigo"} />

            <div className="flex items-center justify-between gap-4">
                <Link href={route("articles.index")} className="text-sm underline">
                    Voltar
                </Link>

                <button
                    type="button"
                    className="rounded border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                    onClick={() => setIsEditing((v) => !v)}
                >
                    {isEditing ? "Cancelar" : "Editar"}
                </button>
            </div>

            <div className="mt-4">
                <h2 className="text-2xl font-semibold">{article.title}</h2>

                <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                    <div>
                        <span className="font-medium">Categoria:</span> {article.category?.name ?? "—"}
                    </div>

                    <div>
                        <span className="font-medium">Tags:</span>{" "}
                        {(article.tags ?? []).length ? article.tags.map((t) => t.name).join(", ") : "—"}
                    </div>

                    <div>
                        <span className="font-medium">Publicado em:</span> {publishedLabel}
                    </div>

                    <div>
                        <span className="font-medium">Atualizado em:</span> {updatedLabel}
                    </div>
                </div>

                {isEditing ? (
                    <form onSubmit={submit} className="mt-6 space-y-4">
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
                                {tagsList.map((t) => (
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
                                rows={10}
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
                            Salvar
                        </button>
                    </form>
                ) : (
                    <div className="mt-6 whitespace-pre-wrap text-sm leading-6">{article.content}</div>
                )}
            </div>
        </AppLayout>
    );
}
