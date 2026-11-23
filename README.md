# Regional Browser Test Fixtures

A dependency-free static handbook and browser-only fixture workbench for authorized regional web testing. The site explains fixture fields, session boundaries, assertions, safe evidence, limitations, and responsible-use boundaries.

## Preview

Serve this directory with any static file server, or open `index.html` directly. The fixture builder runs entirely in the browser and transmits no data.

## Validate

```sh
node test.mjs
```

The validation script exercises the real fixture validator, checks deterministic serialization, confirms the handbook structure and contextual-link contract, and scans the public files for credential-like strings.

## Publish with GitHub Pages

After editorial and security review, place these files at the root of a repository and configure GitHub Pages to deploy from the selected branch root. No build step or package installation is required.

Live targets and credentials do not belong in this repository. Replace only the synthetic content through a reviewed deployment workflow, and keep runtime secrets in an appropriate protected system.
