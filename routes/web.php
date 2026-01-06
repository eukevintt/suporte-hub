<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ForcePasswordController;

Route::redirect('/', '/login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware(['password.force.only'])->group(function () {
        Route::get('/force-password-change', [ForcePasswordController::class, 'edit'])
            ->name('password.force.form');

        Route::post('/force-password-change', [ForcePasswordController::class, 'update'])
            ->name('password.force.update');
    });

    Route::middleware(['password.changed'])->group(function () {
        Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');

        Route::get('/articles', fn () => Inertia::render('Articles/Index'))->name('articles.index');
        Route::get('/categories', fn () => Inertia::render('Categories/Index'))->name('categories.index');
        Route::get('/tags', fn () => Inertia::render('Tags/Index'))->name('tags.index');

        Route::get('/users', fn () => Inertia::render('Users/Index'))->middleware('can:access-users')->name('users.index');
    });
});

require __DIR__ . '/auth.php';
