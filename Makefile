PROJECT := igrant
APP     := dataspace-frontend
NAME    = $(PROJECT)-$(APP)

TERM_FLAGS ?= -ti

EXTRA_RUN_ARGS ?=

VERSION   ?= $(shell git describe --tags --abbrev=0)
CANDIDATE ?= "dev"
CONTAINER_DATASPACE_FRONTEND ?= "dataspace_frontend"

CONTAINER_DEFAULT_RUN_FLAGS := \
	--rm $(TERM_FLAGS) \
	$(EXTRA_RUN_ARGS)

GIT_BRANCH := $(shell git rev-parse --abbrev-ref HEAD | sed -E 's/[^a-zA-Z0-9]+/-/g')
GIT_COMMIT := $(shell git rev-parse --short HEAD)

# jenkins specific
ifdef BRANCH_NAME
    GIT_BRANCH = $(shell echo $(BRANCH_NAME) | tr '[:upper:]' '[:lower:]' | tr -cd '[[:alnum:]]_-')
endif

DEPLOY_VERSION_FILE = ./deploy_version
DEPLOY_VERSION = $(shell test -f $(DEPLOY_VERSION_FILE) && cat $(DEPLOY_VERSION_FILE))

GCLOUD_HOSTNAME = eu.gcr.io
GCLOUD_PROJECTID = jenkins-189019
DOCKER_IMAGE := ${GCLOUD_HOSTNAME}/${GCLOUD_PROJECTID}/$(NAME)

# tag based on git branch, date and commit
DOCKER_TAG := $(GIT_BRANCH)-$(shell date +%Y%m%d%H%M%S)-$(GIT_COMMIT)

.DEFAULT_GOAL := help

.PHONY: help
help:
	@echo "------------------------------------------------------------------------"
	@echo "Dataspace Portal"
	@echo "------------------------------------------------------------------------"
	@grep -E '^[0-9a-zA-Z_/%\-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


run: ## Run Next.js frontend locally for development purposes
	docker run \
		$(CONTAINER_DEFAULT_RUN_FLAGS) \
		-p 3000:3000 \
		--name "${CONTAINER_DATASPACE_FRONTEND}" \
		$(DOCKER_IMAGE):dev

.PHONY: build/docker/deployable
build/docker/deployable: ## Builds deployable Next.js docker image for preview, staging and production
	docker build --platform=linux/amd64 -t $(DOCKER_IMAGE):$(DOCKER_TAG) -f resources/docker/Dockerfile.nextjs .
	echo "$(DOCKER_IMAGE):$(DOCKER_TAG)" > $(DEPLOY_VERSION_FILE)

.PHONY: build/docker/deployable/demo
build/docker/deployable/demo: ## Builds deployable Docker image for demo with demo API URL
	cp src/constants/url.ts src/constants/url.ts.original
	sed -i.bak 's|export const baseURL = "https://[^"]*"|export const baseURL = "https://demo-api.nxd.foundation"|' src/constants/url.ts
	rm -f src/constants/url.ts.bak
	docker build --platform=linux/amd64 -t $(DOCKER_IMAGE):$(DOCKER_TAG) -f resources/docker/Dockerfile.nextjs . || (mv src/constants/url.ts.original src/constants/url.ts && exit 1)
	mv src/constants/url.ts.original src/constants/url.ts
	echo "$(DOCKER_IMAGE):$(DOCKER_TAG)" > $(DEPLOY_VERSION_FILE)

.PHONY: build/docker/deployable/staging
build/docker/deployable/staging: ## Builds deployable Docker image for staging with staging API URL
	cp src/constants/url.ts src/constants/url.ts.original
	sed -i.bak 's|export const baseURL = "https://[^"]*"|export const baseURL = "https://api.nxd.foundation"|' src/constants/url.ts
	rm -f src/constants/url.ts.bak
	docker build --platform=linux/amd64 -t $(DOCKER_IMAGE):$(DOCKER_TAG) -f resources/docker/Dockerfile.nextjs . || (mv src/constants/url.ts.original src/constants/url.ts && exit 1)
	mv src/constants/url.ts.original src/constants/url.ts
	echo "$(DOCKER_IMAGE):$(DOCKER_TAG)" > $(DEPLOY_VERSION_FILE)

.PHONY: build
build: ## Builds the Next.js docker image for local development
	docker build -t $(DOCKER_IMAGE):dev -f resources/docker/Dockerfile.nextjs .

.PHONY: publish
publish: $(DEPLOY_VERSION_FILE) ## Publish latest production Docker image to docker hub
	docker push $(DEPLOY_VERSION)

deploy/staging: $(DEPLOY_VERSION_FILE) ## Deploy Next.js to staging K8s deployment
	kubectl set image deployment/staging-dataspacefrontend staging-dataspacefrontend=$(DEPLOY_VERSION) -n dataspace 

deploy/demo: $(DEPLOY_VERSION_FILE) ## Deploy Next.js to demo K8s deployment
	kubectl set image deployment/dataspace-frontend dataspace-frontend=$(DEPLOY_VERSION) -n dataspace

$(DEPLOY_VERSION_FILE):
	@echo "Missing '$(DEPLOY_VERSION_FILE)' file. Run 'make build/docker/deployable'" >&2
	exit 1
	