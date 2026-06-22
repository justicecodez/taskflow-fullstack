# Full Stack Task Management Application

## 1. Project Overview
This project is a complete, production-ready Full Stack Task Management Application developed as an interview assessment. It provides a secure, intuitive environment for users to create, track, and manage their daily tasks. The application pairs a robust Laravel backend with a modern React frontend.

## 2. Features
- **User Authentication**: Secure registration, login, and session-based authentication.
- **Task Management**: Full CRUD operations (Create, Read, Update, Delete) for tasks.
- **Filtering**: Dynamic frontend filtering by Task Status (To Do, In Progress, Done) and Priority (Low, Medium, High).
- **Pagination**
- **Responsive Interface**: A developer-quality, mobile-friendly UI built with Tailwind CSS.
- **Dashboard Analytics**: Quick statistical summary of Total, Pending, and Completed tasks.

## 3. System Architecture
The system operates on a decoupled client-server architecture:

```text
[ React Frontend (Vite) ]  <-- (JSON over HTTP + Secure Cookies) -->  [ Laravel REST API ]  <-->  [ SQL Database ]
```

1. **Frontend**: An SPA that handles all UI rendering, routing, and form validation states locally.
2. **API Communication**: The frontend interacts statelessly with the backend over HTTP, utilizing Laravel Sanctum to maintain secure session cookies.
3. **Backend**: A Laravel API handling business logic, data validation, and database operations.

## 4. Technology Stack
**Frontend**:
- React 19
- React Router v7
- Tailwind CSS v4
- Vite
- Axios

**Backend**:
- Laravel 11.x
- PHP 8.2+
- Laravel Sanctum
- MySQL

## 5. Project Structure
The repository is split into two primary directories:
- `/Backend`: Contains the Laravel application, defining all API routes, database migrations, controllers, and services.
- `/frontend`: Contains the React SPA, encompassing all UI components, state management, and asset compilation.

## 6. Complete Setup Instructions

### Backend Setup
1. Navigate to the backend directory: `cd Backend`
2. Install dependencies: `composer install`
3. Configure environment:
   - Copy `.env.example` to `.env`
   - Generate app key: `php artisan key:generate`
   - Set database credentials (e.g., `DB_CONNECTION=sqlite` or `DB_CONNECTION=mysql`)
   - Set CORS/Sanctum configuration: `SANCTUM_STATEFUL_DOMAINS=localhost:5173`
4. Run migrations: `php artisan migrate`
5. Start the server: `php artisan serve` (defaults to `http://localhost:8000`)

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Configure environment:
   - Create a `.env` file: `echo "VITE_API_URL=http://localhost:8000/api" > .env`
4. Start the development server: `npm run dev` (defaults to `http://localhost:5173`)

## 7. API Communication Overview
The frontend communicates with the backend exclusively through Axios. 
- All requests have `withCredentials: true` enabled.
- Data is primarily exchanged in JSON format.
- The Laravel backend wraps successful data responses in a standardized `ApiResponse` object (`{ success: true, data: {...} }`). The frontend service layer handles unwrapping this payload seamlessly.
- Validation errors are returned as `422 Unprocessable Entity` containing an `errors` object, which the React forms bind directly to inputs.

## 8. Authentication Overview
The application utilizes **Laravel Sanctum SPA Authentication**, meaning it relies on secure, HTTP-only session cookies rather than exposing JWTs to Javascript memory or `localStorage`.
- The frontend first pings `/sanctum/csrf-cookie` to establish CSRF protection.
- Credentials are submitted to `/api/login`.
- Upon success, the browser automatically stores the session cookie.
- The frontend application checks `/api/user` on load to verify the presence of a valid session cookie and authorize the user context.

## 9. Database Overview
The database is strictly relational:
- `users`: Stores user credentials.
- `tasks`: Stores tasks. Includes a `user_id` foreign key referencing the `users` table. 
- Strict Eloquent relationships (`belongsTo` / `hasMany`) ensure data integrity, and route Policies guarantee users cannot access or mutate tasks belonging to other accounts.

## 10. Development Decisions
- **Service Pattern**: Business logic in both the frontend and backend is abstracted into dedicated "Service" files. This keeps Controllers and React components clean and focused strictly on request/response handling and rendering, respectively.
- **Custom Responses**: Utilizing a unified `ApiResponse` wrapper in Laravel standardizes error handling across the entire API.
- **Tailwind Utility Classes**: A utility-first CSS approach was chosen for rapid prototyping, keeping styling local to the component structure without bloating stylesheets.

## 11. Security Considerations
- **XSS Mitigation**: Using HTTP-only cookies mitigates the risk of Cross-Site Scripting (XSS) attacks stealing authentication tokens.
- **CSRF Mitigation**: Native Laravel CSRF tokens are integrated into the Axios pipeline.
- **Data Protection**: Route model binding combined with Laravel Policies (`Gate::authorize`) ensures proper horizontal authorization across all resources.



## 13. Author / Project Information
Developed as part of a Full Stack Developer interview assessment.

## 14
live demo