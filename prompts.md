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

## [2026-07-31] - Serializer Validation & HTTP Status Code Enforcement
**Prompt:** Add explicit input validation to the Note serializer in this Django REST Framework project. Add the following validation rules:
1. The title field is required and cannot be empty or just whitespace, minimum 3 characters
2. The content field is required and cannot be empty or just whitespace, minimum 5 characters
3. Return a clear, field-specific error message when validation fails (e.g., "Title must be at least 3 characters")

Also confirm and explicitly handle these HTTP status code cases across the Notes API:
1. 201 when a note is successfully created
2. 200 when a note is successfully fetched or updated
3. 204 when a note is successfully deleted
4. 400 when validation fails on create or update
5. 404 when a requested note id does not exist

Show me the exact validation logic added to the serializer, and confirm each status code is correctly returned by testing the relevant scenario.
**Result:** Added input validation rules to `NoteSerializer` and added automated test suite covering all HTTP status codes:
- Implemented `validate_title` and `validate_content` in `notes/serializers.py` to enforce non-empty/non-whitespace validation, minimum title length (3 characters), and minimum content length (5 characters) with clear field-specific error messages.
- Configured `CharField` with `required=True` and `allow_blank=True` so custom validation methods format empty/whitespace field errors.
- Created `NoteAPITests` in `notes/tests.py` covering status codes `201 CREATED`, `200 OK` (list/retrieve/update), `204 NO CONTENT` (delete), `400 BAD REQUEST` (validation errors), and `404 NOT FOUND` (non-existent IDs). All 10 tests passed cleanly (`OK`).
**Correction (if any):** None

## [2026-07-31] - Ruff Linter Setup & Fixes
**Prompt:** Set up ruff as the linter for this Django backend project. Add a configuration file with sensible defaults for a Django project (things like ignoring migration files from strict checks, since those are auto-generated). Then run the linter across the whole backend codebase and fix every warning and error until there is a clean lint pass. List every file you created, modified, or fixed, and summarize what kinds of issues were found.
**Result:** Configured Ruff linter and resolved all lint errors across the backend codebase:
- Created `pyproject.toml` in `backend/` with sensible Django configurations (`target-version = "py313"`, `line-length = 88`, rule selections `["E", "F", "W", "I"]`, and per-file ignores for auto-generated `migrations/*` and `config/settings.py`).
- Refactored `backend/notes/serializers.py` to fix `E501` line length violations.
- Refactored `backend/notes/tests.py` to fix `E501` line length violations and organize imports according to `isort` / PEP 8 standards.
- Achieved a 100% clean lint pass (`All checks passed!`).
**Correction (if any):** None



