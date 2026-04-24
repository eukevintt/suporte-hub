<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('server_migrations', function (Blueprint $table) {
            $table->string('type', 20)->default('default')->after('id');

            $table->dateTime('infra_start_date')->nullable()->after('migration_time');
            $table->dateTime('infra_end_forecast')->nullable()->after('infra_start_date');
            $table->dateTime('infra_finished_at')->nullable()->after('infra_end_forecast');

            $table->unsignedInteger('total_containers')->nullable()->after('infra_finished_at');
            $table->unsignedInteger('remaining_containers')->nullable()->after('total_containers');

            $table->index(['type', 'status']);
            $table->index('infra_start_date');
        });
    }

    public function down(): void
    {
        Schema::table('server_migrations', function (Blueprint $table) {
            $table->dropIndex(['type', 'status']);
            $table->dropIndex(['infra_start_date']);

            $table->dropColumn([
                'type',
                'infra_start_date',
                'infra_end_forecast',
                'infra_finished_at',
                'total_containers',
                'remaining_containers',
            ]);
        });
    }
};
