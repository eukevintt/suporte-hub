<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RedirectIfPasswordAlreadyChanged
{
    public function handle(Request $request, Closure $next)
    {
        if (auth()->check() && !auth()->user()->must_change_password) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
