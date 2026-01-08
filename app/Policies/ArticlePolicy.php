<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

class ArticlePolicy
{
    public function review(User $user, ?Article $article = null): bool
    {
        return $user->can('review-articles');
    }
}
