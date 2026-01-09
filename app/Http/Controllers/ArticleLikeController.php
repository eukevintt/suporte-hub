<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ArticleLikeController extends Controller
{
    public function store(Request $request, Article $article): RedirectResponse
    {
        $user = $request->user();

        $canReview = $user?->can('review', Article::class) ?? false;
        if ($article->status !== 'published' && !$canReview) {
            abort(404);
        }

        $article->likes()->syncWithoutDetaching([$user->id]);

        return back();
    }

    public function destroy(Request $request, Article $article): RedirectResponse
    {
        $user = $request->user();

        $canReview = $user?->can('review', Article::class) ?? false;
        if ($article->status !== 'published' && !$canReview) {
            abort(404);
        }

        $article->likes()->detach($user->id);

        return back();
    }
}
