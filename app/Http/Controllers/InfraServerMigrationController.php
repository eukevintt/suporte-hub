<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ServerMigration;
use Inertia\Inertia;

class InfraServerMigrationController extends Controller
{
    public function create(Request $request)
    {
        $this->ensureInfraAccess($request->user());

        return Inertia::render('Utilities/Migrations/InfraForm');
    }

        public function store(Request $request)
    {
        $this->ensureInfraAccess($request->user());

        $data = $request->validate([
            'source_server' => 'required|string',
            'destination_server' => 'required|string',
            'infra_start_date' => 'required|date',
            'infra_end_forecast' => 'required|date',
            'infra_finished_at' => 'nullable|date',
            'remaining_containers' => 'nullable|integer|min:0',
            'total_containers' => 'required|integer|min:0',
            'status' => 'required|in:awaiting_authorization,scheduled,in_progress,completed',
        ]);

        ServerMigration::create([
            ...$data,
            'type' => 'infra',
            'created_by' => $request->user()->id,
        ]);

        return redirect()->route('utilities.migrations.index');
    }

        public function edit(Request $request, ServerMigration $serverMigration)
    {
        if ($serverMigration->type !== 'infra') {
            abort(404);
        }

        return Inertia::render('Utilities/Migrations/InfraForm', [
            'migration' => $serverMigration,
            'mode' => 'edit',
        ]);
    }

    public function update(Request $request, ServerMigration $serverMigration)
    {
        if ($serverMigration->type !== 'infra') {
            abort(404);
        }

        $data = $request->validate([
            'source_server' => 'required|string',
            'destination_server' => 'required|string',
            'infra_start_date' => 'required|date',
            'infra_end_forecast' => 'required|date',
            'infra_finished_at' => 'nullable|date',
            'remaining_containers' => 'nullable|integer|min:0',
            'total_containers' => 'required|integer|min:0',
            'status' => 'required|in:awaiting_authorization,scheduled,in_progress,completed',
        ]);

        $serverMigration->update($data);

        return redirect()->route('utilities.migrations.index');
    }

    private function ensureInfraAccess($user)
    {
        if (!in_array($user->role, ['infra', 'admin', 'superadmin'])) {
            abort(403);
        }
    }
}
