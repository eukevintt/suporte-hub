<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('server_migrations', function (Blueprint $table) {
            $table->string('client_email')->nullable()->change();
            $table->string('node_id')->nullable()->change();
            $table->string('authorization', 30)->nullable()->change();
            $table->date('migration_date')->nullable()->change();
            $table->time('migration_time')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('server_migrations', function (Blueprint $table) {
            $table->string('client_email')->nullable(false)->change();
            $table->string('node_id')->nullable(false)->change();
            $table->string('authorization', 30)->nullable(false)->change();
            $table->date('migration_date')->nullable(false)->change();
            $table->time('migration_time')->nullable(false)->change();
        });
    }
};
