import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { useMemo, useState } from "react";

export default function Index({ users, roles }) {
    const { flash } = usePage().props;
    const generated = flash?.generated_password;

    const [copied, setCopied] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        role: roles?.[0] ?? "n1",
        can_review_articles: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("users.store"), {
            onSuccess: () => reset(),
        });
    };

    const canCopy = useMemo(() => !!generated?.password, [generated]);

    const copy = async () => {
        if (!canCopy) return;
        await navigator.clipboard.writeText(generated.password);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    const hasReview = (u) => {
        const perms = u.permissions ?? [];
        return Array.isArray(perms) && perms.includes("review-articles");
    };

    return (
        <AppLayout title="Usuários">
            <Head title="Usuários" />

            <div className="py-8">
                <div className="mx-auto max-w-6xl space-y-6 sm:px-6 lg:px-8">
                    {generated && (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="font-medium">Senha gerada (exibida uma única vez)</div>
                                    <div className="mt-2 text-sm">
                                        <div>
                                            <span className="font-medium">E-mail:</span> {generated.email}
                                        </div>
                                        <div className="mt-1">
                                            <span className="font-medium">Senha:</span>{" "}
                                            <span className="font-mono">{generated.password}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={copy}
                                    className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                                    disabled={!canCopy}
                                >
                                    {copied ? "Copiado" : "Copiar senha"}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="rounded-lg border bg-white p-5">
                        <div className="mb-4 text-lg font-medium">Criar usuário</div>

                        <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="text-sm font-medium">Nome</label>
                                <input
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    className="mt-1 w-full rounded-md border px-3 py-2"
                                />
                                {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                            </div>

                            <div>
                                <label className="text-sm font-medium">E-mail</label>
                                <input
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    className="mt-1 w-full rounded-md border px-3 py-2"
                                />
                                {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                            </div>

                            <div>
                                <label className="text-sm font-medium">Role</label>
                                <select
                                    value={data.role}
                                    onChange={(e) => setData("role", e.target.value)}
                                    className="mt-1 w-full rounded-md border px-3 py-2"
                                >
                                    {roles.map((r) => (
                                        <option key={r} value={r}>
                                            {r}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && <div className="mt-1 text-sm text-red-600">{errors.role}</div>}
                            </div>

                            <div className="md:col-span-3">
                                <label className="inline-flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={data.can_review_articles}
                                        onChange={(e) => setData("can_review_articles", e.target.checked)}
                                        className="rounded border"
                                    />
                                    <span className="font-medium">Pode revisar artigos</span>
                                    <span className="text-gray-500">(aprovar / rejeitar)</span>
                                </label>
                                {errors.can_review_articles && (
                                    <div className="mt-1 text-sm text-red-600">{errors.can_review_articles}</div>
                                )}
                            </div>

                            <div className="md:col-span-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                                >
                                    {processing ? "Criando..." : "Criar"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="rounded-lg border bg-white">
                        <div className="border-b px-5 py-4 text-lg font-medium">Lista</div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-5 py-3">Nome</th>
                                        <th className="px-5 py-3">E-mail</th>
                                        <th className="px-5 py-3">Role</th>
                                        <th className="px-5 py-3">Review</th>
                                        <th className="px-5 py-3">Trocar senha</th>
                                        <th className="px-5 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((u) => (
                                        <tr key={u.id} className="border-t">
                                            <td className="px-5 py-3">{u.name}</td>
                                            <td className="px-5 py-3">{u.email}</td>
                                            <td className="px-5 py-3">{u.role}</td>
                                            <td className="px-5 py-3">
                                                {hasReview(u) ? (
                                                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
                                                        reviewer
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-500">-</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3">{u.must_change_password ? "sim" : "não"}</td>
                                            <td className="px-5 py-3 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        href={route("users.edit", u.id)}
                                                        className="text-slate-700 hover:text-slate-900"
                                                    >
                                                        Editar
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {users.data.length === 0 && (
                                        <tr>
                                            <td className="px-5 py-6 text-slate-500" colSpan={6}>
                                                Nenhum usuário encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between px-5 py-4">
                            <div className="text-sm text-slate-600">
                                Página {users.current_page} de {users.last_page}
                            </div>

                            <div className="flex gap-2">
                                {users.links
                                    .filter((l) => l.url)
                                    .map((l, idx) => (
                                        <Link
                                            key={idx}
                                            href={l.url}
                                            className={`rounded-md border px-3 py-1 text-sm ${l.active ? "bg-slate-900 text-white" : "bg-white text-slate-700"
                                                }`}
                                            preserveScroll
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: l.label }} />
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
