#!/bin/bash

sed -e 's/theme-name/'$1'/g' _docker-compose.yml > docker-compose.yml
printf "\e[36mテーマ"$1"で実行します\e[m\n"
