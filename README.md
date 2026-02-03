# Itinerary Generator

A Supabase Edge Function that generates travel itineraries and is designed to be run locally with the Supabase CLI. Includes a Postman collection plus data-driven test suites for validating inputs, dates, day scaffolding, anchors, and place assignment logic.

Built as a local-first workflow: Docker + Supabase CLI serve the function, while Postman datasets exercise multiple scenario paths.

## Features

- **Local Edge Function** — Runs `generate` on the Supabase functions runtime without needing Node.js.
- **Hot Reloading** — Watches TypeScript changes when served via the Supabase CLI.
- **JWT Disabled for Dev** — `--no-verify-jwt` enables quick testing without real auth.
- **Postman Test Suites** — Collection runner supports multiple datasets to validate behavior.
- **Scenario Coverage** — Data files target required fields, dates, scaffolding, anchors, and must-visit placement.

## Tech Stack

| Layer        | Technology      |
|--------------|-----------------|
| Runtime      | Supabase CLI    |
| Functions    | Supabase Edge   |
| Runtime Host | Docker Desktop  |
| API Testing  | Postman         |
| Language     | TypeScript      |

## Getting Started

### Prerequisites

- **Supabase CLI** v1.175+
  - macOS: `brew install supabase/tap/supabase`
  - Windows: `scoop install supabase` or `choco install supabase`
  - Linux: `curl -fsSL https://supabase.com/cli/install | sh`
- **Docker** Desktop
- **Postman** (desktop app) if you plan to run the bundled API tests

> The Supabase CLI bundles the correct Deno runtime, so you do not need Node, npm, or pnpm for this function.

### Setup

1. Clone the repository and enter the Supabase folder:
   ```bash
   git clone <repo-url>
   cd itinerary-generator/supabase
   ```

2. Start Docker Desktop.

3. Start Supabase and serve the function:
   ```bash
   supabase start
   supabase functions serve generate --no-verify-jwt
   ```

4. Call the function at:
   ```
   http://127.0.0.1:54321/functions/v1/generate
   ```

Stop the server with `Ctrl+C` when you are done.

## Postman Suites

1. Import `postman/Itinerary Generation.postman_collection.json`.
2. Open the **Collection Runner** (`Ctrl+Shift+R`), select the **Itinerary Generation** collection, and attach any JSON data file. Each run executes the same requests; the dataset only changes the scenario set.

| Data file                    | Primary focus area                              | Related request coverage                                          |
|-----------------------------|--------------------------------------------------|-------------------------------------------------------------------|
| `data/input_validation.json` | Required fields, schema checks                  | Primarily surfaced in **HTTP Status, Required Fields and Errors** |
| `data/date_validation.json`  | Date edge cases                                 | Primarily surfaced in **HTTP Status, Required Fields and Errors** |
| `data/scaffold_days.json`    | Day scaffolding logic                           | Highlights assertions in **Day Scaffold**                         |
| `data/anchor_creation.json`  | Anchor insertion and fixed blocks               | Highlights assertions in **Anchors**                              |
| `data/place_assignment.json` | Must-visit scheduling and unscheduled reasoning | Highlights assertions in **Must Visit Places**                    |

Running a collection with a given dataset will still call every request in the collection. Any file can pair with any run.
