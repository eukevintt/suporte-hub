import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index() {
    const utilities = [
        {
            title: "Busca de Usuários",
            description: "Encontre em qual servidor o cliente está",
            href: "/utilities/user-lookup",
        },
    ];

    return (
        <AppLayout title="Utilidades">
            <Head title="Utilidades" />

            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Utilidades</h1>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {utilities.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="block rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition"
                        >
                            <div className="text-lg font-medium">
                                {item.title}
                            </div>

                            <div className="text-sm text-gray-500 mt-1">
                                {item.description}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
