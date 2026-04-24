<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('server_migrations', function (Blueprint $table) {
            $table->time('infra_start_time')->nullable()->after('infra_start_date');
            $table->time('infra_end_time')->nullable()->after('infra_start_time');
        });
    }

    public function down(): void
    {
        Schema::table('server_migrations', function (Blueprint $table) {
            $table->dropColumn([
                'infra_start_time',
                'infra_end_time',
            ]);
        });
    }
};
