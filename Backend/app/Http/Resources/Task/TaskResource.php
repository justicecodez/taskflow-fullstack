<?php

namespace App\Http\Resources\Task;

use App\Http\Resources\Auth\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'priority' => $this->priority,
            'due_date' => $this->due_date,
            'completed_at' => $this->completed_at,
            'created_at' => $this->created_at,
            'user' => new UserResource(
                $this->whenLoaded('user')
            ),
            'updated_at' => $this->updated_at,
        ];
    }
}
