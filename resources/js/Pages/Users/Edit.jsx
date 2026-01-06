import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ user, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
        role: user.role ?? roles?.[0] ?? 'n1',
        must_change_password: !!user.must_change_password,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <>
            <Head title="Editar usuário" />

            <div className="mx-auto max-w-3xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Editar usuário</h1>
                    <Link href={route('users.index')} className="text-sm text-slate-700 hover:text-slate-900">
                        Voltar
                    </Link>
                </div>

                <div className="rounded-lg border bg-white p-5">
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Nome</label>
                            <input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 w-full rounded-md border px-3 py-2"
                            />
                            {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                        </div>

                        <div>
                            <label className="text-sm font-medium">E-mail</label>
                            <input
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 w-full rounded-md border px-3 py-2"
                            />
                            {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="text-sm font-medium">Role</label>
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="mt-1 w-full rounded-md border px-3 py-2"
                            >
                                {roles.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                            {errors.role && <div className="mt-1 text-sm text-red-600">{errors.role}</div>}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="must_change_password"
                                type="checkbox"
                                checked={data.must_change_password}
                                onChange={(e) => setData('must_change_password', e.target.checked)}
                                className="h-4 w-4 rounded border"
                            />
                            <label htmlFor="must_change_password" className="text-sm">
                                Deve trocar a senha no próximo login
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                        >
                            {processing ? 'Salvando...' : 'Salvar'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
