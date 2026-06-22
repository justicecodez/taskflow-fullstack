<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use App\Data\ApiResponse;

use App\Exceptions\Api\ApiException;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
        $middleware->preventRequestForgery(except: [
            'api/*',
            'sanctum/csrf-cookie',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn(Request $request) => $request->is('api/*'),
        );

        // Validation errors (422)
        $exceptions->render(function (
            ValidationException $e,
            $request
        ) {

            return ApiResponse::error(

                'Validation failed',

                422,

                $e->errors()

            );
        });

        // Not found (404)
        $exceptions->render(function (
            ModelNotFoundException $e,
            Request $request
        ) {

            return ApiResponse::error(
                'Resource not found',
                404
            );
        });



        // Unauthenticated (401)
        $exceptions->render(function (
            AuthenticationException $e,
            Request $request
        ) {

            return ApiResponse::error(
                'Unauthenticated',
                401
            );
        });



        // Forbidden (403)
        $exceptions->render(function (
            AuthorizationException $e,
            Request $request
        ) {

            return ApiResponse::error(
                'You do not have permission',
                403
            );
        });



        /*
        Your own business exceptions
        */
        $exceptions->render(function (
            ApiException $e,
            Request $request
        ) {

            return ApiResponse::error(
                $e->getMessage(),
                $e->statusCode,
                $e->errors
            );
        });



        /*
        Anything else
        */
        $exceptions->render(function (
            Throwable $e,
            Request $request
        ) {


            report($e);


            return ApiResponse::error(
                config('app.debug')
                    ? $e->getMessage()
                    : 'Internal server error',
                500
            );
        });
    })->create();
