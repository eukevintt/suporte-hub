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
        return Inertia::render('Users/Index', [
            'users' => User::query()
                ->select(['id', 'name', 'email', 'role', 'must_change_password', 'created_at'])
                ->orderBy('id', 'desc')
                ->paginate(10)
                ->withQueryString(),
            'roles' => $this->allowedRolesFor($request->user()->role),
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
        ]);

        $plainPassword = Str::random(12);

        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
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
        return Inertia::render('Users/Edit', [
            'user' => $user->only(['id', 'name', 'email', 'role', 'must_change_password']),
            'roles' => $this->allowedRolesFor($request->user()->role),
        ]);
    }

    public function update(User $user, Request $request)
    {
        $actorRole = $request->user()->role;
        $allowedRoles = $this->allowedRolesFor($actorRole);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', Rule::in($allowedRoles)],
            'must_change_password' => ['required', 'boolean'],
        ]);

        $user->update($data);

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
