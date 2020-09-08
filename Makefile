# Export environment variables if a .env file is present.
ifeq ($(ENV_EXPORTED),) # ENV vars not yet exported
ifneq ("$(wildcard .env)","")
sinclude .env
export $(shell [ -f .env ] && sed 's/=.*//' .env)
export ENV_EXPORTED=true
$(info Note — Variables have been included from an existing .env file.)
endif
endif

# Utils
SHELL := /bin/bash

# Add node_module dependencies to path
export PATH := $(PATH):./node_modules/.bin
DONE = echo ✓ $@ done

.PHONY: api

install-app:
	@cd app && npm ci

install-docs:
	@cd documentation && npm ci

install-api:
	@cd backend && npm ci

install: install-app install-api
	@npm ci
	@$(DONE)

pretty:
	prettier --write "{app\/src,backend\/modules}/**/*.js"

test:
	@echo should really add some tests...

run:
	cd app && npm start

api:
	@cd backend && serverless offline start --noPrependStageInUrl --migrate --apiKey API_KEY_123
	@$(DONE)

build:
	@cd app && npm run build

build-docs:
	@cd documentation && npm run build
	mkdir app/dist/docs
	cp -R documentation/build/* app/dist/docs/
