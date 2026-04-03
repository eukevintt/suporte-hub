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
            ->limit(5)
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
                'username' => $user->username,
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

    public function articles(User $user): Response
    {
        $articles = $user->articles()
            ->where('status', 'published')
            ->with('category')
            ->withCount('likes')
            ->latest('created_at')
            ->get([
                'id',
                'title',
                'slug',
                'category_id',
                'created_at',
                'author_id',
            ]);

        return Inertia::render('Users/Articles', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'role' => $user->role,
            ],
            'articles' => $articles,
        ]);
    }
}
