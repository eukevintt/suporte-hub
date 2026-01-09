<?php

namespace App\Observers;

use App\Models\Article;
use Illuminate\Support\Facades\Storage;

class ArticleObserver
{
    public function forceDeleted(Article $article): void
    {
        Storage::disk('public')->deleteDirectory("articles/{$article->id}");
    }

}
