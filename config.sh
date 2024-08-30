#!/bin/bash

DOCKER_ROOTLESS_ROOT="${HOME}/goinfre/ft_transcendence/docker"
APP_DIR="${HOME}/goinfre/ft_transcendence/app"

echo "DOCKER_ROOTLESS_ROOT = ${DOCKER_ROOTLESS_ROOT}"
echo "APP_DIR = ${APP_DIR}"

mkdir -p ${DOCKER_ROOTLESS_ROOT}
mkdir -p ${APP_DIR}

if [ $SHELL = "/usr/bin/zsh" ]; then
	if ! grep -q "export DOCKER_ROOTLESS_ROOT=${DOCKER_ROOTLESS_ROOT}" ~/.zshrc; then
		echo "export DOCKER_ROOTLESS_ROOT=${DOCKER_ROOTLESS_ROOT}" >> ~/.zshrc;
	fi;
	if ! grep -q "export APP_DIR=${APP_DIR}" ~/.zshrc; then
		echo "export APP_DIR=${APP_DIR}" >> ~/.zshrc;
	fi;
	source ~/.zshrc;
elif [ $SHELL = "/usr/bin/bash" ]; then
	if ! grep -q "export DOCKER_ROOTLESS_ROOT=${DOCKER_ROOTLESS_ROOT}" ~/.bashrc; then
		echo "export DOCKER_ROOTLESS_ROOT=${DOCKER_ROOTLESS_ROOT}" >> ~/.bashrc;
	fi;
	if ! grep -q "export APP_DIR=${APP_DIR}" ~/.bashrc; then
		echo "export APP_DIR=${APP_DIR}" >> ~/.bashrc;
	fi;
	source ~/.bashrc;
elif [ $SHELL = "/usr/bin/fish" ]; then
	if ! grep -q "set -x DOCKER_ROOTLESS_ROOT ${DOCKER_ROOTLESS_ROOT}" ~/.config/fish/config.fish; then
		echo "set -x DOCKER_ROOTLESS_ROOT ${DOCKER_ROOTLESS_ROOT}" >> ~/.config/fish/config.fish;
	fi;
	if ! grep -q "set -x APP_DIR ${APP_DIR}" ~/.config/fish/config.fish; then
		echo "set -x APP_DIR ${APP_DIR}" >> ~/.config/fish/config.fish;
	fi;
	source ~/.config/fish/config.fish;
else
	echo "Unsupported shell";
fi
