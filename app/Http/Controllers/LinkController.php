<?php

namespace App\Http\Controllers;

use App\Models\Link;
use App\Models\LinkType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LinkController extends Controller
{
    public function index()
    {
        $types = LinkType::with('links')
            ->orderBy('name')
            ->get();

        return Inertia::render('Links/Index', [
            'types' => $types,
        ]);
    }

    public function create()
    {
        return Inertia::render('Links/Create', [
            'types' => LinkType::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url'],
            'description' => ['nullable', 'string'],
            'link_type_id' => ['nullable', 'exists:link_types,id'],
            'new_type' => ['nullable', 'string', 'max:255'],
        ]);

        if (!empty($data['new_type'])) {
            $type = LinkType::create([
                'name' => $data['new_type'],
            ]);

            $data['link_type_id'] = $type->id;
        }

        if (empty($data['link_type_id'])) {
            return back()->with('error', 'Selecione ou crie um tipo.');
        }

        Link::create([
            'name' => $data['name'],
            'url' => $data['url'],
            'description' => $data['description'] ?? null,
            'link_type_id' => $data['link_type_id'],
        ]);

        return redirect()
            ->route('links.index')
            ->with('success', 'Link criado com sucesso.');
    }
}
