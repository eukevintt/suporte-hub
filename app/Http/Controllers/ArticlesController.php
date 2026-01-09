<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArticlesController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isReviewer = $user?->can('review', Article::class) ?? false;

        $search = $request->string('search')->toString();

        $baseQuery = fn () => Article::query()
            ->with(['category:id,name', 'tags:id,name', 'author:id,name'])
            ->withCount('likes')
            ->latest();

        $pendingReview = collect();
        if ($isReviewer) {
            $pendingReview = $baseQuery()
                ->where('status', 'pending_review')
                ->limit(5)
                ->get([
                    'id',
                    'title',
                    'slug',
                    'excerpt',
                    'content',
                    'status',
                    'category_id',
                    'author_id',
                    'created_at',
                    'updated_at',
                ]);
        }

        $query = $baseQuery()->where('status', 'published');

        if ($search !== '') {
            $query->where('title', 'like', '%' . $search . '%');
        }

        $articles = $query->get([
            'id',
            'title',
            'slug',
            'excerpt',
            'content',
            'status',
            'category_id',
            'author_id',
            'created_at',
            'updated_at',
        ]);

        $likedIds = [];
        if ($user) {
            $ids = $articles->pluck('id')->merge($pendingReview->pluck('id'))->unique()->values();

            if ($ids->count()) {
                $likedIds = DB::table('article_likes')
                    ->where('user_id', $user->id)
                    ->whereIn('article_id', $ids)
                    ->pluck('article_id')
                    ->all();
            }
        }

        $articles->each(fn ($a) => $a->setAttribute('liked_by_me', in_array($a->id, $likedIds, true)));
        $pendingReview->each(fn ($a) => $a->setAttribute('liked_by_me', in_array($a->id, $likedIds, true)));

        return Inertia::render('Articles/Index', [
            'articles' => $articles,
            'pendingReview' => $pendingReview,
            'canReview' => $isReviewer,
            'canDeleteArticles' => Gate::allows('delete-articles'),

            'categories' => Category::query()
                ->orderBy('name')
                ->get(['id', 'name']),
            'tags' => Tag::query()
                ->orderBy('name')
                ->get(['id', 'name']),
            'filters' => [
                'search' => $search ?: null,
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

    public function show(Request $request, Article $article): Response
    {
        $article->load(['category:id,name', 'tags:id,name', 'author:id,name']);
        $article->loadCount('likes');

        $user = $request->user();

        $likedByMe = false;
        if ($user) {
            $likedByMe = DB::table('article_likes')
                ->where('user_id', $user->id)
                ->where('article_id', $article->id)
                ->exists();
        }

        $isAdmin = $user ? Gate::forUser($user)->allows('admin') : false;

        $comments = $article->comments()
            ->with(['user:id,name'])
            ->latest()
            ->limit(20)
            ->get([
                'id',
                'article_id',
                'user_id',
                'body',
                'created_at',
            ])
            ->map(function ($c) use ($user, $isAdmin) {
                return [
                    'id' => $c->id,
                    'body' => $c->body,
                    'created_at' => $c->created_at,
                    'user_id' => $c->user_id,
                    'user' => $c->user,
                    'can_delete' => $isAdmin || ((int) $c->user_id === (int) ($user?->id ?? 0)),
                ];
            })
            ->values();

        return Inertia::render('Articles/Show', [
            'article' => $article->only([
                'id',
                'title',
                'slug',
                'excerpt',
                'content',
                'status',
                'category_id',
                'author_id',
                'created_at',
                'updated_at',
            ]) + [
                'category' => $article->category,
                'tags' => $article->tags,
                'author' => $article->author,
                'likes_count' => $article->likes_count,
                'liked_by_me' => $likedByMe,
            ],
            'comments' => $comments,

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

        $status = $request->user()->can('review', Article::class)
            ? 'published'
            : 'pending_review';

        $article = Article::create([
            'title' => $data['title'],
            'slug' => $this->uniqueSlug($data['title']),
            'excerpt' => $data['excerpt'] ?? null,
            'content' => $data['content'],
            'status' => $status,
            'category_id' => $data['category_id'],
            'author_id' => $request->user()->id,
        ]);

        $article->content = $this->moveAllTmpImagesToArticle(
            $article->content ?? '',
            $article->id,
            $request->user()->id
        );

        $article->save();

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
        Gate::authorize('delete-articles');

        Storage::disk('public')->deleteDirectory("articles/{$article->id}");
        $article->forceDelete();

        return redirect()->route('articles.index');
    }

    public function approve(Article $article): RedirectResponse
    {
        Gate::authorize('review', $article);

        $article->update([
            'status' => 'published',
        ]);

        return back()->with('success', 'Article published.');
    }

    public function reject(Article $article): RedirectResponse
    {
        Gate::authorize('review', $article);

        $article->forceDelete();

        return back()->with('success', 'Article rejected.');
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

    private function moveAllTmpImagesToArticle(string $html, int $articleId, int $userId): string
    {
        $disk = Storage::disk('public');

        $tmpDir = "articles/tmp/{$userId}";
        $targetDir = "articles/{$articleId}/images";

        if (!$disk->exists($tmpDir)) {
            return $html;
        }

        $disk->makeDirectory($targetDir);

        foreach ($disk->files($tmpDir) as $file) {
            $filename = basename($file);
            $disk->move($file, "{$targetDir}/{$filename}");
        }

        $html = str_replace(
            "/storage/articles/tmp/{$userId}/",
            "/storage/articles/{$articleId}/images/",
            $html
        );

        $disk->deleteDirectory($tmpDir);

        return $html;
    }
}
