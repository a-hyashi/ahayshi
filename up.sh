#!/bin/bash

printf "[Info] スタイルガイドをバックグランドで起動します...\n"
printf "\e[36m001~099 URL: http://localhost:3001\e[m\n"
printf "\e[36m100~    URL: http://localhost:3002\e[m\n\n"

docker-compose up -d
