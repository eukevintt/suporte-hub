<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArticlesController extends Controller
{
    public function index(): Response
    {
        $query = Article::query()
            ->with(['category:id,name', 'tags:id,name'])
            ->latest();

        $status = request('status');
        $search = request('search');

        if (in_array($status, ['draft', 'published'], true)) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where('title', 'like', '%' . $search . '%');
        }

        return Inertia::render('Articles/Index', [
            'articles' => $query->get([
                'id',
                'title',
                'slug',
                'excerpt',
                'content',
                'status',
                'category_id',
                'created_at',
                'updated_at',
            ]),
            'categories' => Category::query()
                ->orderBy('name')
                ->get(['id', 'name']),
            'tags' => Tag::query()
                ->orderBy('name')
                ->get(['id', 'name']),
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Articles/Create', [
            'categories' => Category::query()
                ->orderBy('name')
                ->get(['id', 'name']),
            'tags' => Tag::query()
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function show(Article $article): Response
    {
        $article->load(['category:id,name', 'tags:id,name']);

        return Inertia::render('Articles/Show', [
            'article' => $article->only([
                'id',
                'title',
                'slug',
                'excerpt',
                'content',
                'status',
                'category_id',
                'created_at',
                'updated_at',
            ]) + [
                'category' => $article->category,
                'tags' => $article->tags,
            ],

            'categories' => Category::query()
                ->orderBy('name')
                ->get(['id', 'name']),

            'tagsList' => Tag::query()
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $article = Article::create([
            'title' => $data['title'],
            'slug' => $this->uniqueSlug($data['title']),
            'excerpt' => $data['excerpt'] ?? null,
            'content' => $data['content'],
            'status' => 'draft',
            'category_id' => $data['category_id'],
        ]);

        $article->tags()->sync($data['tag_ids'] ?? []);

        return redirect()->route('articles.index');
    }

    public function update(Request $request, Article $article): RedirectResponse
    {
        $data = $this->validated($request, $article->id);

        $article->update([
            'title' => $data['title'],
            'slug' => $this->uniqueSlug($data['title'], $article->id),
            'excerpt' => $data['excerpt'] ?? null,
            'content' => $data['content'],
            'category_id' => $data['category_id'],
        ]);

        $article->tags()->sync($data['tag_ids'] ?? []);

        return redirect()->route('articles.show', $article->slug);
    }


    public function destroy(Article $article): RedirectResponse
    {
        $article->delete();

        return redirect()->route('articles.index');
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255', 'unique:articles,title' . ($ignoreId ? ',' . $ignoreId : '')],
            'excerpt' => ['nullable', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'tag_ids' => ['sometimes', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ]);
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base ?: 'article';
        $i = 2;

        while (
            Article::query()
                ->where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $base . '-' . $i;
            $i++;
        }

        return $slug;
    }

    public function publish(Article $article): RedirectResponse
    {
        $article->update([
            'status' => 'published',
        ]);

        return redirect()->route('articles.index');
    }

    public function unpublish(Article $article): RedirectResponse
    {
        $article->update([
            'status' => 'draft',
        ]);

        return redirect()->route('articles.index');
    }
}
