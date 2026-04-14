import { useForm, usePage } from '@inertiajs/react';

export default function ForcePasswordChange() {
    const { props } = usePage();
    const logoUrl = props?.brand?.logo_url ?? null;
    const appName = props?.brand?.app_name ?? "SuporteHub";

    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/force-password-change');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-lg border bg-white p-6 space-y-5">

                {/* Logo */}
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

                {/* Título */}
                <div className="text-center">
                    <h2 className="text-lg font-semibold">Definir nova senha</h2>
                    <p className="text-sm text-gray-500">
                        Por segurança, você precisa atualizar sua senha.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">

                    <div>
                        <input
                            type="password"
                            placeholder="Nova senha"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                        />
                        {errors.password && (
                            <div className="mt-1 text-sm text-red-600">
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Confirmar senha"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                        />
                        {errors.password_confirmation && (
                            <div className="mt-1 text-sm text-red-600">
                                {errors.password_confirmation}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                    >
                        Salvar nova senha
                    </button>
                </form>
            </div>
        </div>
    );
}
