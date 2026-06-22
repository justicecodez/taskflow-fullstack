<?php

namespace App\Http\Requests\Task;

use App\Enum\TaskPriority;
use App\Enum\TaskStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Enum;

class TaskRequest extends FormRequest
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

            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],

            'status' => [
                'sometimes',
                new Enum(TaskStatus::class),
            ],

            'priority' => [
                'sometimes',
                new Enum(TaskPriority::class),
            ],

            'due_date' => ['nullable', 'date', 'after_or_equal:today'],

        ];
    }
}
