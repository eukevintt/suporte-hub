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
        $types = LinkType::with(['links' => function ($query) {
            $query->orderBy('name');
        }])
            ->whereHas('links')
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

    public function manage()
    {
        $links = Link::with('type')
            ->orderBy('name')
            ->get();

        return Inertia::render('Links/Manage', [
            'links' => $links,
        ]);
    }

    public function edit(Link $link)
    {
        return Inertia::render('Links/Edit', [
            'link' => $link,
            'types' => LinkType::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Link $link)
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

        $link->update([
            'name' => $data['name'],
            'url' => $data['url'],
            'description' => $data['description'] ?? null,
            'link_type_id' => $data['link_type_id'],
        ]);

        return redirect()
            ->route('links.manage')
            ->with('success', 'Link atualizado com sucesso.');
    }

    public function destroy(Link $link)
    {
        $link->delete();

        return redirect()
            ->route('links.manage')
            ->with('success', 'Link removido com sucesso.');
    }

    public function manageTypes()
    {
        $types = LinkType::withCount('links')
            ->orderBy('name')
            ->get();

        return Inertia::render('Links/TypesManage', [
            'types' => $types,
        ]);
    }

    public function editType(LinkType $linkType)
    {
        return Inertia::render('Links/TypeEdit', [
            'type' => $linkType,
        ]);
    }

    public function updateType(Request $request, LinkType $linkType)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $linkType->update([
            'name' => $data['name'],
        ]);

        return redirect()
            ->route('links.types.manage')
            ->with('success', 'Tipo atualizado com sucesso.');
    }

    public function destroyType(LinkType $linkType)
    {
        if ($linkType->links()->exists()) {
            return redirect()
                ->route('links.types.manage')
                ->with('error', 'Não é possível apagar um tipo que possui links cadastrados.');
        }

        $linkType->delete();

        return redirect()
            ->route('links.types.manage')
            ->with('success', 'Tipo removido com sucesso.');
    }
}
