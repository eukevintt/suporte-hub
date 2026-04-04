<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ForcePasswordController extends Controller
{
    public function edit()
{
    return Inertia::render('Auth/ForcePasswordChange');
}

public function update(Request $request)
{
    $request->validate([
        'password' => ['required', 'confirmed', 'min:8'],
    ], [
        'password.required' => 'A senha é obrigatória.',
        'password.confirmed' => 'As senhas não coincidem.',
        'password.min' => 'A senha deve ter pelo menos 8 caracteres.',
    ]);

    $user = auth()->user();

    $user->update([
        'password' => Hash::make($request->password),
        'must_change_password' => false,
    ]);

    return redirect()->route('dashboard');
}
}
