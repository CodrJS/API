# CodrJS/api

An API built using the `@codrjs/core` and `@dylanbulmer/openapi` NPM modules.

## Build for production

```bash
docker build -t codr-api .
```

## Build for local development

This is useful for testing the `@codrjs/core` local builds and reducing the frequency of releases.

```bash
docker build -t codr-api -f Dockerfile.local .
```
