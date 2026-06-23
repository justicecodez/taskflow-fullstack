<?php

namespace App\Services\Auth;

use App\Data\ApiResponse;
use App\Http\Resources\Auth\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;


class AuthService
{
    public function create_user(array $data, Request $request): JsonResponse
    {
        try {
            $data['password'] = Hash::make($data['password']);
            $user = User::create($data);
            // Create authenticated session
            Auth::login($user);

            // Prevent session fixation attacks
            $request->session()->regenerate();

            return ApiResponse::success(
                data: new UserResource($user),
                message: 'User created successfully',
                status: 201
            );
        } catch (\Throwable $th) {
            Log::error('User creation failed', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);

            return ApiResponse::error(
                message: 'An unexpected error occurred',
                status: 500
            );
        }
    }

    public function login_user(array $data, Request $request): JsonResponse
    {
        try {

            if (!Auth::attempt($data)) {

                return ApiResponse::error(
                    message: 'Invalid credentials.',
                    status: 401
                );
            }


            // Prevent session fixation
            $request->session()->regenerate();


            $user = Auth::user();


            return ApiResponse::success(
                data: new UserResource($user),
                message: 'Login successful',
                status: 200
            );
        } catch (\Throwable $th) {

            Log::error('Login Process failed', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);


            return ApiResponse::error(
                message: 'Unable to process login.',
                status: 500
            );
        }
    }

    public function logout_user(Request $request): JsonResponse
    {
        try {

            Auth::guard('web')->logout();

            $request->session()->invalidate();

            $request->session()->regenerateToken();


            return ApiResponse::success(
                message: 'Logout successful'
            );
        } catch (\Throwable $th) {

            Log::error('Logout failed', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);


            return ApiResponse::error(
                message: 'Unable to logout.',
                status: 500
            );
        }
    }
}
