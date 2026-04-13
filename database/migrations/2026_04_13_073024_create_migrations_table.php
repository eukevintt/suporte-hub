<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('server_migrations', function (Blueprint $table) {
            $table->id();
            $table->string('client_email');
            $table->string('node_id');
            $table->boolean('has_start_stop')->default(false);
            $table->string('authorization', 30);
            $table->date('migration_date');
            $table->time('migration_time');
            $table->string('source_server');
            $table->string('destination_server');
            $table->string('status', 40)->default('awaiting_authorization');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['migration_date', 'status']);
            $table->index('client_email');
            $table->index('node_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('migrations');
    }
};
