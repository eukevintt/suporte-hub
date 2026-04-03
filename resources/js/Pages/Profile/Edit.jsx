import AppLayout from "@/Layouts/AppLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit({ mustVerifyEmail, status, auth }) {
    const user = auth?.user;

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "U";

    return (
        <AppLayout title="Perfil">
            <div className="mx-auto max-w-4xl space-y-6">
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <UpdatePasswordForm className="max-w-xl" />
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Foto
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Estrutura preparada para futura alteração de foto de perfil.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 text-xl font-semibold text-white">
                            {initials}
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                                {user?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                {user?.email}
                            </p>

                            <div className="mt-4">
                                <button
                                    type="button"
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                >
                                    Alterar foto
                                </button>
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                Upload ainda não disponível nesta etapa.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-red-600">
                            Zona de perigo
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Ações irreversíveis relacionadas à sua conta.
                        </p>
                    </div>

                    <DeleteUserForm className="max-w-xl" />
                </section>
            </div>
        </AppLayout>
    );
}
