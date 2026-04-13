<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class ServerMigration extends Model
{
    protected $fillable = [
        'client_email',
        'node_id',
        'has_start_stop',
        'authorization',
        'migration_date',
        'migration_time',
        'source_server',
        'destination_server',
        'status',
        'notes',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'has_start_stop' => 'boolean',
        'migration_date' => 'date',
    ];

    public const AUTHORIZATIONS = [
        'whatsapp',
        'email',
        'no_response',
        'not_applicable',
    ];

    public const ACTIVE_STATUSES = [
        'awaiting_authorization',
        'scheduled',
        'in_progress',
    ];

    public const HISTORY_STATUSES = [
        'completed',
        'cancelled',
    ];

    public const ALL_STATUSES = [
        'awaiting_authorization',
        'scheduled',
        'in_progress',
        'completed',
        'cancelled',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereIn('status', self::ACTIVE_STATUSES);
    }

    public function scopeHistory(Builder $query): Builder
    {
        return $query->whereIn('status', self::HISTORY_STATUSES);
    }

    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('migration_date', Carbon::today());
    }

    public function getAuthorizationLabelAttribute(): string
    {
        return match ($this->authorization) {
            'whatsapp' => 'Autorizou via WhatsApp',
            'email' => 'Autorizou via e-mail',
            'no_response' => 'Sem resposta do cliente',
            'not_applicable' => 'Não se aplica',
            default => '—',
        };
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'awaiting_authorization' => 'Aguardando autorização',
            'scheduled' => 'Migração agendada',
            'in_progress' => 'Em andamento',
            'completed' => 'Migração realizada',
            'cancelled' => 'Cancelada',
            default => '—',
        };
    }
}
