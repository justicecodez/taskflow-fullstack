# Frontend Documentation

## 1. Project Overview
The frontend is a single-page application (SPA) built to consume the Laravel Task Management API. It provides a seamless, developer-quality user interface for registering, authenticating, and managing tasks with comprehensive filtering and CRUD capabilities.

## 2. Technology Stack
- **Library**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Utilities**: `date-fns` (Date formatting), `clsx` & `tailwind-merge` (CSS class merging)

## 3. Folder Structure
- `src/components/`: Reusable, stateless UI components (`Button`, `Input`, `Select`, `Navbar`, `TaskCard`, `ProtectedRoute`).
- `src/context/`: Global React Context providers (`AuthContext.jsx`).
- `src/pages/`: Route-level view components (`Login`, `Register`, `Dashboard`, `TaskForm`).
- `src/services/`: Centralized API logic and Axios configuration (`api.js`, `authService.js`, `taskService.js`).
- `src/utils/`: Utility functions (`cn.js` for tailwind classes).

## 4. Architecture Explanation
The frontend employs a component-based architecture with a clear separation of concerns:
- **UI Layer**: React components styled with Tailwind CSS.
- **State Layer**: Context API for global state (Authentication) and React hooks (`useState`, `useEffect`) for local component state.
- **Service Layer**: Dedicated services abstract away HTTP request complexities, making components leaner and easier to test.

## 5. Routing
Managed by `react-router-dom`:
- **Public Routes**: `/login`, `/register` (redirect to `/dashboard` if authenticated).
- **Protected Routes**: `/dashboard`, `/tasks/create`, `/tasks/:id/edit` (wrapped by `<ProtectedRoute />` guarding against unauthenticated access).
- **Fallback**: Wildcard route redirecting to Dashboard or Login based on auth state.

## 6. Authentication Flow
The frontend implements Laravel Sanctum SPA Authentication.
1. **CSRF Initialization**: Before `POST` actions to login/register, `authService` fetches `/sanctum/csrf-cookie`.
2. **Login/Register**: User submits credentials. Backend validates and returns an HTTP-only secure cookie (`laravel_session`).
3. **Session Persistence**: The `AuthContext` mounts and checks `/api/user`. If successful, the user is authorized. Tokens are *never* stored in `localStorage` or JavaScript memory.
4. **Logout**: API call to `/logout` clears the backend session, and the frontend resets the global user state.

## 7. API Integration
- **Client Configuration (`api.js`)**: An Axios instance is configured with `withCredentials: true` to automatically send the session cookie and CSRF headers with every request.
- **Services**: `taskService` and `authService` abstract endpoint paths.
- **Response Handling**: The application cleanly extracts data from Laravel's custom nested `ApiResponse` structure (e.g., unwrapping `response.data.data` for API Resources and paginated collections).

## 8. Components Overview
- **`Button`, `Input`, `Select`**: Fully accessible, reusable form components wrapping native HTML elements with consistent Tailwind styling and validation error states.
- **`TaskCard`**: Displays individual task data, formatted due dates, and status/priority badges. Emits delete actions.
- **`Navbar`**: Responsive top navigation displaying the logo, authenticated user name, and logout controls.
- **`ProtectedRoute`**: Evaluates `AuthContext` loading and user states to protect child routes.

## 9. State Management
- **AuthContext**: Manages the global `user` object and `loading` boolean. Exposes `login`, `register`, and `logout` methods globally.
- **Local State**: Used within `Dashboard` (filtering, task lists) and `TaskForm` (form fields, validation errors) via `useState`.

## 10. Styling Approach
- **Tailwind CSS v4**: Utility-first CSS framework enabling rapid, inline UI development.
- **Class Merging**: `clsx` and `tailwind-merge` utility (`cn.js`) is used to predictably combine base component classes with custom overrides.
- **Responsive Design**: Utilizing `sm:`, `md:`, and `lg:` prefixes to adjust layouts (e.g., stacking grids, hiding elements) across device sizes.

## 11. Error Handling
- **Validation Errors (422)**: Caught in `try/catch` blocks. The response `.errors` payload is parsed and mapped back to individual form inputs (e.g., `setValidationErrors`).
- **Server Errors (500/401)**: Generic error messages are displayed at the top of forms or through console logs.
- **API Defense**: Components defensively access nested data using `|| {}` fallbacks.

## 12. Environment Setup
Create a `.env` file in the `frontend` root:
```env
VITE_API_URL=http://localhost:8000/api
```

## 13. Running Frontend
```bash
npm install
npm run dev
```


