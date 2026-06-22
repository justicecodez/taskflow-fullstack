<?php

namespace App\Http\Requests\Task;

use App\Enum\TaskPriority;
use App\Enum\TaskStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Enum;

class UpdateTaskRequest extends FormRequest
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
            'title' => ['sometimes', 'required', 'string', 'max:255'],

            'description' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'status' => [
                'sometimes',
                'required',
                new Enum(TaskStatus::class),
            ],

            'priority' => [
                'sometimes',
                'required',
                new Enum(TaskPriority::class),
            ],

            'due_date' => [
                'sometimes',
                'nullable',
                'date',
            ],
        ];
    }
}
