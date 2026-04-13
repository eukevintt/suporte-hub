import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import Form from "./Form";

export default function Create({
    authorizationOptions = [],
    statusOptions = [],
}) {
    return (
        <AppLayout title="Nova Migração">
            <Head title="Nova Migração" />

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Nova migração</h1>
                        <p className="text-sm text-gray-500">
                            Cadastre uma nova migração no sistema
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
                        mode="create"
                        authorizationOptions={authorizationOptions}
                        statusOptions={statusOptions}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
