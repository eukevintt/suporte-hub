import AppLayout from "@/Layouts/AppLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { useForm, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";

export default function Edit({ mustVerifyEmail, status, auth }) {
    const user = auth?.user;
    const { errors } = usePage().props;

    const [previewUrl, setPreviewUrl] = useState(null);

    const initials = useMemo(() => {
        return user?.name
            ? user.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            : "U";
    }, [user?.name]);

    const avatarForm = useForm({
        _method: "patch",
        name: user?.name ?? "",
        email: user?.email ?? "",
        avatar: null,
        remove_avatar: false,
    });

    const currentAvatar = previewUrl || user?.avatar_url || null;

    const onAvatarChange = (e) => {
        const file = e.target.files?.[0] ?? null;

        avatarForm.setData("avatar", file);
        avatarForm.setData("remove_avatar", false);

        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const submitAvatar = (e) => {
        e.preventDefault();

        avatarForm.setData((data) => ({
            ...data,
            name: user?.name ?? "",
            email: user?.email ?? "",
        }));

        avatarForm.post(route("profile.update"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setPreviewUrl(null);
                avatarForm.reset("avatar", "remove_avatar");
            },
            onError: (errors) => {
                console.log("erros", errors);
            },
        });
    };

    const removeAvatar = () => {
        avatarForm.setData("_method", "patch");
        avatarForm.setData("avatar", null);
        avatarForm.setData("remove_avatar", true);

        avatarForm.post(route("profile.update"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setPreviewUrl(null);
                avatarForm.reset("avatar");
            },
        });
    };

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
                            Envie uma imagem de perfil. O sistema ajusta o tamanho automaticamente.
                        </p>
                    </div>

                    <form onSubmit={submitAvatar}>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-xl font-semibold text-white">
                                {currentAvatar ? (
                                    <img
                                        src={currentAvatar}
                                        alt={`Avatar de ${user?.name ?? "usuário"}`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    initials
                                )}
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">
                                    {user?.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {user?.email}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-3">
                                    <label className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                                        Escolher foto
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg,image/webp"
                                            className="hidden"
                                            onChange={onAvatarChange}
                                        />
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={avatarForm.processing || !avatarForm.data.avatar}
                                        className="rounded-lg border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Salvar foto
                                    </button>

                                    <button
                                        type="button"
                                        onClick={removeAvatar}
                                        disabled={avatarForm.processing || (!user?.avatar_url && !previewUrl)}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Remover foto
                                    </button>
                                </div>

                                <p className="mt-2 text-xs text-gray-500">
                                    Formatos aceitos: JPG, PNG e WEBP. Tamanho máximo de envio: 5MB.
                                </p>

                                {errors.avatar && (
                                    <p className="mt-2 text-sm text-red-600">{errors.avatar}</p>
                                )}
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}
