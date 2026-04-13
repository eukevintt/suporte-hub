<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->boolean('is_protected')->default(false)->after('slug');
        });

        Schema::table('tags', function (Blueprint $table) {
            $table->boolean('is_protected')->default(false)->after('slug');
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('is_protected');
        });

        Schema::table('tags', function (Blueprint $table) {
            $table->dropColumn('is_protected');
        });
    }
};
