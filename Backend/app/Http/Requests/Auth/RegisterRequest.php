<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|max:255|string',
            'email' => 'required|unique:users|email',
            'password' => 'required|min:8|string|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Your name is required.',
            'name.max' => 'Your name cannot be more than 255 characters.',

            'email.required' => 'Email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'An account with this email already exists.',

            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters long.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];
    }

    public function attributes(): array
    {
        return [
            'email' => 'email address',
            'password' => 'password',
        ];
    }
}
