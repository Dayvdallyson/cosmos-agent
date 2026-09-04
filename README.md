# nasa-mastra

A multi-tool AI agent built with [Mastra](https://mastra.ai) that answers
questions about space using live [NASA Open APIs](https://api.nasa.gov).

## Tools

- **APOD** — Astronomy Picture of the Day (title, explanation, image URL).
- **Mars Rover Photos** — real photos from Curiosity, Perseverance, and others,
  by earth date or martian sol.

## Architecture

Layered, following SOLID:

- `infrastructure/nasa` — `NasaClient`, a Singleton HTTP client that owns the
  base URL and injects the `api_key` on every request.
- `application/nasa` — domain services (`ApodService`, `MarsRoverService`) that
  receive the client via dependency injection.
- `tools` — Mastra tools (thin adapters) that expose the services to the agent.
- `agents` — the `nasaAgent` wiring model + memory + tools together.

## Getting started

\`\`\`bash
pnpm install
cp .env.example .env   # then fill in your keys
pnpm run dev           # opens the Mastra playground at http://localhost:4111
\`\`\`

## Environment

| Variable            | Description                          |
| ------------------- | ------------------------------------ |
| `NASA_API_KEY`      | Get one free at https://api.nasa.gov |
| `ANTHROPIC_API_KEY` | Used by the agent model              |

## License

MIT
