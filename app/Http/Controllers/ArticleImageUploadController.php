<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ArticleImageUploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => [
                'required',
                'file',
                'max:5120',
                'mimes:jpg,jpeg,png,webp',
            ],
        ]);

        $file = $request->file('file');

        $manager = new ImageManager(new Driver());
        $image = $manager->read($file->getPathname());

        $image->scaleDown(width: 1600, height: 1600);

        $encoded = $image->toWebp(80);

        $articleId = $request->input('article_id');

        if ($articleId) {
            $folder = "articles/{$articleId}/images";
        } else {
            $folder = 'articles/tmp/' . $request->user()->id;
        }

        $name = Str::uuid()->toString() . '.webp';
        $path = $folder . '/' . $name;

        Storage::disk('public')->put($path, (string) $encoded);

        return response()->json([
            'location' => Storage::url($path),
        ]);
    }
}
