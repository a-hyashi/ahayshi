#!/bin/bash

./set-theme.sh $1
if [[ `ifconfig | grep 192.168.0.` =~ 192.168.0.[0-9]{1,3} ]]; then
  printf "\e[36mクロスブラウザチェック用のURL: http://"${BASH_REMATCH[0]}":3000\e[m\n\n"
fi
docker-compose up
