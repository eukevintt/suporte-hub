import React from "react";
import { Link, usePage, router } from "@inertiajs/react";

const nav = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Artigos", href: "/articles" },
    { label: "Categorias", href: "/categories" },
    { label: "Tags", href: "/tags" },
    { label: "Usuários", href: "/users" },
];

export default function AppLayout({ title, children }) {
    const { props } = usePage();
    const user = props?.auth?.user;

    const isActive = (href) => {
        if (typeof window === "undefined") return false;
        return window.location.pathname === href;
    };

    const logout = () => {
        router.post(route("logout"));
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <div className="flex">
                <aside className="hidden md:flex md:w-64 md:flex-col border-r border-gray-200 bg-white">
                    <div className="h-16 flex items-center px-5 border-b border-gray-200">
                        <span className="text-lg font-semibold">SuporteHub</span>
                    </div>

                    <nav className="flex-1 p-3 space-y-1">
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={[
                                    "block rounded-lg px-3 py-2 text-sm font-medium",
                                    isActive(item.href)
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                ].join(" ")}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500">Logado como</div>
                        <div className="text-sm font-medium truncate">{user?.name ?? "—"}</div>
                    </div>
                </aside>

                <div className="flex-1 min-w-0">
                    <header className="h-16 border-b border-gray-200 bg-white">
                        <div className="h-full flex items-center justify-between px-4 md:px-6 gap-4">
                            <div className="md:hidden text-base font-semibold">SuporteHub</div>

                            <div className="flex-1 max-w-xl hidden sm:block">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Busca (em breve)..."
                                        disabled
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block text-sm text-gray-700 truncate max-w-[220px]">
                                    {user?.email ?? ""}
                                </div>
                                <button
                                    type="button"
                                    onClick={logout}
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                                >
                                    Sair
                                </button>
                            </div>
                        </div>
                    </header>

                    <main className="p-4 md:p-6">
                        <div className="mb-5">
                            <h1 className="text-xl font-semibold">{title}</h1>
                            <p className="text-sm text-gray-500">Página placeholder — Em construção</p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
