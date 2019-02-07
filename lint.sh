#!/bin/bash

./set-theme.sh $1
docker-compose run base gulp stylelint
