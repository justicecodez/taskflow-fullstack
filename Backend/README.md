# Backend Documentation

## 1. Project Overview
The backend application is a robust RESTful API developed for a Task Management System. It provides secure user authentication, role-based resource protection, and complete CRUD functionality for managing tasks, complete with filtering and structured API responses.

## 2. Technology Stack
- **Framework**: Laravel 11.x
- **Language**: PHP 8.2+
- **Authentication**: Laravel Sanctum (SPA Session-based Authentication)
- **Database**: SQLite / MySQL (depending on environment)

## 3. System Architecture
The application follows a Service-Oriented Architecture (SOA) pattern. Controllers act as thin routing layers, delegating business logic to specialized Service classes (`AuthService`, `TaskService`). Data serialization is handled via Eloquent API Resources, wrapped consistently in a custom `ApiResponse` class.

## 4. Application Flow
1. The client sends a request.
2. The router passes the request through global and route-specific middleware (e.g., Sanctum authentication, throttling).
3. The Request enters a Controller, which delegates validation to Form Requests.
4. Validated data is passed to a Service class.
5. The Service class interacts with Eloquent Models.
6. The Service returns a standardized `ApiResponse` object wrapping an API Resource back to the Controller, which is then sent to the client.

## 5. Folder Structure Explanation
- `app/Http/Controllers/Api/V1/`: Contains API controllers (`AuthController`, `TaskController`).
- `app/Http/Requests/`: Form Request validation classes (`RegisterRequest`, `LoginRequest`, `TaskRequest`, etc.).
- `app/Http/Resources/`: API Resource transformers (`TaskResource`, `UserResource`).
- `app/Services/`: Contains core business logic (`AuthService`, `TaskService`).
- `app/Data/`: Contains DTOs and standardized response wrappers (`ApiResponse`).
- `app/Enum/`: PHP Enums for status and priorities (`TaskStatus`, `TaskPriority`).
- `routes/api.php`: API endpoint definitions.

## 6. Authentication Architecture
The backend uses Laravel Sanctum configured for SPA (Single Page Application) authentication.
- **Method**: Secure HTTP-only cookies storing the session ID (`laravel_session`) and CSRF tokens (`XSRF-TOKEN`).
- **Flow**:
  1. Frontend hits `/sanctum/csrf-cookie` to initialize CSRF protection.
  2. Credentials submitted to `/api/login` or `/api/register`.
  3. `AuthService` attempts authentication (`Auth::attempt()`) and regenerates the session to prevent fixation.
  4. Subsequent requests to protected routes (`/api/task`) pass through the `auth:sanctum` middleware, verifying the cookie automatically.
- **Logout**: Invalidates the session and destroys the cookie via `Auth::logout()`.

## 7. API Documentation

### Auth Endpoints
- **GET `/sanctum/csrf-cookie`**
  - **Purpose**: Initialize CSRF protection for SPA.
  - **Auth**: None
- **POST `/api/login`**
  - **Purpose**: Authenticate user and create a session.
  - **Body**: `{ email, password }`
  - **Response**: `ApiResponse` with `UserResource`.
- **POST `/api/register`**
  - **Purpose**: Register a new user and create a session.
  - **Body**: `{ name, email, password, password_confirmation }`
  - **Response**: `ApiResponse` with `UserResource`.
- **POST `/api/logout`**
  - **Purpose**: Destroy current authenticated session.
  - **Auth**: Required (`auth:sanctum`)
- **GET `/api/user`**
  - **Purpose**: Retrieve currently authenticated user payload.
  - **Auth**: Required (`auth:sanctum`)
  - **Response**: Raw JSON `User` object (not wrapped in `ApiResponse`).

### Task Endpoints
*All task endpoints require `auth:sanctum` authentication and return a standard `ApiResponse` wrapper.*

- **GET `/api/task`**
  - **Purpose**: Fetch paginated list of the user's tasks.
  - **Query Params**: `status` (enum), `priority` (enum).
  - **Response**: Paginated `TaskResource` collection.
- **POST `/api/task`**
  - **Purpose**: Create a new task.
  - **Body**: `{ title (required), description (optional), status, priority, due_date }`
  - **Response**: Newly created `TaskResource`.
- **GET `/api/task/{task}`**
  - **Purpose**: View task details. Authorized via Policies.
  - **Response**: Single `TaskResource`.
- **PUT/PATCH `/api/task/{task}`**
  - **Purpose**: Update task details.
  - **Body**: Same as POST.
  - **Response**: Updated `TaskResource`.
- **DELETE `/api/task/{task}`**
  - **Purpose**: Delete task. Authorized via Policies.
  - **Response**: Null data, success message.

## 8. Database Schema Explanation
- **users**: Stores authentication credentials and profile information (`id`, `name`, `email`, `password`).
- **tasks**: Stores task details (`id`, `user_id`, `title`, `description`, `status` [enum string], `priority` [enum string], `due_date`, `completed_at`, timestamps).

## 9. Relationships
- **User `hasMany` Tasks**: A user can create and own multiple tasks.
- **Task `belongsTo` User**: Every task is strictly associated with a single user (`user_id` foreign key).

## 10. Security Implementation
- **Authentication**: Stateful sessions over HTTP-only secure cookies prevent XSS theft of tokens.
- **CSRF Protection**: Native Laravel CSRF tokens validated on all state-changing endpoints.
- **Authorization**: Route Policies (`Gate::authorize`) ensure users can only view, update, or delete their own tasks.
- **Rate Limiting**: `throttle:60,1` applied to API routes to prevent brute-force attacks.
- **Validation**: All inputs are strictly validated via FormRequests.

## 11. Error Handling
- The backend leverages Laravel's built-in exception handler to return JSON.
- Custom logic in `TaskService` catches `\Throwable` and returns standardized 500 errors via `ApiResponse::error`.
- Business logic exceptions (e.g., trying to update a completed task) throw `ApiException` which is presumably caught and formatted as a 400 error.
- Validation failures throw `ValidationException` resulting in 422 Unprocessable Entity responses.

## 12. Environment Setup
1. Copy `.env.example` to `.env`
2. Set database configuration (`DB_CONNECTION`, etc.).
3. Set `SANCTUM_STATEFUL_DOMAINS=localhost:5173` (or the frontend URL).
4. Set `SESSION_DOMAIN=localhost`.
5. Set `VITE_APP_URL="http://localhost:5173"` (or frontend url)

## 13. Running the Backend
```bash
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

