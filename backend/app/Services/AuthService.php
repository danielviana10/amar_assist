<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AuthService
{
    public function attemptLogin(array $credentials): ?string
    {
        if (!Auth::attempt($credentials)) {
            return null;
        }

        return Auth::user()->createToken('API Token')->plainTextToken;
    }

    public function logout(Request $request): void
    {
        $request->user()->currentAccessToken()->delete();
    }
}