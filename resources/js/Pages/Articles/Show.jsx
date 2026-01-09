import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";
import TinyRichTextEditor from "@/Components/TinyRichTextEditor";

export default function Show({ article, categories, tagsList, comments = [] }) {
    const [isEditing, setIsEditing] = useState(false);

    const [likedByMe, setLikedByMe] = useState(Boolean(article.liked_by_me));
    const [likesCount, setLikesCount] = useState(Number(article.likes_count ?? 0));
    const [likeBusy, setLikeBusy] = useState(false);

    const form = useForm({
        title: article.title ?? "",
        excerpt: article.excerpt ?? "",
        content: article.content ?? "",
        category_id: article.category_id ?? "",
        tag_ids: (article.tags ?? []).map((t) => t.id),
    });

    const commentForm = useForm({
        body: "",
    });

    const onTagsChange = (e) => {
        const selected = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
        form.setData("tag_ids", selected);
    };

    const publishedLabel = useMemo(() => {
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

    const formatCommentDate = (iso) => {
        if (!iso) return "—";
        try {
            return new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
            }).format(new Date(iso));
        } catch {
            return "—";
        }
    };

    const submit = (e) => {
        e.preventDefault();

        form.put(route("articles.update", article.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const toggleLike = () => {
        if (likeBusy) return;

        const nextLiked = !likedByMe;
        setLikedByMe(nextLiked);
        setLikesCount((prev) => {
            const n = Number(prev) || 0;
            return Math.max(0, n + (nextLiked ? 1 : -1));
        });

        setLikeBusy(true);

        const onError = () => {
            setLikedByMe((v) => !v);
            setLikesCount((prev) => {
                const n = Number(prev) || 0;
                return Math.max(0, n + (nextLiked ? -1 : 1));
            });
        };

        const onFinish = () => setLikeBusy(false);

        if (nextLiked) {
            router.post(route("articles.like", article.id), {}, { preserveScroll: true, onError, onFinish });
            return;
        }

        router.delete(route("articles.unlike", article.id), { preserveScroll: true, onError, onFinish });
    };

    const submitComment = (e) => {
        e.preventDefault();

        commentForm.post(route("articles.comments.store", article.id), {
            preserveScroll: true,
            onSuccess: () => {
                commentForm.reset("body");
                router.reload({ only: ["comments"], preserveScroll: true });
            },
        });
    };

    const destroyComment = (id) => {
        if (!confirm("Excluir este comentário?")) return;

        router.delete(route("comments.destroy", id), {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["comments"], preserveScroll: true });
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

                <div>
                    <span className="font-medium">Autor:</span> {article.author?.name ?? "—"}
                </div>

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
                            <div className="mt-1">
                                <TinyRichTextEditor
                                    articleId={article.id}
                                    value={form.data.content}
                                    onChange={(html) => form.setData("content", html)}
                                />
                            </div>
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
                    <>
                        <div
                            className="mt-6 text-sm leading-6
                                [&_p]:my-3
                                [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6
                                [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6
                                [&_li]:my-1
                                [&_a]:underline
                                [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5
                                [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-gray-900 [&_pre]:p-3 [&_pre]:text-gray-100
                                [&_h1]:my-4 [&_h1]:text-2xl [&_h1]:font-semibold
                                [&_h2]:my-4 [&_h2]:text-xl [&_h2]:font-semibold
                                [&_h3]:my-3 [&_h3]:text-lg [&_h3]:font-semibold"
                            dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
                        />

                        <div className="mt-8 rounded-lg border bg-white">
                            <div className="flex items-center justify-between border-b px-4 py-3">
                                <div className="text-sm font-semibold">Interações</div>
                                <div className="text-xs text-gray-500">Curtidas e comentários</div>
                            </div>

                            <div className="px-4 py-4 space-y-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <i className={likedByMe ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
                                        <span className="font-medium">{likesCount}</span>
                                        <span className="text-gray-500">curtida{likesCount === 1 ? "" : "s"}</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={toggleLike}
                                        disabled={likeBusy}
                                        className={`inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-medium border hover:bg-gray-50 disabled:opacity-50 ${likedByMe ? "border-emerald-200 bg-emerald-50" : ""
                                            }`}
                                    >
                                        <i className={likedByMe ? "fa-solid fa-thumbs-up" : "fa-regular fa-thumbs-up"} />
                                        {likedByMe ? "Curtido" : "Curtir"}
                                    </button>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        <i className="fa-regular fa-comment" />
                                        Comentários
                                        <span className="text-xs font-normal text-gray-500">({(comments ?? []).length})</span>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        {(comments ?? []).map((c) => (
                                            <div key={c.id} className="rounded border px-3 py-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-sm font-semibold">{c.user?.name ?? "—"}</div>
                                                            <div className="text-xs text-gray-500">{formatCommentDate(c.created_at)}</div>
                                                        </div>
                                                        <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{c.body}</div>
                                                    </div>

                                                    {c.can_delete ? (
                                                        <button
                                                            type="button"
                                                            className="text-xs text-red-700 underline"
                                                            onClick={() => destroyComment(c.id)}
                                                        >
                                                            Excluir
                                                        </button>
                                                    ) : null}
                                                </div>
                                            </div>
                                        ))}

                                        {!(comments ?? []).length ? (
                                            <div className="text-sm text-gray-500">Nenhum comentário ainda.</div>
                                        ) : null}
                                    </div>

                                    <form onSubmit={submitComment} className="mt-3 space-y-2">
                                        <textarea
                                            className="block w-full rounded border-gray-300"
                                            rows={3}
                                            placeholder="Escreva um comentário..."
                                            value={commentForm.data.body}
                                            onChange={(e) => commentForm.setData("body", e.target.value)}
                                            disabled={commentForm.processing}
                                        />
                                        {commentForm.errors.body ? (
                                            <div className="text-sm text-red-600">{commentForm.errors.body}</div>
                                        ) : null}

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                                disabled={commentForm.processing || !commentForm.data.body.trim()}
                                            >
                                                Comentar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
