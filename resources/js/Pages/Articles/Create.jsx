import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Create({ categories, tags }) {
    const form = useForm({
        title: "",
        excerpt: "",
        content: "",
        category_id: "",
        tag_ids: [],
    });

    const onTagsChange = (e) => {
        const selected = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
        form.setData("tag_ids", selected);
    };

    const submit = (e) => {
        e.preventDefault();

        form.post(route("articles.store"), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title="Novo artigo">
            <Head title="Novo artigo" />

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">Criar artigo</h2>
                    <p className="text-sm text-gray-500">Preencha os campos e clique em criar.</p>
                </div>

                <Link href={route("articles.index")} className="text-sm underline">
                    Voltar
                </Link>
            </div>

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
                    {form.errors.category_id ? <div className="mt-1 text-sm text-red-600">{form.errors.category_id}</div> : null}
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
                    Criar
                </button>
            </form>
        </AppLayout>
    );
}
