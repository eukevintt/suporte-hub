<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoriesController extends Controller
{
    public function index()
    {
        return Inertia::render('Categories/Index', [
            'categories' => Category::query()->orderBy('name')->get(['id', 'name', 'slug', 'created_at', 'is_protected']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
        ]);

        $baseSlug = Str::slug($data['name']);
        $slug = $this->uniqueSlug(Category::class, $baseSlug);

        Category::create([
            'name' => $data['name'],
            'slug' => $slug,
        ]);

        return redirect()->route('categories.index')->with('success', 'Categoria criada com sucesso.');
    }

    public function update(Request $request, Category $category)
    {
        if ($category->is_protected) {
            return redirect()
                ->route('categories.index')
                ->with('error', 'Esta categoria é protegida pelo sistema e não pode ser editada.');
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name,' . $category->id],
        ]);

        $baseSlug = Str::slug($data['name']);
        $slug = $this->uniqueSlug(Category::class, $baseSlug, $category->id);

        $category->update([
            'name' => $data['name'],
            'slug' => $slug,
        ]);

        return redirect()->route('categories.index')->with('success', 'Categoria atualizada com sucesso.');
    }

    public function destroy(Category $category)
    {
        if ($category->is_protected) {
            return redirect()
                ->route('categories.index')
                ->with('error', 'Esta categoria é protegida pelo sistema e não pode ser excluída.');
        }

        if ($category->articles()->exists()) {
            return redirect()
                ->route('categories.index')
                ->with('error', 'Para excluir esta categoria, é necessário excluir ou desvincular todos os artigos relacionados primeiro.');
        }

        $category->delete();

        return redirect()
            ->route('categories.index')
            ->with('success', 'Categoria excluída com sucesso.');
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
