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
        $now = Carbon::now('America/Sao_Paulo');

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

        $commonArticles = Article::query()
            ->where('status', 'published')
            ->whereHas('tags', function ($q) {
                $q->where('slug', 'comum');
            })
            ->with(['author:id,name', 'category:id,name'])
            ->latest()
            ->limit(6)
            ->get([
                'id',
                'title',
                'slug',
                'author_id',
                'category_id',
            ]);

        $highlightMigrations = ServerMigration::query()
            ->whereIn('status', ServerMigration::ACTIVE_STATUSES)
            ->where(function ($query) use ($now) {
                $query->where(function ($q) use ($now) {
                    $q->where('type', 'default')
                        ->whereDate('migration_date', $now->toDateString());
                })->orWhere(function ($q) use ($now) {
                    $q->where('type', 'infra')
                        ->whereDate('infra_start_date', $now->toDateString());
                });
            })
            ->get()
            ->filter(function (ServerMigration $migration) use ($now) {
                if ($migration->type === 'infra') {
                    return $migration->infra_start_date
                        && $migration->infra_start_date->timezone('America/Sao_Paulo')->lessThanOrEqualTo($now);
                }

                if (!$migration->migration_time || !$migration->migration_date) {
                    return false;
                }

                $migrationDateTime = Carbon::parse(
                    $migration->migration_date->format('Y-m-d') . ' ' . substr((string) $migration->migration_time, 0, 8),
                    'America/Sao_Paulo'
                );

                return $migrationDateTime->lessThanOrEqualTo($now);
            })
            ->map(fn (ServerMigration $migration) => $this->transformMigration($migration))
            ->values();

        $todayMigrations = ServerMigration::query()
            ->whereIn('status', ServerMigration::ACTIVE_STATUSES)
            ->where(function ($query) use ($now) {
                $query->where(function ($q) use ($now) {
                    $q->where('type', 'default')
                        ->whereDate('migration_date', $now->toDateString());
                })->orWhere(function ($q) use ($now) {
                    $q->where('type', 'infra')
                        ->whereDate('infra_start_date', $now->toDateString());
                });
            })
            ->get()
            ->sortBy(fn (ServerMigration $migration) => $this->migrationDateTime($migration)?->timestamp ?? 0)
            ->map(fn (ServerMigration $migration) => $this->transformMigration($migration))
            ->values();

        $upcomingMigrations = ServerMigration::query()
            ->whereIn('status', ServerMigration::ACTIVE_STATUSES)
            ->where(function ($query) use ($now) {
                $query->where(function ($q) use ($now) {
                    $q->where('type', 'default')
                        ->where(function ($subQuery) use ($now) {
                            $subQuery->whereDate('migration_date', '>', $now->toDateString())
                                ->orWhere(function ($innerQuery) use ($now) {
                                    $innerQuery->whereDate('migration_date', $now->toDateString())
                                        ->whereTime('migration_time', '>', $now->format('H:i:s'));
                                });
                        });
                })->orWhere(function ($q) use ($now) {
                    $q->where('type', 'infra')
                        ->where('infra_start_date', '>', $now);
                });
            })
            ->get()
            ->sortBy(fn (ServerMigration $migration) => $this->migrationDateTime($migration)?->timestamp ?? PHP_INT_MAX)
            ->take(10)
            ->map(fn (ServerMigration $migration) => $this->transformMigration($migration))
            ->values();

        return Inertia::render('Dashboard', [
            'mostLiked' => $mostLiked,
            'highlightMigrations' => $highlightMigrations,
            'todayMigrations' => $todayMigrations,
            'upcomingMigrations' => $upcomingMigrations,
            'commonArticles' => $commonArticles,
        ]);
    }

    private function migrationDateTime(ServerMigration $migration): ?Carbon
    {
        if ($migration->type === 'infra') {
            if (!$migration->infra_start_date) {
                return null;
            }

            return Carbon::parse(
                $migration->infra_start_date->format('Y-m-d') . ' ' . ($migration->infra_start_time ?? '00:00'),
                'America/Sao_Paulo'
            );
        }

        if (!$migration->migration_date || !$migration->migration_time) {
            return null;
        }

        return Carbon::parse(
            $migration->migration_date->format('Y-m-d') . ' ' . substr((string) $migration->migration_time, 0, 8),
            'America/Sao_Paulo'
        );
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

            'type' => $migration->type,
            'infra_start_date' => $migration->infra_start_date?->format('Y-m-d'),
            'infra_start_date_br' => $migration->infra_start_date?->format('d/m/Y'),
            'infra_start_time' => $migration->infra_start_time
                ? substr((string) $migration->infra_start_time, 0, 5)
                : null,

            'infra_end_time' => $migration->infra_end_time
                ? substr((string) $migration->infra_end_time, 0, 5)
                : null,

            'infra_end_forecast' => $migration->infra_end_forecast?->format('Y-m-d'),
            'infra_end_forecast_br' => $migration->infra_end_forecast?->format('d/m/Y'),

            'infra_finished_at' => $migration->infra_finished_at,

            'total_containers' => $migration->total_containers,
            'remaining_containers' => $migration->remaining_containers,
        ];
    }
}
