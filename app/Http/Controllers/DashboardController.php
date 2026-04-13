<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ServerMigration;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $now = Carbon::now();

        $mostLiked = Article::query()
            ->where('status', 'published')
            ->with(['author:id,name'])
            ->withCount('likes')
            ->orderByDesc('likes_count')
            ->limit(5)
            ->get([
                'id',
                'title',
                'slug',
                'author_id',
            ]);

        $highlightMigrations = ServerMigration::query()
            ->whereDate('migration_date', $now->toDateString())
            ->whereIn('status', ServerMigration::ACTIVE_STATUSES)
            ->orderBy('migration_time')
            ->get()
            ->filter(function (ServerMigration $migration) use ($now) {
                if (!$migration->migration_time || !$migration->migration_date) {
                    return false;
                }

                $migrationDateTime = Carbon::parse(
                    $migration->migration_date->format('Y-m-d') . ' ' . substr((string) $migration->migration_time, 0, 8)
                );

                return $migrationDateTime->lessThanOrEqualTo($now);
            })
            ->map(fn (ServerMigration $migration) => $this->transformMigration($migration))
            ->values();

        $todayMigrations = ServerMigration::query()
            ->whereDate('migration_date', $now->toDateString())
            ->whereIn('status', ServerMigration::ACTIVE_STATUSES)
            ->orderBy('migration_time')
            ->get()
            ->map(fn (ServerMigration $migration) => $this->transformMigration($migration));

        $upcomingMigrations = ServerMigration::query()
            ->where(function ($query) use ($now) {
                $query->whereDate('migration_date', '>', $now->toDateString())
                    ->orWhere(function ($subQuery) use ($now) {
                        $subQuery->whereDate('migration_date', $now->toDateString())
                            ->whereTime('migration_time', '>', $now->format('H:i:s'));
                    });
            })
            ->whereIn('status', ServerMigration::ACTIVE_STATUSES)
            ->orderBy('migration_date')
            ->orderBy('migration_time')
            ->limit(10)
            ->get()
            ->map(fn (ServerMigration $migration) => $this->transformMigration($migration));

        return Inertia::render('Dashboard', [
            'mostLiked' => $mostLiked,
            'highlightMigrations' => $highlightMigrations,
            'todayMigrations' => $todayMigrations,
            'upcomingMigrations' => $upcomingMigrations,
        ]);
    }

    private function transformMigration(ServerMigration $migration): array
    {
        return [
            'id' => $migration->id,
            'client_email' => $migration->client_email,
            'node_id' => $migration->node_id,
            'migration_date' => $migration->migration_date?->format('Y-m-d'),
            'migration_date_br' => $migration->migration_date?->format('d/m/Y'),
            'migration_time' => substr((string) $migration->migration_time, 0, 5),
            'source_server' => $migration->source_server,
            'destination_server' => $migration->destination_server,
            'status' => $migration->status,
            'status_label' => $migration->status_label,
            'notes' => $migration->notes,
            'has_start_stop' => $migration->has_start_stop,
        ];
    }
}
