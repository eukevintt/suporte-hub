import React, { useRef } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { usePage, Link, Head } from "@inertiajs/react";

function LinkCarousel({ links }) {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(false);

    const updateScrollState = React.useCallback(() => {
        const container = scrollRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;

        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }, []);

    React.useEffect(() => {
        updateScrollState();

        const container = scrollRef.current;
        if (!container) return;

        container.addEventListener("scroll", updateScrollState);
        window.addEventListener("resize", updateScrollState);

        return () => {
            container.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, [links, updateScrollState]);

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        container.scrollBy({
            left: direction === "left" ? -266 : 266,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative">
            {canScrollLeft && (
                <button
                    type="button"
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:border-black hover:bg-black hover:text-white"
                >
                    ←
                </button>
            )}

            <div
                ref={scrollRef}
                className={[
                    "flex gap-4 overflow-hidden",
                    canScrollLeft ? "pl-12" : "pl-0",
                    canScrollRight ? "pr-12" : "pr-0",
                ].join(" ")}
            >
                {links.map((link) => (
                    <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-[250px] max-w-[250px] rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
                    >
                        <div className="text-sm font-medium">
                            {link.name}
                        </div>

                        {link.description && (
                            <div className="mt-1 text-xs text-gray-500">
                                {link.description}
                            </div>
                        )}
                    </a>
                ))}
            </div>

            {canScrollRight && (
                <button
                    type="button"
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:border-black hover:bg-black hover:text-white"
                >
                    →
                </button>
            )}
        </div>
    );
}

export default function Index() {
    const { types, auth } = usePage().props;

    const user = auth?.user;

    const isAdmin = ["admin", "superadmin"].includes(
        String(user?.role ?? "").toLowerCase()
    );

    return (
        <AppLayout title="Links">
            <Head title="Links Utéis" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Links úteis</h1>

                    {isAdmin && (
                        <div className="flex items-center gap-2">
                            <Link
                                href={route("links.types.manage")}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                            >
                                Gerenciar tipos
                            </Link>

                            <Link
                                href={route("links.manage")}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                            >
                                Gerenciar links
                            </Link>

                            <Link
                                href={route("links.create")}
                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
                            >
                                Adicionar link
                            </Link>
                        </div>
                    )}
                </div>

                {types.length === 0 && (
                    <div className="text-sm text-gray-500">
                        Nenhum link cadastrado ainda.
                    </div>
                )}

                <div className="space-y-8">
                    {types.map((type) => (
                        <div key={type.id} className="space-y-3">
                            <h2 className="text-lg font-semibold">
                                {type.name}
                            </h2>

                            <LinkCarousel links={type.links} />
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
