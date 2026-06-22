<?php

namespace App\Http\Requests\Task;

use App\Enum\TaskPriority;
use App\Enum\TaskStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Enum;

class FilterTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => [
                'nullable',
                new Enum(TaskStatus::class),
            ],

            'priority' => [
                'nullable',
                new Enum(TaskPriority::class),
            ],
        ];
    }
}
