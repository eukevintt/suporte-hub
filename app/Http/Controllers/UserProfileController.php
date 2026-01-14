<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Article;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class UserProfileController extends Controller
{
    public function show(User $user): Response
    {
        $publishedCount = Article::query()
            ->where('author_id', $user->id)
            ->where('status', 'published')
            ->count();

        $articles = Article::query()
            ->where('author_id', $user->id)
            ->where('status', 'published')
            ->with(['category:id,name'])
            ->withCount('likes')
            ->latest()
            ->limit(20)
            ->get([
                'id',
                'title',
                'slug',
                'category_id',
                'created_at',
            ]);

        $totalLikesReceived = DB::table('article_likes')
            ->join('articles', 'articles.id', '=', 'article_likes.article_id')
            ->where('articles.author_id', $user->id)
            ->where('articles.status', 'published')
            ->count();

        return Inertia::render('Profile/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role,
            ],
            'viewer' => [
                'id' => request()->user()->id,
            ],
            'stats' => [
                'published_count' => $publishedCount,
            ],
            'articles' => $articles,
            'stats' => [
                'published_count' => $publishedCount,
                'total_likes_received' => $totalLikesReceived,
            ],

        ]);
    }
}
