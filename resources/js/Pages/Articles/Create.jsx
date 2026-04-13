import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import QuillEditor from "@/Components/QuillEditor";
import Select from "react-select";

export default function Create({ categories, tags }) {
    const form = useForm({
        title: "",
        excerpt: "",
        content: "",
        category_id: "",
        tag_ids: [],
    });

    const categoryOptions = categories.map((c) => ({
        value: c.id,
        label: c.name,
    }));

    const tagOptions = tags.map((t) => ({
        value: t.id,
        label: t.name,
    }));

    const selectedCategory =
        categoryOptions.find((option) => option.value === form.data.category_id) ?? null;

    const selectedTags = tagOptions.filter((option) =>
        form.data.tag_ids.includes(option.value)
    );

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
                    <p className="text-sm text-gray-500">
                        Preencha os campos e clique em criar.
                    </p>
                </div>

                <Link href={route("articles.index")} className="text-sm underline">
                    Voltar
                </Link>
            </div>

            <form onSubmit={submit} className="mt-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium">Título</label>
                    <input
                        className="mt-1 block w-full rounded border-gray-300"
                        value={form.data.title}
                        onChange={(e) => form.setData("title", e.target.value)}
                    />
                    {form.errors.title ? (
                        <div className="mt-1 text-sm text-red-600">{form.errors.title}</div>
                    ) : null}
                </div>

                <div>
                    <label className="block text-sm font-medium">Categoria</label>
                    <div className="mt-1">
                        <Select
                            options={categoryOptions}
                            value={selectedCategory}
                            onChange={(option) =>
                                form.setData("category_id", option ? option.value : "")
                            }
                            isClearable
                            placeholder="Selecione a categoria"
                            noOptionsMessage={() => "Nenhuma categoria encontrada"}
                        />
                    </div>
                    {form.errors.category_id ? (
                        <div className="mt-1 text-sm text-red-600">
                            {form.errors.category_id}
                        </div>
                    ) : null}
                </div>

                <div>
                    <label className="block text-sm font-medium">Tags (opcional)</label>
                    <div className="mt-1">
                        <Select
                            options={tagOptions}
                            value={selectedTags}
                            onChange={(options) =>
                                form.setData(
                                    "tag_ids",
                                    options ? options.map((option) => option.value) : []
                                )
                            }
                            isMulti
                            closeMenuOnSelect={false}
                            placeholder="Busque e selecione as tags"
                            noOptionsMessage={() => "Nenhuma tag encontrada"}
                        />
                    </div>
                    {form.errors.tag_ids ? (
                        <div className="mt-1 text-sm text-red-600">{form.errors.tag_ids}</div>
                    ) : null}
                </div>

                <div>
                    <label className="block text-sm font-medium">Resumo (opcional)</label>
                    <input
                        className="mt-1 block w-full rounded border-gray-300"
                        value={form.data.excerpt}
                        onChange={(e) => form.setData("excerpt", e.target.value)}
                    />
                    {form.errors.excerpt ? (
                        <div className="mt-1 text-sm text-red-600">{form.errors.excerpt}</div>
                    ) : null}
                </div>

                <div>
                    <label className="block text-sm font-medium">Conteúdo</label>
                    <div className="mt-1">
                        <QuillEditor
                            articleId={null}
                            value={form.data.content}
                            onChange={(html) => form.setData("content", html)}
                        />
                    </div>
                    {form.errors.content ? (
                        <div className="mt-1 text-sm text-red-600">{form.errors.content}</div>
                    ) : null}
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
