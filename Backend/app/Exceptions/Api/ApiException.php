<?php

namespace App\Exceptions\Api;

use Exception;

class ApiException extends Exception
{
    public function __construct(
        string $message = "Something went wrong",
        public int $statusCode = 400,
        public array $errors = []
    ) {
        parent::__construct($message);
    }
}
