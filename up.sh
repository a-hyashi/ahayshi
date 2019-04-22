#!/bin/bash

if [[ `ifconfig | grep 192.168.0.` =~ 192.168.0.[0-9]{1,3} ]]; then
  printf "\e[36m外部URL: http://"${BASH_REMATCH[0]}"\e[m\n\n"
fi
docker-compose up
