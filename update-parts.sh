#!/bin/bash

./set-theme.sh $1
docker-compose run base gulp update-parts --max_old_space_size=8192
