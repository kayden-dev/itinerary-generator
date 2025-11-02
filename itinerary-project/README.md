# Running the `generate` Supabase Function Locally

This repository includes a Supabase Edge Function (`supabase/functions/generate`) that powers itinerary generation.

## Prerequisites

- **Supabase CLI** v1.175+

  - macOS: `brew install supabase/tap/supabase`
  - Windows: `scoop install supabase` or `choco install supabase`
  - Linux: `curl -fsSL https://supabase.com/cli/install | sh`

- **Postman** (desktop app) if you plan to run the bundled API tests.
- **Docker** Desktop

  > The Supabase CLI bundles the correct Deno runtime, so you do not need Node, npm, or pnpm for this function.

## Quick Start

1. Clone the repo and step into it:
   ```bash
   git clone <repo-url>
   cd itinerary-project/supabase
   ```
2. Open Docker Desktop

3. Serve the function in watch mode:

   ```bash
   supabase start
   supabase functions serve generate --no-verify-jwt
   ```

   - Runs on `http://127.0.0.1:54321/functions/v1/generate`.
   - Reloads automatically when you change the TypeScript files.
   - Disables JWT verification so you can call it without a valid token (set Postman's `anonKey` to any string).

Stop the server with `Ctrl+C` when you are done.

## Running the Postman Suites

1. Import `postman/Itinerary Generation.postman_collection.json`.
2. Open the **Collection Runner** `Ctrl+Shift+R`, select the entire **Itinerary Generation** collection, and attach any of the JSON data files. Each run executes the same set of requests; the dataset you choose just determines which scenarios those requests evaluate. Re-run the collection with other files to exercise different angles.

| Data file                    | Primary focus area                              | Related request coverage                                          |
| ---------------------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| `data/input_validation.json` | Required fields, schema checks                  | Primarily surfaced in **HTTP Status, Required Fields and Errors** |
| `data/date_validation.json`  | Date edge cases                                 | Primarily surfaced in **HTTP Status, Required Fields and Errors** |
| `data/scaffold_days.json`    | Day scaffolding logic                           | Highlights assertions in **Day Scaffold**                         |
| `data/anchor_creation.json`  | Anchor insertion and fixed blocks               | Highlights assertions in **Anchors**                              |
| `data/place_assignment.json` | Must-visit scheduling and unscheduled reasoning | Highlights assertions in **Must Visit Places**                    |

Running a collection with a given dataset will still call every request in the collection. Any file can pair with any run.
