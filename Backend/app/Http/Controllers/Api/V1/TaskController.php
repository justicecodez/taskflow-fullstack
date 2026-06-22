<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Task\FilterTaskRequest;
use App\Http\Requests\Task\TaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\Task\TaskResource;
use App\Models\Task;
use App\Services\Task\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(FilterTaskRequest $filterTaskRequest, TaskService $taskService): JsonResponse
    {
        Gate::authorize('viewAny', Task::class);
        $validated = $filterTaskRequest->validated();
        return $taskService->getAllTask($validated);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TaskRequest $taskRequest, TaskService $taskService): JsonResponse
    {
        $validated = $taskRequest->validated();
        $response = $taskService->store($validated);
        return $response;
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task, TaskService $taskService): JsonResponse
    {
        Gate::authorize('view', $task);
        return $taskService->getTaskByid($task);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $updateTaskRequest, Task $task, TaskService $taskService): JsonResponse
    {
        Gate::authorize('update', $task);
        $validated = $updateTaskRequest->validated();
        return $taskService->update_task($task, $validated);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task, TaskService $taskService)
    {
        Gate::authorize('delete', $task);
        return $taskService->destroy($task);
    }
}
