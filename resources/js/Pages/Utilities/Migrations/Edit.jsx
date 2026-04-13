import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import Form from "./Form";

export default function Edit({
    migration,
    authorizationOptions = [],
    statusOptions = [],
}) {
    return (
        <AppLayout title="Editar Migração">
            <Head title="Editar Migração" />

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Editar migração</h1>
                        <p className="text-sm text-gray-500">
                            Atualize os dados da migração
                        </p>
                    </div>

                    <Link
                        href={route("utilities.migrations.index")}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        Voltar
                    </Link>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <Form
                        mode="edit"
                        migration={migration}
                        authorizationOptions={authorizationOptions}
                        statusOptions={statusOptions}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
