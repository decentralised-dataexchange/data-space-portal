# Post-Migration Verification Checklist

## ✅ Completed Migration Steps

1. **Legacy App Backup**: V1 app copied to `legacy-v1/` folder
2. **Directory Migration**: V2 app moved from `v2/` to root directory
3. **Docker Configuration**: Updated `Dockerfile.nextjs` to use root paths
4. **GitHub Workflow**: Updated `.github/workflows/deploy.yaml` to remove v1 references
5. **Makefile**: Consolidated all commands to use new structure
6. **Dockerignore**: Updated to exclude legacy files and build artifacts
7. **Build Test**: Successfully built deployable Docker image

## 🔍 Manual Verification Required

### 1. Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Verify app runs at http://localhost:3000
```

### 2. Docker Build & Run
```bash
# Build development Docker image
make build

# Run Docker container
make run

# Verify app runs at http://localhost:3000
```

### 3. Deployment Build
```bash
# Build deployable image (already tested ✅)
make build/docker/deployable

# Check deploy_version file
cat deploy_version
# Should show: eu.gcr.io/jenkins-189019/igrant-dataspace-frontend:fix-v2-only-20251113194116-9e520c5
```

### 4. GitHub Actions Workflow
- Push to `main` branch
- Verify workflow runs successfully
- Check that API URL is replaced correctly in `src/constants/url.ts`
- Verify deployment to staging environment

### 5. Kubernetes Deployment
```bash
# Publish image (requires GCP credentials)
make publish

# Deploy to staging (requires kubectl access)
make deploy/staging

# Verify deployment
kubectl get deployment staging-dataspacefrontend -n dataspace
kubectl get pods -n dataspace | grep staging-dataspacefrontend
```

## 📋 Configuration Verification

### API Configuration
- **File**: `src/constants/url.ts`
- **Current Value**: Check if it's the local dev URL
- **Production Value**: `https://api.nxd.foundation` (set during deployment)

### Next.js Configuration
- **File**: `next.config.ts`
- **Output Mode**: `standalone` ✅
- **Webpack Config**: Font handling configured ✅

### Package Configuration
- **File**: `package.json`
- **Name**: "Data Marketplace Portal" ✅
- **Scripts**: dev, build, start, lint ✅
- **Dependencies**: All Next.js 15 dependencies ✅

## 🔄 Comparison with Legacy V1

### Key Differences
| Aspect | V1 (Legacy) | V2 (Current) |
|--------|-------------|--------------|
| Framework | React + Webpack | Next.js 15 |
| Server | Nginx | Node.js |
| Port | 80 | 3000 |
| Build Output | Static files | Standalone |
| API Config | `src/utils/fetchWrapper.ts` | `src/constants/url.ts` |
| Docker Base | nginx:1.15.8-alpine | node:18-alpine |

### Preserved Features
- ✅ API base URL configuration
- ✅ GCP Container Registry deployment
- ✅ Kubernetes deployment to `dataspace` namespace
- ✅ GitHub Actions CI/CD pipeline
- ✅ Docker multi-stage builds

## 🚨 Potential Issues to Watch

1. **Environment Variables**: Ensure all required env vars are set in production
2. **API URL Replacement**: Verify sed commands work correctly in GitHub Actions
3. **Port Configuration**: Update any external references from port 80 to port 3000
4. **Static Assets**: Verify all public assets are accessible
5. **Authentication**: Test login/logout flows work correctly
6. **Routing**: Test all Next.js routes work as expected

## 📝 Next Steps

1. **Test Locally**: Run `npm run dev` and verify all features work
2. **Test Docker**: Run `make build && make run` and verify containerized app works
3. **Update Documentation**: Update any README or docs that reference the old structure
4. **Team Communication**: Notify team about the migration and new commands
5. **Monitor Deployment**: Watch the first production deployment closely
6. **Performance Testing**: Compare performance with v1 app

## 🔧 Rollback Instructions

If issues arise, rollback using these steps:

```bash
# 1. Stop and remove current files
rm -rf src/ public/ next.config.ts package.json package-lock.json

# 2. Restore from legacy
cp -r legacy-v1/* .

# 3. Revert infrastructure files
git checkout HEAD -- Makefile .github/workflows/deploy.yaml resources/docker/Dockerfile.nextjs .dockerignore

# 4. Rebuild
make build/docker/deployable
```

## ✅ Sign-off

- [ ] Local development tested
- [ ] Docker build tested ✅
- [ ] Docker run tested
- [ ] GitHub Actions workflow reviewed ✅
- [ ] Kubernetes deployment configuration reviewed ✅
- [ ] Team notified
- [ ] Documentation updated
- [ ] Production deployment successful

---

**Migration Date**: November 13, 2024  
**Migration By**: Cascade AI  
**Build Status**: ✅ Successful  
**Deploy Version**: `eu.gcr.io/jenkins-189019/igrant-dataspace-frontend:fix-v2-only-20251113194116-9e520c5`
