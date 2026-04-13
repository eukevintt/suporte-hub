<?php

namespace App\Http\Controllers;

use App\Models\ServerMigration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServerMigrationController extends Controller
{
    public function index(): Response
    {
        $activeMigrations = ServerMigration::query()
            ->active()
            ->orderBy('migration_date')
            ->orderBy('migration_time')
            ->get()
            ->map(fn (ServerMigration $migration) => $this->transformMigration($migration));

        $historyMigrations = ServerMigration::query()
            ->history()
            ->orderByDesc('migration_date')
            ->orderByDesc('migration_time')
            ->get()
            ->map(fn (ServerMigration $migration) => $this->transformMigration($migration));

        return Inertia::render('Utilities/Migrations/Index', [
            'activeMigrations' => $activeMigrations,
            'historyMigrations' => $historyMigrations,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Utilities/Migrations/Create', [
            'authorizationOptions' => $this->authorizationOptions(),
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'client_email' => ['required', 'email', 'max:255'],
            'node_id' => ['required', 'string', 'max:255'],
            'has_start_stop' => ['required', 'boolean'],
            'authorization' => ['required', 'in:whatsapp,email,no_response,not_applicable'],
            'migration_date' => ['required', 'date'],
            'migration_time' => ['required', 'date_format:H:i'],
            'source_server' => ['required', 'string', 'max:255'],
            'destination_server' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:awaiting_authorization,scheduled,in_progress,completed,cancelled'],
            'notes' => ['nullable', 'string'],
        ]);

        $data['created_by'] = $request->user()->id;
        $data['updated_by'] = $request->user()->id;

        ServerMigration::create($data);

        return redirect()
            ->route('utilities.migrations.index')
            ->with('success', 'Migração criada com sucesso.');
    }

    public function edit(ServerMigration $migration): Response
    {
        return Inertia::render('Utilities/Migrations/Edit', [
            'migration' => $this->transformMigration($migration, true),
            'authorizationOptions' => $this->authorizationOptions(),
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function update(Request $request, ServerMigration $migration): RedirectResponse
    {
        $data = $request->validate([
            'client_email' => ['required', 'email', 'max:255'],
            'node_id' => ['required', 'string', 'max:255'],
            'has_start_stop' => ['required', 'boolean'],
            'authorization' => ['required', 'in:whatsapp,email,no_response,not_applicable'],
            'migration_date' => ['required', 'date'],
            'migration_time' => ['required', 'date_format:H:i'],
            'source_server' => ['required', 'string', 'max:255'],
            'destination_server' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:awaiting_authorization,scheduled,in_progress,completed,cancelled'],
            'notes' => ['nullable', 'string'],
        ]);

        $data['updated_by'] = $request->user()->id;

        $migration->update($data);

        return redirect()
            ->route('utilities.migrations.index')
            ->with('success', 'Migração atualizada com sucesso.');
    }

    public function updateStatus(Request $request, ServerMigration $migration): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:in_progress,completed,cancelled'],
        ]);

        $migration->update([
            'status' => $data['status'],
            'updated_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Status da migração atualizado com sucesso.');
    }

    public function destroy(ServerMigration $migration): RedirectResponse
    {
        $migration->delete();

        return redirect()
            ->route('utilities.migrations.index')
            ->with('success', 'Migração removida com sucesso.');
    }

    private function transformMigration(ServerMigration $migration, bool $raw = false): array
    {
        $base = [
            'id' => $migration->id,
            'client_email' => $migration->client_email,
            'node_id' => $migration->node_id,
            'has_start_stop' => $migration->has_start_stop,
            'authorization' => $migration->authorization,
            'authorization_label' => $migration->authorization_label,
            'migration_date' => $migration->migration_date?->format('Y-m-d'),
            'migration_date_br' => $migration->migration_date?->format('d/m/Y'),
            'migration_time' => substr((string) $migration->migration_time, 0, 5),
            'source_server' => $migration->source_server,
            'destination_server' => $migration->destination_server,
            'status' => $migration->status,
            'status_label' => $migration->status_label,
            'notes' => $migration->notes,
            'created_at' => $migration->created_at?->format('d/m/Y H:i'),
            'updated_at' => $migration->updated_at?->format('d/m/Y H:i'),
        ];

        return $raw ? $base : $base;
    }

    private function authorizationOptions(): array
    {
        return [
            ['value' => 'whatsapp', 'label' => 'Autorizou via WhatsApp'],
            ['value' => 'email', 'label' => 'Autorizou via e-mail'],
            ['value' => 'no_response', 'label' => 'Sem resposta do cliente'],
            ['value' => 'not_applicable', 'label' => 'Não se aplica'],
        ];
    }

    private function statusOptions(): array
    {
        return [
            ['value' => 'awaiting_authorization', 'label' => 'Aguardando autorização'],
            ['value' => 'scheduled', 'label' => 'Migração agendada'],
            ['value' => 'in_progress', 'label' => 'Em andamento'],
            ['value' => 'completed', 'label' => 'Migração realizada'],
            ['value' => 'cancelled', 'label' => 'Cancelada'],
        ];
    }
}
