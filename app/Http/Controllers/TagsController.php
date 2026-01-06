<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TagsController extends Controller
{
    public function index()
    {
        return Inertia::render('Tags/Index', [
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name', 'slug', 'created_at']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:tags,name'],
        ]);

        $baseSlug = Str::slug($data['name']);
        $slug = $this->uniqueSlug(Tag::class, $baseSlug);

        Tag::create([
            'name' => $data['name'],
            'slug' => $slug,
        ]);

        return redirect()->route('tags.index');
    }

    public function update(Request $request, Tag $tag)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:tags,name,' . $tag->id],
        ]);

        $baseSlug = Str::slug($data['name']);
        $slug = $this->uniqueSlug(Tag::class, $baseSlug, $tag->id);

        $tag->update([
            'name' => $data['name'],
            'slug' => $slug,
        ]);

        return redirect()->route('tags.index');
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return redirect()->route('tags.index');
    }

    private function uniqueSlug(string $modelClass, string $baseSlug, ?int $ignoreId = null): string
    {
        $slug = $baseSlug;
        $i = 2;

        while (
            $modelClass::query()
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $baseSlug . '-' . $i;
            $i++;
        }

        return $slug;
    }
}
