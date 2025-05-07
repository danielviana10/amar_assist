<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only(['email', 'password']);

        $token = $this->authService->attemptLogin($credentials);

        if (!$token) {
            return response()->json(['error' => 'Credenciais inválidas'], 401);
        }

        return response()->json(['token' => $token]);
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request);

        return response()->json(['message' => 'Logout realizado com sucesso']);
    }
}