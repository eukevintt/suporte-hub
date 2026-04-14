import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { props } = usePage();
    const logoUrl = props?.brand?.logo_url ?? null;
    const appName = props?.brand?.app_name ?? "SuporteHub";

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Head title="Entrar" />

            <div className="w-full max-w-md rounded-lg border bg-white p-6 space-y-5">
                <div className="flex justify-center">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={appName}
                            className="h-10 object-contain"
                        />
                    ) : (
                        <div className="text-lg font-semibold">{appName}</div>
                    )}
                </div>
                <div className="text-center">
                    <h2 className="text-lg font-semibold">Acessar sistema</h2>
                    <p className="text-sm text-gray-500">
                        Entre com suas credenciais para continuar
                    </p>
                </div>

                {status && (
                    <div className="rounded-md border border-green-200 bg-green-100 px-4 py-2 text-sm text-green-700">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            E-mail
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                            autoFocus
                        />
                        {errors.email && (
                            <div className="mt-1 text-sm text-red-600">
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Senha
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                        />
                        {errors.password && (
                            <div className="mt-1 text-sm text-red-600">
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-600">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            Lembrar de mim
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-gray-600 hover:text-gray-900 hover:underline"
                            >
                                Esqueceu a senha?
                            </Link>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
