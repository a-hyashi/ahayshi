#!/bin/bash

./set-theme.sh $1
docker-compose run base gulp upload
docker-compose run base gulp upload-2
docker-compose run base gulp upload-3
