import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

export default function Edit({ user, roles }) {
    const { auth } = usePage().props;

    const [showPassword, setShowPassword] = useState(false);

    const generatePassword = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
        let pass = "";
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setData("password", pass);
        setShowPassword(true);
    };

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        must_change_password: user.must_change_password,
        can_review: user.can_review ?? false,
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("users.update", user.id));
    };

    return (
        <AppLayout title="Editar usuário">
            <Head title="Editar usuário" />

            <div className="max-w-xl">
                <form onSubmit={submit} className="space-y-5">
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
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={data.must_change_password}
                            onChange={(e) => setData("must_change_password", e.target.checked)}
                        />
                        <span className="text-sm">Deve trocar a senha no próximo login</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={data.can_review}
                            onChange={(e) => setData("can_review", e.target.checked)}
                        />
                        <span className="text-sm">Pode revisar artigos (aprovar / rejeitar)</span>
                    </div>

                    <div className="border-t pt-4">
                        <div className="text-sm font-medium mb-1">Trocar senha</div>
                        <div className="text-xs text-gray-500 mb-2">Opcional — deixe em branco para manter.</div>


                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className="w-full rounded-md border px-3 py-2 pr-20"
                            />


                            <div className="absolute inset-y-0 right-2 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="text-gray-500 hover:text-gray-700"
                                    title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </button>


                                <button
                                    type="button"
                                    onClick={generatePassword}
                                    className="text-gray-500 hover:text-gray-700"
                                    title="Gerar senha aleatória"
                                >
                                    <i className="fa-solid fa-arrows-rotate"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
