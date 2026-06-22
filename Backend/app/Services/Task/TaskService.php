<?php

namespace App\Services\Task;

use App\Data\ApiResponse;
use App\Enum\TaskStatus;
use App\Exceptions\Api\ApiException;
use App\Http\Resources\Task\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TaskService
{
    public function getAllTask(array $filter): JsonResponse
    {
        try {
            $query = Task::with('user')->where('user_id', Auth::id());;

            $query->when(
                isset($filter['status']),
                fn($q) => $q->where('status', $filter['status'])
            );

            $query->when(
                isset($filter['priority']),
                fn($q) => $q->where('priority', $filter['priority'])
            );

            $data = $query->paginate(2);
            return ApiResponse::success(
                data: TaskResource::collection($data),
                message: 'Success',
                status: 200,
                meta: [
                    'current_page' => $data->currentPage(),
                    'last_page' => $data->lastPage(),
                    'per_page' => $data->perPage(),
                    'total' => $data->total(),
                ]
            );
        } catch (\Throwable $th) {
            Log::error('Getting All Task Failed', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);
            return ApiResponse::error(
                message: 'Unable to get all Task',
                status: 500
            );
        }
    }

    public function store(array $data): JsonResponse
    {
        try {
            $data['user_id'] = Auth::id();
            $task = Task::create($data);
            $task->load('user');
            return ApiResponse::success(data: new TaskResource($task), message: 'Success', status: 201);
        } catch (\Throwable $th) {
            Log::error('Storing Task Failed', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);
            return ApiResponse::error(
                message: 'Unable to Store Task',
                status: 500
            );
        }
    }

    public function getTaskByid(Task $task): JsonResponse
    {
        try {
            $task->load('user');
            return ApiResponse::success(
                data: new TaskResource($task),
                message: 'Success',
                status: 200,
            );
        } catch (\Throwable $th) {
            Log::error('Getting Task By Id Failed', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);
            return ApiResponse::error(
                message: 'Unable to get Task',
                status: 500
            );
        }
    }

    public function update_task(Task $task, array $data): JsonResponse
    {
        try {
            // Business logic
            if ($task->status === TaskStatus::DONE->value) {
                throw new ApiException(
                    message: 'Completed tasks cannot be updated.',
                    statusCode: 400,
                );
            }
            if (
                isset($data['status']) &&
                $data['status'] === TaskStatus::DONE->value
            ) {
                $data['completed_at'] = now();
            }
            $task->update($data);
            $task->fresh()->load('user');
            return ApiResponse::success(
                data: $task,
                message: 'Success',
                status: 200,
            );
        } catch (\Throwable $th) {
            Log::error('Updating Task Failed', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);
            return ApiResponse::error(
                message: 'Unable to update Task',
                status: 500
            );
        }
    }

    public function destroy(Task $task): JsonResponse
    {
        try {
            $task->delete();
            return ApiResponse::success(
                data: null,
                message: 'Task deleted successfully',
                status: 200
            );
        } catch (\Throwable $th) {
            Log::error('Deleting Task Failed', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);

            return ApiResponse::error(
                message: 'Unable to delete task',
                status: 500
            );
        }
    }
}
