<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ForcePasswordController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\TagsController;
use App\Http\Controllers\ArticlesController;
use App\Http\Controllers\SearchController;

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

        Route::get('/articles', [ArticlesController::class, 'index'])->name('articles.index');

        Route::get('/articles/create', [ArticlesController::class, 'create'])->name('articles.create');
        Route::get('/articles/{article:slug}', [ArticlesController::class, 'show'])->name('articles.show');

        Route::post('/articles', [ArticlesController::class, 'store'])->name('articles.store');
        Route::put('/articles/{article}', [ArticlesController::class, 'update'])->name('articles.update');
        Route::delete('/articles/{article}', [ArticlesController::class, 'destroy'])->name('articles.destroy');

        Route::middleware(['can:review,article'])->group(function () {
            Route::put('/articles/{article}/approve', [ArticlesController::class, 'approve'])->name('articles.approve');
            Route::put('/articles/{article}/reject', [ArticlesController::class, 'reject'])->name('articles.reject');
        });


        Route::get('/search', [SearchController::class, 'index'])->name('search.index');
        Route::get('/search/suggestions', [SearchController::class, 'suggestions'])->name('search.suggestions');

        Route::get('/categories', [CategoriesController::class, 'index'])->name('categories.index');
        Route::post('/categories', [CategoriesController::class, 'store'])->name('categories.store');
        Route::put('/categories/{category}', [CategoriesController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [CategoriesController::class, 'destroy'])->name('categories.destroy');

        Route::get('/tags', [TagsController::class, 'index'])->name('tags.index');
        Route::post('/tags', [TagsController::class, 'store'])->name('tags.store');
        Route::put('/tags/{tag}', [TagsController::class, 'update'])->name('tags.update');
        Route::delete('/tags/{tag}', [TagsController::class, 'destroy'])->name('tags.destroy');

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
