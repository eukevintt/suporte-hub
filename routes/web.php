<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ForcePasswordController;
use App\Http\Controllers\UsersController;

Route::redirect('/', '/login');

Route::middleware(['auth'])->group(function () {
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

        Route::get('/profile', fn () => Inertia::render('Profile/Edit'))->name('profile.edit');

        Route::middleware(['can:access-users'])->group(function () {
            Route::get('/users', [UsersController::class, 'index'])->name('users.index');
            Route::post('/users', [UsersController::class, 'store'])->name('users.store');
            Route::get('/users/{user}/edit', [UsersController::class, 'edit'])->name('users.edit');
            Route::put('/users/{user}', [UsersController::class, 'update'])->name('users.update');
            Route::delete('/users/{user}', [UsersController::class, 'destroy'])->name('users.destroy');
        });
    });
});

require __DIR__ . '/auth.php';
