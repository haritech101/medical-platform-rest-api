#!/bin/bash

TARGET_DIR="/home/dev/docker/medical-platform-rest-api"

echo "Ensuring target directory"
ssh dev@tech101.in mkdir -p ${TARGET_DIR}

echo "Ensuring database directory"
ssh dev@tech101.in mkdir -p "/additional/db/medical-platform"

echo "Copying docker-compose.yml"
scp docker-compose-live.yml dev@tech101.in:${TARGET_DIR}/docker-compose.yml

echo "Getting latest docker images"
ssh dev@tech101.in docker-compose -f ${TARGET_DIR}/docker-compose.yml pull

echo "Running the docker container remotely"
ssh dev@tech101.in docker-compose -f ${TARGET_DIR}/docker-compose.yml up -d
