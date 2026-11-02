# USP 661 Plastic Packaging Explorer

Standalone, dependency-free V0.1 browser explorer for plastic materials and plastic packaging system assessment. Designed for deployment to GitHub Pages.

## Deploy to GitHub Pages

1. Create a GitHub repository named `usp-661-plastic-packaging-explorer`.
2. Extract the ZIP and upload **its contents** to the repository root. The `index.html` file must be at root.
3. In **Settings → Pages → Build and deployment**, select **Deploy from a branch**, `main` and `/(root)`.
4. Open `https://<your-username>.github.io/usp-661-plastic-packaging-explorer/` after GitHub Pages publishes the site.

Open `index.html` locally for a basic offline preview; no build tools, API keys or servers are needed.

## Test

Requires Node.js 20 or newer for local tests:

```bash
node --test tests/*.test.js
```

The GitHub Actions workflow runs these tests on commits and pull requests.

## Scope and limitations

Calculations use inputs entered by the user and can be exported locally as JSON or CSV. Illustrative examples are synthetic. This tool is a **nonvalidated educational and engineering decision-support prototype**, not an electronic-record system, a regulatory compliance determination, a test procedure, or a chemical/biological safety assessment. It does not reproduce official USP acceptance criteria. Confirm applicability, effective standards, methods, and limits against licensed current source documents and qualified review before regulated use.

No runtime dependencies, backend, remote data storage, or tracking scripts are included. Avoid entering confidential data into public demonstrations.

## Repository contents

- `index.html` — application entry point
- `styles.css` — responsive styling
- `src/` — application, calculations, and user-interface code
- `tests/core.test.js` — automated calculation tests
- `.github/workflows/ci.yml` — continuous integration test workflow
- `.nojekyll` — GitHub Pages configuration

**Licensing:** No software license is included. Public visibility alone does not grant permission to redistribute or reuse the source code.
