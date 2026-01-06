<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/articles', function () {
        return Inertia::render('Articles/Index');
    })->name('articles.index');

    Route::get('/categories', function () {
        return Inertia::render('Categories/Index');
    })->name('categories.index');

    Route::get('/tags', function () {
        return Inertia::render('Tags/Index');
    })->name('tags.index');

    Route::get('/users', function () {
        return Inertia::render('Users/Index');
    })->name('users.index');
});

Route::middleware(['auth', 'can:access-users'])->group(function () {
    Route::get('/users', UsersController::class)->name('users.index');
});


require __DIR__.'/auth.php';
