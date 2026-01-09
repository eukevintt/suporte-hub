<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleComment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ArticleCommentController extends Controller
{
    public function store(Request $request, Article $article): RedirectResponse
    {
        $user = $request->user();

        $canReview = $user?->can('review', Article::class) ?? false;
        if ($article->status !== 'published' && !$canReview) {
            abort(404);
        }

        $data = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        ArticleComment::create([
            'article_id' => $article->id,
            'user_id' => $user->id,
            'body' => $data['body'],
        ]);

        return back();
    }

    public function destroy(Request $request, ArticleComment $comment): RedirectResponse
    {
        $user = $request->user();

        $isAdmin = $user ? Gate::forUser($user)->allows('admin') : false;
        $isOwner = (int) $comment->user_id === (int) $user->id;

        if (!$isAdmin && !$isOwner) {
            abort(403);
        }

        $comment->delete();

        return back();
    }
}
