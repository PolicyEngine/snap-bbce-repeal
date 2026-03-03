.PHONY: install install-microsim test test-microsim format lint data build

install:
	uv pip install -e ".[dev]"

install-microsim:
	uv pip install -e ".[dev,microsim]"

test:
	uv run pytest -m "not microsim" -v

test-microsim:
	uv run pytest -v

format:
	uv run ruff format .
	uv run ruff check --fix .

lint:
	uv run ruff check .

data:
	uv run snap-bbce-data generate

build:
	bun run build
