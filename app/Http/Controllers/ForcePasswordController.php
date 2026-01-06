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
    ]);

    $user = auth()->user();

    $user->update([
        'password' => Hash::make($request->password),
        'must_change_password' => false,
    ]);

    return redirect()->route('dashboard');
}
}
