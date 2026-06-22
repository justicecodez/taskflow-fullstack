<?php

namespace App\Data;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function success(
        mixed $data = null,
        string $message = 'Success',
        int $status = 200,
        array $meta = []
    ): JsonResponse {

        return response()->json([

            'success' => true,

            'message' => $message,

            'data' => $data,

            'errors' => null,

            'meta' => $meta

        ], $status);
    }



    public static function error(
        string $message,
        int $status = 400,
        array $errors = []
    ): JsonResponse {


        return response()->json([

            'success' => false,

            'message' => $message,

            'data' => null,

            'errors' => $errors,

            'meta' => []

        ], $status);
    }
}
