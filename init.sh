#!/bin/bash

./set-theme.sh $1
docker-compose run base cp ../copy.sh ./copy.sh
docker-compose run base ./copy.sh
docker-compose run base gulp update-parts --max_old_space_size=8192
