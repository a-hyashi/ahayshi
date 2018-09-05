#!/bin/bash

sed -e 's/theme-name/'$1'/g' _docker-compose.yml > docker-compose.yml 
docker-compose run base cp ../copy.sh ./copy.sh
docker-compose run base ./copy.sh
docker-compose run base gulp update-parts --max_old_space_size=8192
