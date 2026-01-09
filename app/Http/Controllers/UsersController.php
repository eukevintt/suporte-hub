<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Inertia\Inertia;

final class UsersController extends Controller
{
    public function index(Request $request)
    {
        $actor = $request->user();
        $actorRole = $actor->role;

        $usersQuery = User::query()
            ->select(['id', 'name', 'email', 'role', 'permissions', 'must_change_password', 'created_at'])
            ->orderBy('id', 'desc');

        if ($actorRole === 'admin') {
            $usersQuery->where('role', '!=', 'superadmin');
        }

        return Inertia::render('Users/Index', [
            'users' => $usersQuery
                ->paginate(10)
                ->withQueryString(),
            'roles' => $this->allowedRolesFor($actorRole),
        ]);
    }

    public function store(Request $request)
    {
        $actorRole = $request->user()->role;
        $allowedRoles = $this->allowedRolesFor($actorRole);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', Rule::in($allowedRoles)],
            'can_review_articles' => ['sometimes', 'boolean'],
        ]);

        $plainPassword = Str::random(12);

        $permissions = [];
        if (!empty($data['can_review_articles'])) {
            $permissions[] = 'review-articles';
        }

        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
            'permissions' => $permissions,
            'password' => Hash::make($plainPassword),
            'must_change_password' => true,
        ]);

        return redirect()
            ->route('users.index')
            ->with('generated_password', [
                'email' => $data['email'],
                'password' => $plainPassword,
            ]);
    }

    public function edit(User $user, Request $request)
    {
        $actor = $request->user();

        if ($actor->role === 'admin' && $user->role === 'superadmin') {
            abort(403);
        }

        return Inertia::render('Users/Edit', [
            'user' => $user->only(['id', 'name', 'email', 'role', 'permissions', 'must_change_password']),
            'roles' => $this->allowedRolesFor($actor->role),
        ]);
    }

    public function update(User $user, Request $request)
    {
        $actor = $request->user();
        $actorRole = $actor->role;
        $allowedRoles = $this->allowedRolesFor($actorRole);

        if ($actorRole === 'admin' && $user->role === 'superadmin') {
            abort(403);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', Rule::in($allowedRoles)],
            'must_change_password' => ['required', 'boolean'],
            'can_review_articles' => ['sometimes', 'boolean'],

            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $payload = [
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
            'must_change_password' => $data['must_change_password'],
        ];

        $permissions = $user->permissions ?? [];
        if (!is_array($permissions)) {
            $permissions = [];
        }

        $wantsReview = !empty($data['can_review_articles']);

        if ($wantsReview) {
            if (!in_array('review-articles', $permissions, true)) {
                $permissions[] = 'review-articles';
            }
        } else {
            $permissions = array_values(array_filter(
                $permissions,
                fn ($p) => $p !== 'review-articles'
            ));
        }

        $payload['permissions'] = $permissions;

        if (!empty($data['password'])) {
            $payload['password'] = Hash::make($data['password']);
            $payload['must_change_password'] = true;
        }

        $user->update($payload);

        return redirect()->route('users.index');
    }

    public function destroy(User $user, Request $request)
    {
        $authId = $request->user()->id;

        if ($user->id === $authId) {
            return redirect()->route('users.index');
        }

        if ($user->role === 'superadmin') {
            return redirect()->route('users.index');
        }

        $user->delete();

        return redirect()->route('users.index');
    }

    private function allowedRolesFor(string $actorRole): array
    {
        return $actorRole === 'superadmin'
            ? ['admin', 'n1', 'n2', 'n3']
            : ['n1', 'n2', 'n3'];
    }
}
