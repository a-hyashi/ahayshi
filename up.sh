#!/bin/bash

sed -e 's/theme-name/'$1'/g' _docker-compose.yml > docker-compose.yml 
docker-compose up
