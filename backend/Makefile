.PHONY: lint format test test-integration test-e2e

lint:
	npm run lint

format:
	npm run format:check

test:
	npm run test

test-integration:
	npm run test:integration

test-e2e:
	npm run test:e2e

fix:
	npm run format
	npm run lint -- --fix

prisma-generate:
	npx prisma generate

prisma-migrate:
	npx prisma migrate deploy

prisma-migrate-dev:
	npx prisma migrate dev

prisma:
	npx prisma generate
	npx prisma migrate dev
	npx prisma migrate deploy

run:
	npm run dev