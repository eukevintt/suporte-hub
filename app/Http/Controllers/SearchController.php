<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function index(Request $request): Response
    {
        $q = $request->query('q');

        $articles = Article::query()
            ->where('status', 'published')
            ->when($q, function ($query) use ($q) {
                $query->where(function ($q2) use ($q) {
                $q2->where('title', 'like', "%{$q}%")
            ->orWhere('excerpt', 'like', "%{$q}%")
            ->orWhere('content', 'like', "%{$q}%");
                });
            })
            ->latest()
            ->get([
                'id',
                'title',
                'slug',
                'excerpt',
                'created_at',
            ]);

        return Inertia::render('Search/Index', [
            'query' => $q,
            'articles' => $articles,
        ]);
    }

    public function suggestions(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        if ($q === '') {
            return response()->json([]);
        }

        $items = Article::query()
            ->where('status', 'published')
            ->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                    ->orWhere('excerpt', 'like', "%{$q}%")
                    ->orWhere('content', 'like', "%{$q}%");
            })
            ->orderByDesc('updated_at')
            ->limit(5)
            ->get(['id', 'title', 'slug']);

        return response()->json($items);
    }
}
