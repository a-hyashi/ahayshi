#!/bin/bash

sed -e 's/theme-name/'$1'/g' _docker-compose.yml > docker-compose.yml 
echo "テーマ"$1"で実行します"