<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Article;
use Inertia\Inertia;
use Inertia\Response;

class UserProfileController extends Controller
{
    public function show(User $user): Response
    {
        $publishedCount = Article::query()
            ->where('author_id', $user->id)
            ->where('status', 'published')
            ->count();

        return Inertia::render('Profile/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role,
            ],
            'stats' => [
                'published_count' => $publishedCount,
            ],
        ]);
    }
}
