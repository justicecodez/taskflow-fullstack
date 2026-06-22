<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class AuthController extends Controller
{
    public function register(RegisterRequest $registerRequest, AuthService $authService): JsonResponse
    {
        $validated = $registerRequest->validated();
        $response = $authService->create_user($validated, $registerRequest);
        return $response;
    }

    public function login(LoginRequest $loginRequest, AuthService $authService): JsonResponse
    {
        $validated = $loginRequest->validated();
        $response = $authService->login_user($validated, $loginRequest);
        return $response;
    }

    public function logout(Request $request, AuthService $authService): JsonResponse
    {
        $response = $authService->logout_user($request);
        return $response;
    }
}
