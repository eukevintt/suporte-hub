<?php

namespace App\Providers;

use App\Models\Article;
use App\Policies\ArticlePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Article::class => ArticlePolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('access-users', function ($user) {
            return in_array($user->role, ['superadmin', 'admin'], true);
        });

        Gate::define('review-articles', function ($user) {
            if (in_array($user->role, ['superadmin', 'admin'], true)) {
                return true;
            }

            return method_exists($user, 'hasPermission')
                ? $user->hasPermission('review-articles')
                : false;
        });
    }
}
