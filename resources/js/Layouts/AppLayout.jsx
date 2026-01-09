import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";

const nav = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Artigos", href: "/articles" },
    { label: "Categorias", href: "/categories" },
    { label: "Tags", href: "/tags" },
    { label: "Usuários", href: "/users", adminOnly: true },
];

export default function AppLayout({ title, children, query }) {
    const { props } = usePage();
    const user = props?.auth?.user;

    const isAdmin = useMemo(() => {
        const role = String(user?.role ?? "").toLowerCase();
        return role === "admin" || role === "superadmin";
    }, [user?.role]);

    const visibleNav = useMemo(() => {
        return nav.filter((item) => {
            if (!item.adminOnly) return true;
            return isAdmin;
        });
    }, [isAdmin]);

    const minCharsForSuggestions = 1;

    const [search, setSearch] = useState(query || "");
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const controllerRef = useRef(null);
    const blurTimeoutRef = useRef(null);

    useEffect(() => {
        setSearch(query || "");
    }, [query]);

    useEffect(() => {
        setActiveIndex(-1);
    }, [suggestions]);

    useEffect(() => {
        const q = String(search ?? "").trim();

        if (!q || q.length < minCharsForSuggestions) {
            setSuggestions([]);
            setOpen(false);
            return;
        }

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        const controller = new AbortController();
        controllerRef.current = controller;

        const timeout = setTimeout(() => {
            fetch(`/search/suggestions?q=${encodeURIComponent(q)}`, {
                signal: controller.signal,
                headers: { Accept: "application/json" },
            })
                .then((r) => (r.ok ? r.json() : []))
                .then((data) => {
                    setSuggestions(Array.isArray(data) ? data : []);
                    setOpen(true);
                })
                .catch(() => { });
        }, 250);

        return () => clearTimeout(timeout);
    }, [search, minCharsForSuggestions]);

    const hasSuggestions = suggestions.length > 0;

    const isActive = (href) => {
        if (typeof window === "undefined") return false;
        return window.location.pathname === href;
    };

    const logout = () => {
        router.post(route("logout"));
    };

    const submit = (e) => {
        e.preventDefault();
        const q = String(search ?? "").trim();
        router.get(route("search.index"), { q }, { preserveState: true });
        setOpen(false);
    };

    const goToAllResults = () => {
        const q = String(search ?? "").trim();
        router.get(route("search.index"), { q });
    };

    const onFocus = () => {
        if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
        if (hasSuggestions) setOpen(true);
    };

    const onBlur = () => {
        blurTimeoutRef.current = setTimeout(() => setOpen(false), 150);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <div className="flex">
                <aside className="hidden md:flex md:w-64 md:flex-col border-r border-gray-200 bg-white">
                    <div className="h-16 flex items-center px-5 border-b border-gray-200">
                        <span className="text-lg font-semibold">SuporteHub</span>
                    </div>

                    <nav className="flex-1 p-3 space-y-1">
                        {visibleNav.map((item) => (
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

                            <div className="flex-1 max-w-xl hidden sm:block relative">
                                <form onSubmit={submit}>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Buscar artigos..."
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                        onKeyDown={(e) => {
                                            if (!open || suggestions.length === 0) return;

                                            if (e.key === "ArrowDown") {
                                                e.preventDefault();
                                                setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
                                            }

                                            if (e.key === "ArrowUp") {
                                                e.preventDefault();
                                                setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
                                            }

                                            if (e.key === "Enter" && activeIndex >= 0) {
                                                e.preventDefault();
                                                const item = suggestions[activeIndex];
                                                if (item?.slug) {
                                                    window.location.href = `/articles/${item.slug}`;
                                                }
                                            }

                                            if (e.key === "Escape") {
                                                setOpen(false);
                                            }
                                        }}
                                    />

                                    {open && (hasSuggestions || String(search ?? "").trim().length >= minCharsForSuggestions) && (
                                        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow">
                                            {hasSuggestions ? (
                                                <ul>
                                                    {suggestions.map((item, index) => (
                                                        <li key={item.id}>
                                                            <a
                                                                href={`/articles/${item.slug}`}
                                                                className={[
                                                                    "block px-3 py-2 text-sm",
                                                                    activeIndex === index ? "bg-gray-100" : "hover:bg-gray-100",
                                                                ].join(" ")}
                                                                onMouseEnter={() => setActiveIndex(index)}
                                                            >
                                                                {item.title}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="px-3 py-2 text-sm text-gray-500">Nenhum resultado encontrado</div>
                                            )}

                                            <div className="border-t">
                                                <button
                                                    type="button"
                                                    onMouseDown={goToAllResults}
                                                    className="block w-full px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-50"
                                                >
                                                    Ver todos os resultados →
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block text-sm text-gray-700 truncate max-w-[220px]">{user?.email ?? ""}</div>
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

                        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
}
