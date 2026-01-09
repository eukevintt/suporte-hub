import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ user, roles }) {
    const hasReview = Array.isArray(user?.permissions) && user.permissions.includes("review-articles");

    const { data, setData, put, processing, errors } = useForm({
        name: user.name ?? "",
        email: user.email ?? "",
        role: user.role ?? (roles?.[0] ?? "n1"),
        must_change_password: !!user.must_change_password,
        can_review_articles: hasReview,

        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("users.update", user.id), { preserveScroll: true });
    };

    return (
        <AppLayout title="Editar usuário">
            <Head title="Editar usuário" />

            <div className="mx-auto max-w-3xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Editar usuário</h1>
                    <Link href={route("users.index")} className="text-sm text-slate-700 hover:text-slate-900">
                        Voltar
                    </Link>
                </div>

                <div className="rounded-lg border bg-white p-6">
                    <form onSubmit={submit} className="space-y-4">
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

                        <div>
                            <label className="inline-flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={data.must_change_password}
                                    onChange={(e) => setData("must_change_password", e.target.checked)}
                                    className="rounded border"
                                />
                                <span>Deve trocar a senha no próximo login</span>
                            </label>
                            {errors.must_change_password && (
                                <div className="mt-1 text-sm text-red-600">{errors.must_change_password}</div>
                            )}
                        </div>

                        <div>
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

                        <div className="pt-2 border-t">
                            <div className="text-sm font-medium">Trocar senha</div>
                            <div className="text-xs text-gray-500">Preencha apenas se quiser definir uma nova senha.</div>

                            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium">Nova senha</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        className="mt-1 w-full rounded-md border px-3 py-2"
                                        autoComplete="new-password"
                                    />
                                    {errors.password && <div className="mt-1 text-sm text-red-600">{errors.password}</div>}
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Confirmar senha</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData("password_confirmation", e.target.value)}
                                        className="mt-1 w-full rounded-md border px-3 py-2"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                            >
                                {processing ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
