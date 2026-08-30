## [2026-07-22] - Next.js App Router Fundamentals SPA

**Prompt:** In the frontend folder of this project, using the Next.js App Router, build a small SPA with the following:

1. A shared layout in app/layout.tsx that includes a persistent navigation bar with links to Home and Items. This layout should wrap every page so the nav stays visible across all routes.
2. A Home route at app/page.tsx that displays a simple welcome heading.
3. An Items list route at app/items/page.tsx that displays a list of at least 3 mock items (id and name), each linking to its own detail page at /items/[id].
4. A dynamic Item detail route at app/items/[id]/page.tsx that reads the id from the URL params and displays which item is being viewed.
   Keep the styling minimal and inline, this is for a fundamentals assignment, not production UI. After building this, tell me exactly which files you created or modified.
   **Result:** Created the small Next.js SPA utilizing App Router:

- Modified `app/layout.tsx` to add a shared persistent navigation header with `Home` and `Items` links.
- Modified `app/page.tsx` with a simple welcome heading.
- Created `app/items/page.tsx` rendering a list of 4 mock items linked to `/items/[id]`.
- Created `app/items/[id]/page.tsx` reading `id` from route params to display the item detail view.
  **Correction (if any):** None

## [2026-07-22] - Minimal Clean UI Styling

**Prompt:** Style the frontend app minimally and cleanly. Use simple, consistent spacing, a readable font stack, subtle borders, and a neutral color palette (no gradients, no glassmorphism, no generic AI-styled UI). Keep the nav bar clean and the layout uncluttered. Avoid over-designing, this should look like a real developer's simple, functional UI, not a flashy AI generated template.
**Result:** Styled the frontend application with a minimal, clean developer UI:

- Updated `app/globals.css` with a neutral color scheme and readable system font stack.
- Refactored `app/layout.tsx` with a centered max-width layout container, uncluttered header navbar, and subtle borders.
- Styled `app/page.tsx`, `app/items/page.tsx`, and `app/items/[id]/page.tsx` with consistent typography, neutral card containers, and clean spacing.
  **Correction (if any):** None

## [2026-07-22] - Controlled Item Creation Form with Validation

**Prompt:** In the frontend, on the /items page, add a form to create a new item with two fields: "name" (text) and "description" (text). Make both inputs controlled with React state. Add client-side validation: 1. Name is required and must be at least 3 characters 2. Description is required. Show a clear inline error message under any field that fails validation when the form is submitted, and prevent submission until both fields are valid. On successful submission, add the new item to the existing mock items list and clear the form. Style the form to match the existing minimal, clean styling already used elsewhere in the app...
**Result:** Implemented a controlled form with client-side validation on `/items` route (`app/items/page.tsx`):

- Added controlled state for `name`, `description`, and `errors`.
- Added validation requiring name (min 3 chars) and description.
- Displayed subtle inline error messages under invalid inputs.
- Appended new items to local state list and cleared the form on successful submit.
  **Correction (if any):** None

## [2026-07-22] - Setup ESLint & Prettier Integration

**Prompt:** Set up ESLint and Prettier in the frontend Next.js project. Configure them to work together without conflicting rules. Use sensible, commonly recommended defaults for a TypeScript + Next.js project. Then run the linter across the whole project and fix every warning and error until there is a clean lint pass. List every file you created, modified, or fixed, and summarize what kinds of issues were found and corrected.
**Result:** Installed and configured Prettier with ESLint 9 Flat Config:

- Installed `prettier` and `eslint-config-prettier`.
- Configured `eslint.config.mjs` with `eslintConfigPrettier` to turn off conflicting ESLint formatting rules.
- Created `.prettierrc` (sensible defaults) and `.prettierignore`.
- Updated `package.json` with `format` and `format:check` scripts.
- Ran ESLint (passed cleanly with 0 errors/warnings) and Prettier across all codebase files.
  **Correction (if any):** None

## [2026-07-27] - Granular Unit Tests for Items Page

**Prompt:** Add granular unit tests for the Items page in this Next.js frontend project, expanding on the existing test suite. Cover the following specific cases, each as its own separate test: 1. Renders the correct initial number of mock items on page load 2. Successfully adds a new item when the form is submitted with valid, unique data 3. Blocks submission and shows an inline error when the name field is empty or whitespace only 4. Blocks submission and shows an inline error when a duplicate name (case-insensitive) is submitted 5. Automatically assigns the correct next id based on the highest existing id, not the list length 6. Successfully deletes an item when its delete button is clicked 7. After deleting the item with the highest id, confirms a newly added item still receives a unique, non-colliding id 8. After deleting an item from the middle of the list, confirms the remaining items keep their original ids unchanged 9. Confirms the form resets and clears any error messages after a successful submission. Write each as an individual, clearly named test case rather than combining multiple checks into one test. Run all tests and confirm they pass. List every file created or modified, and tell me the final total number of passing tests.
**Result:** Expanded test suite into 9 individual, granular unit tests in `__tests__/items.test.tsx`:

- Covered rendering initial items, valid addition, empty/whitespace validation, case-insensitive duplicate checking, highest-ID resolution vs list length, item deletion, ID collision safety after highest ID deletion, middle item deletion ID preservation, and form/error resetting.
- All 9 unit tests passed cleanly (`PASS`).
  **Correction (if any):** None

## [2026-07-30] - Django REST Framework Notes CRUD API Setup

**Prompt:** Set up a new Django project with Django REST Framework in the backend folder. Create one app inside the project called "notes". Build a full CRUD REST API for a Notes resource with the following:

1. A Note model with fields: title (text), content (text), created_at (auto timestamp)
2. Add a ForeignKey relationship from Note to Django's built in User model, so each note belongs to one user
3. A DRF serializer for the Note model
4. A ViewSet or set of API views providing all 4 CRUD operations: create, list, retrieve one, update, delete
5. URL routing connecting these views to /api/notes/ and /api/notes/<id>/
6. Run the initial migrations so the database tables are created

Use SQLite for the database, keep this simple, no need for a production database yet. After setup, tell me exactly which files you created and what each one does.
**Result:** Initialized Django project `config` in `backend/` and created `notes` app with DRF CRUD API:

- Installed `django` and `djangorestframework` in `backend/venv`.
- Created Django project configuration in `backend/config/` and updated `INSTALLED_APPS` and URL routing (`/api/notes/`, `/api/notes/<id>/`).
- Defined `Note` model in `notes/models.py` with `title`, `content`, `created_at`, and `user` ForeignKey.
- Defined `NoteSerializer` in `notes/serializers.py`.
- Built `NoteViewSet` in `notes/views.py` using `ModelViewSet` for full CRUD operations.
- Set up router in `notes/urls.py` attached to `config/urls.py`.
- Executed `makemigrations` and `migrate` to initialize SQLite database tables.
  **Correction (if any):** None

## [2026-08-07] - Ignore and Untrack **pycache**

**Prompt:** Add **pycache**/ and *.pyc to the .gitignore file for this project, if not already present. Then remove any already-tracked **pycache** folders from git's tracking across the entire repository without deleting the actual files from disk. Show me the exact git commands you ran and confirm no **pycache** folders remain tracked by git.
**Result:** Added `__pycache__/` and `*.pyc` to [.gitignore](file:///E:/Remote%20Internship/arbisoft-internship/.gitignore) and untracked all `__pycache__` directories using `git rm -r --cached "*__pycache__*"`. Verified using `git ls-files "*__pycache__*"` that no `__pycache__` folders remain tracked while leaving the actual files intact on disk.
**Correction (if any):** None

## [2026-08-07] - Environment Variables Setup for Backend & Conftest

**Prompt:** Set up python-decouple (or python-dotenv, whichever fits this project better) to load environment variables from a .env file in this Django backend project. Create a .env file with TEST_USER_USERNAME and TEST_USER_PASSWORD variables, and a .env.example file with placeholder values (no real credentials) so the structure is documented for other developers. Update backend/notes/conftest.py to read the test user's username and password from these environment variables instead of hardcoding them. Make sure .env is already excluded in .gitignore, if not, add it. Show me the exact code changes.
**Result:** Configured `python-decouple` in `backend/`:

- Installed `python-decouple` and `python-dotenv` and created `backend/requirements.txt`.
- Created `backend/.env` with `TEST_USER_USERNAME` and `TEST_USER_PASSWORD`.
- Created `backend/.env.example` with non-sensitive placeholders.
- Created `backend/notes/conftest.py` loading `TEST_USER_USERNAME` and `TEST_USER_PASSWORD` using `decouple.config`.
- Confirmed `.env` is excluded in `.gitignore`.
- Created `backend/pytest.ini` and updated `backend/notes/tests.py` to verify passing test suite.
  **Correction (if any):** None

## [2026-08-13] - Connect Next.js Frontend to Django REST Framework JWT Auth & Notes API

**Prompt:** Connect this Next.js frontend to the Django REST Framework backend's JWT authentication and Notes API. Implement the following:

1. A registration form (username, password) that calls the backend's registration endpoint
2. A login form (username, password) that calls the backend's JWT login endpoint, and stores the returned access token securely (use an httpOnly cookie if the backend supports setting one, otherwise store in memory/localStorage and explain the tradeoff)
3. Attach the JWT access token as an Authorization Bearer header on all requests to protected Notes endpoints
4. Replace the current mock Items/Notes data with real API calls to the Django backend for all CRUD operations: list, create, update, delete
5. Handle three distinct states on every API call: loading, success, and error, show a loading indicator during the request, and a clear inline error message if the request fails (e.g., invalid login, expired token, validation error from the backend)
6. Add a logout function that clears the stored token and redirects to the login page
7. Protect the Notes routes so an unauthenticated user is redirected to the login page if they try to access them directly
8. Handle CORS properly between the Next.js frontend (localhost:3000) and Django backend (localhost:8000) if not already configured on the backend

After implementation, tell me exactly which files were created or modified, and explain how the JWT token flow works end to end (login → token storage → attaching it to requests → what happens when it expires).
**Result:** Connected Next.js frontend to Django REST Framework backend:

- Created `frontend/app/register/page.tsx` with registration form calling `http://localhost:8000/api/register/`.
- Updated `frontend/app/login/page.tsx` with login form calling `http://localhost:8000/api/token/` and storing access/refresh tokens in `localStorage`.
- Created `frontend/app/lib/api.ts` (`fetchWithAuth`) interceptor to automatically attach `Authorization: Bearer <token>` and handle 401 session expiration redirects.
- Updated `frontend/app/items/page.tsx` replacing mock data with real API calls for all CRUD operations (List, Create, Inline Edit/Update, Delete), protected route redirect for unauthenticated users, and loading/success/error UI states.
- Created `frontend/app/context/AuthContext.tsx` providing global auth state and `logout()` function.
- Updated `frontend/app/layout.tsx` wrapping the application in `<AuthProvider>` with a dynamic Auth Navbar.
  **Correction (if any):** Wrapped RootLayout in `<AuthProvider>` in `app/layout.tsx` to resolve Context provider error.

## [2026-08-16] - Next.js Frontend Notes Search Integration with Debouncing

**Prompt:** The Django backend already has a search feature implemented using django-filter on the Notes API, exposing a query parameter (e.g. ?search=keyword) that filters notes by title/content. Do not modify the backend.

Integrate this search functionality into the Next.js frontend Notes page:

1. Add a search input field above the Notes list
2. Debounce the input (around 300-500ms) so the API isn't called on every keystroke, only after the user pauses typing
3. On each debounced input change, call the backend's search endpoint with the current search term as a query parameter, and update the displayed notes list with the results
4. Handle three states clearly: loading (show a subtle loading indicator while the search request is in flight), success (display the filtered results), and error (show an inline error message if the request fails)
5. Handle the empty state: if the search returns zero results, show a clear "No notes found" message instead of an empty blank list
6. When the search input is cleared, reset the list back to showing all notes (call the endpoint with no search param, or the original unfiltered list endpoint)
7. Make sure the JWT auth token already used for other Notes requests is also attached to this search request

After implementation, tell me exactly which files were created or modified, and explain how the debounce logic works.
**Result:** Integrated debounced search into the Next.js Notes page:

- Created `frontend/app/lib/useDebounce.ts` implementing a generic 400ms debounce hook with timer cleanup.
  **Correction (if any):** Fixed backend query parameter mismatch where the frontend was requesting `?search=` instead of the backend's declared `NoteFilter` parameter `?title=`, which caused `django-filter` to ignore the query and return the full unfiltered notes list.
