#!/bin/bash

rm docker-compose.yml
echo version: \"3\" >> docker-compose.yml
echo services: >> docker-compose.yml
THEMES=($@)
for i in "${!THEMES[@]}"; do
  num=$(($i+1))
  sed -e "s/#{theme-name}/${THEMES[i]}/g" -e "s/#{port-num}/300${num}/g"  -e "s/#{num}/${num}/g" _docker-compose.yml >> docker-compose.yml
  printf "\e[36m[Info] テーマを${THEMES[i]}に設定しました\e[m\n"
done
