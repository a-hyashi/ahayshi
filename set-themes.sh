#!/bin/bash

rm docker-compose.yml
THEMES=($@)
for i in "${!THEMES[@]}"; do
  num=$(($i+1))
  sed -e "s/#{theme-name}/${THEMES[i]}/g" -e "s/#{port-num}/300${num}/g"  -e "s/#{num}/${num}/g" _docker-compose.yml >> docker-compose.yml
  printf "コンテナ${num}：${THEMES[i]}\n"
done
printf "\e[36mテーマを設定しました\e[m\n"
