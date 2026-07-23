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

## [2026-07-23] - Jest & React Testing Library Setup & Unit Tests
**Prompt:** Set up Jest and React Testing Library in this Next.js frontend project if not already configured. Then write at least 3 unit tests for the Items list component (app/items/page.tsx). Include these test cases: 1. The component renders without crashing 2. The component displays the expected number of mock items 3. Each item links to the correct detail page URL using its id. Run the tests and confirm they all pass. List every file you created or modified, and tell me if any test initially failed and what fixed it.
**Result:** Configured Jest and React Testing Library in the frontend Next.js project and created unit test suite:
- Installed `jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, and `@types/jest`.
- Configured `jest.config.ts` (using `next/jest`) and `jest.setup.ts`.
- Added `"test": "jest"` script to `package.json`.
- Created test suite `__tests__/items.test.tsx` testing rendering, item counts, and detail page URL links.
- All 3 tests passed successfully.
**Correction (if any):** None
