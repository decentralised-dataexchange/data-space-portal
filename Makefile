.DEFAULT_GOAL := help
.PHONY: help
help:
	@echo "------------------------------------------------------------------------"
	@echo "Dataspace portal"
	@echo "------------------------------------------------------------------------"
	@grep -E '^[0-9a-zA-Z_/%\-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


.PHONY: build
build: ## Builds the docker image
	docker build -t igrantio/data-space-portal:dev -f resources/docker/Dockerfile .

run: ## Run dashboard
	docker run --rm -ti -p 4204:80 --name "dataspace" igrantio/data-space-portal:dev