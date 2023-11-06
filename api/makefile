setup:
	pip install pip-tools

build:
	brew install netcat

run:
	python index.py

compile:
	pip-compile reqs/requirements.in -o reqs/requirements.txt

sync:
	pip-sync reqs/requirements.txt