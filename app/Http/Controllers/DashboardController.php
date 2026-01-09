<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $mostLiked = Article::query()
            ->where('status', 'published')
            ->with(['author:id,name'])
            ->withCount('likes')
            ->orderByDesc('likes_count')
            ->limit(5)
            ->get([
                'id',
                'title',
                'slug',
                'author_id',
            ]);

        return Inertia::render('Dashboard', [
            'mostLiked' => $mostLiked,
        ]);
    }
}
