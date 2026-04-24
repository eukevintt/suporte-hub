<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ForcePasswordController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\TagsController;
use App\Http\Controllers\ArticlesController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ArticleImageUploadController;
use App\Http\Controllers\ArticleLikeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ArticleCommentController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserLookupController;
use App\Http\Controllers\ServerMigrationController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\InfraServerMigrationController;

Route::redirect('/', '/login');

Route::middleware(['auth'])->group(function () {
    Route::middleware(['password.force.only'])->group(function () {
        Route::get('/force-password-change', [ForcePasswordController::class, 'edit'])
            ->name('password.force.form');

        Route::post('/force-password-change', [ForcePasswordController::class, 'update'])
            ->name('password.force.update');
    });

    Route::middleware(['password.changed'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/utilities', function () {
            return Inertia::render('Utilities/Index');
        })->name('utilities.index');

        Route::get('/utilities/clientes-hospedagem-compartilhada', [UserLookupController::class, 'index'])->name('utilities.user-lookup');

        Route::get('/articles', [ArticlesController::class, 'index'])->name('articles.index');
        Route::get('/articles/all', [ArticlesController::class, 'all'])->name('articles.all');

        Route::get('/articles/create', [ArticlesController::class, 'create'])->name('articles.create');
        Route::get('/articles/{article:slug}', [ArticlesController::class, 'show'])->name('articles.show');

        Route::post('/articles', [ArticlesController::class, 'store'])->name('articles.store');

        Route::post('/articles/images/upload', [ArticleImageUploadController::class, 'store'])->name('articles.images.upload');

        Route::middleware(['can:review-articles'])->group(function () {
            Route::put('/articles/{article}/approve', [ArticlesController::class, 'approve'])->name('articles.approve');
            Route::put('/articles/{article}/reject', [ArticlesController::class, 'reject'])->name('articles.reject');
        });

        Route::middleware(['can:edit-article,article'])->group(function () {
            Route::put('/articles/{article}', [ArticlesController::class, 'update'])->name('articles.update');
        });

        Route::middleware(['can:admin'])->group(function () {
            Route::delete('/articles/{article}', [ArticlesController::class, 'destroy'])->name('articles.destroy');

            Route::get('/links/create', [LinkController::class, 'create'])->name('links.create');
            Route::post('/links', [LinkController::class, 'store'])->name('links.store');

            Route::get('/links/manage', [LinkController::class, 'manage'])->name('links.manage');

            Route::get('/links/{link}/edit', [LinkController::class, 'edit'])->name('links.edit');
            Route::put('/links/{link}', [LinkController::class, 'update'])->name('links.update');

            Route::delete('/links/{link}', [LinkController::class, 'destroy'])->name('links.destroy');

            Route::get('/links/types/manage', [LinkController::class, 'manageTypes'])->name('links.types.manage');

            Route::get('/links/types/{linkType}/edit', [LinkController::class, 'editType'])->name('links.types.edit');
            Route::put('/links/types/{linkType}', [LinkController::class, 'updateType'])->name('links.types.update');

            Route::delete('/links/types/{linkType}', [LinkController::class, 'destroyType'])->name('links.types.destroy');
        });

        Route::get('/links', [LinkController::class, 'index'])->name('links.index');

        Route::post('/articles/{article}/like', [ArticleLikeController::class, 'store'])->name('articles.like');
        Route::delete('/articles/{article}/like', [ArticleLikeController::class, 'destroy'])->name('articles.unlike');

        Route::post('/articles/{article}/comments', [ArticleCommentController::class, 'store'])->name('articles.comments.store');

        Route::delete('/comments/{comment}', [ArticleCommentController::class, 'destroy'])->name('comments.destroy');


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

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

        Route::middleware(['can:access-users'])->group(function () {
            Route::get('/users', [UsersController::class, 'index'])->name('users.index');
            Route::post('/users', [UsersController::class, 'store'])->name('users.store');
            Route::get('/users/{user}/edit', [UsersController::class, 'edit'])->name('users.edit');
            Route::put('/users/{user}', [UsersController::class, 'update'])->name('users.update');
            Route::delete('/users/{user}', [UsersController::class, 'destroy'])->name('users.destroy');
        });

        Route::get('/u/{user}', [UserProfileController::class, 'show'])->name('profiles.show');
        Route::get('/u/{user}/articles', [UserProfileController::class, 'articles'])->name('profiles.articles');

        Route::get('/utilities/migrations', [ServerMigrationController::class, 'index'])->name('utilities.migrations.index');
        Route::get('/utilities/migrations/create', [ServerMigrationController::class, 'create'])->name('utilities.migrations.create');
        Route::post('/utilities/migrations', [ServerMigrationController::class, 'store'])->name('utilities.migrations.store');
        Route::get('/utilities/migrations/{migration}/edit', [ServerMigrationController::class, 'edit'])->name('utilities.migrations.edit');
        Route::put('/utilities/migrations/{migration}', [ServerMigrationController::class, 'update'])->name('utilities.migrations.update');
        Route::put('/utilities/migrations/{migration}/status', [ServerMigrationController::class, 'updateStatus'])->name('utilities.migrations.status');
        Route::delete('/utilities/migrations/{migration}', [ServerMigrationController::class, 'destroy'])->name('utilities.migrations.destroy');

        Route::get('/utilities/migrations/infra/create', [InfraServerMigrationController::class, 'create'])
        ->name('utilities.migrations.infra.create');
        Route::post('/utilities/migrations/infra', [InfraServerMigrationController::class, 'store'])
            ->name('utilities.migrations.infra.store');

        });
        Route::get('/utilities/migrations/infra/{serverMigration}/edit', [InfraServerMigrationController::class, 'edit'])
        ->name('utilities.migrations.infra.edit');

        Route::put('/utilities/migrations/infra/{serverMigration}', [InfraServerMigrationController::class, 'update'])
            ->name('utilities.migrations.infra.update');
});

require __DIR__ . '/auth.php';
