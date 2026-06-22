<?php

namespace App\Models;

use App\Enum\TaskPriority;
use App\Enum\TaskStatus;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
        'priority',
        'due_date'
    ];

    protected function casts(): array
    {
        return [
            'status' => TaskStatus::class,
            'priority' => TaskPriority::class,
            'due_date' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
