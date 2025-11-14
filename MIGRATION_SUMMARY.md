# V1 to V2 Migration Summary

## Migration Completed

This document summarizes the migration from the v1 app to the v2 (Next.js) app.

## Changes Made

### 1. Legacy App Preservation
- **Action**: Copied all v1 app files to `legacy-v1/` folder for reference
- **Purpose**: Preserve the old app for comparison and rollback if needed

### 2. Directory Structure
- **Action**: Moved all contents from `v2/` directory to root directory
- **Removed**: Old v1 app files (src/, webpack.config.js, .babelrc, etc.)
- **Result**: Next.js app is now at the root level

### 3. Docker Configuration

#### Dockerfile.nextjs (`resources/docker/Dockerfile.nextjs`)
**Changes**:
- Updated `COPY v2/package.json v2/yarn.lock* ...` → `COPY package.json yarn.lock* ...`
- Updated `COPY v2/ .` → `COPY . .`
- **Result**: Dockerfile now builds from root directory

#### .dockerignore
**Added exclusions**:
- `.git`
- `.github`
- `legacy-v1`
- `.next`
- `.env*.local`
- `README.md`
- `LICENSE`

### 4. GitHub Workflow (`.github/workflows/deploy.yaml`)

**Removed**:
- v1 API URL replacement step (for `src/utils/fetchWrapper.ts`)
- Separate v1 and v2 deployment steps

**Updated**:
- Single API URL replacement: `src/constants/url.ts`
- Unified deployment command: `make build/docker/deployable publish deploy/staging`

### 5. Makefile

**Consolidated Commands**:
- `run`: Now runs Next.js app on port 3000 (removed old v1 nginx version)
- `build`: Now builds Next.js docker image (removed old v1 webpack version)
- `build/docker/deployable`: Now builds Next.js deployable image (removed v1 version)
- `deploy/staging`: Now deploys to `staging-dataspacefrontend` deployment

**Removed**:
- `run/v2` command (merged into `run`)
- `build/v2` command (merged into `build`)
- `build/docker/deployable/v2` command (merged into `build/docker/deployable`)
- `deploy/staging/v2` command (merged into `deploy/staging`)

## Key Infrastructure Details from V1

### API Configuration
- **Base URL**: `https://api.nxd.foundation`
- **Location**: `src/constants/url.ts` (was `src/utils/fetchWrapper.ts` in v1)
- **Deployment**: URL is replaced during GitHub Actions workflow

### Docker Setup
- **Image Name**: `eu.gcr.io/jenkins-189019/igrant-dataspace-frontend`
- **Platform**: `linux/amd64`
- **Port**: 3000 (changed from 80 in v1)
- **Base Image**: `node:18-alpine` (was nginx in v1)

### Kubernetes Deployment
- **Namespace**: `dataspace`
- **Deployment Name**: `staging-dataspacefrontend`
- **Container Name**: `staging-dataspacefrontend`

### Build Process
1. Install dependencies (npm ci)
2. Build Next.js app (npm run build)
3. Create standalone output
4. Copy `.next/standalone` and `.next/static` to final image
5. Run with `node server.js`

## Verification Steps

### Local Testing
```bash
# Build the Docker image
make build

# Run the container
make run

# Access at http://localhost:3000
```

### Deployment Testing
```bash
# Build deployable image
make build/docker/deployable

# Publish to registry
make publish

# Deploy to staging
make deploy/staging
```

## Important Notes

1. **Next.js Standalone Output**: The app uses Next.js standalone output mode for optimal Docker images
2. **API URL**: The API URL is replaced during deployment via sed commands in GitHub Actions
3. **Port Change**: The app now runs on port 3000 instead of port 80
4. **No Nginx**: The app uses Next.js built-in server instead of nginx
5. **Legacy Comparison**: The `legacy-v1/` folder contains the complete v1 app for reference

## Files Modified

- `/resources/docker/Dockerfile.nextjs` - Updated paths from v2/ to root
- `/.dockerignore` - Added exclusions for legacy and build artifacts
- `/.github/workflows/deploy.yaml` - Removed v1 references, updated paths
- `/Makefile` - Consolidated v1 and v2 commands into single commands

## Files Removed from Root

- `src/` (v1 React app source)
- `public/` (v1 public assets - replaced with v2 version)
- `webpack.config.js`
- `.babelrc`
- `custom.d.ts`
- `index.html`
- Old `package.json` and `package-lock.json`

## Files Added to Root

All files from `v2/` directory, including:
- `src/` (Next.js app source)
- `public/` (Next.js public assets)
- `next.config.ts`
- `package.json` (Next.js dependencies)
- `tsconfig.json` (Next.js TypeScript config)
- `eslint.config.mjs`
- `postcss.config.mjs`

## Rollback Plan

If needed, the v1 app can be restored from `legacy-v1/` folder:
1. Remove current root files
2. Copy files from `legacy-v1/` back to root
3. Revert changes to Makefile, Dockerfile, and GitHub workflow
