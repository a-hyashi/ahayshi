#!/bin/bash

if [ "$1" = "" ] ; then
  printf "\e[31m[Error] テーマを指定してください\e[m\n"
  exit 1
fi

THEMES=($@)
rm docker-compose.yml
echo version: \"3\" >> docker-compose.yml
echo services: >> docker-compose.yml

for i in ${!THEMES[@]}; do
  container_num=$(($i+1))
  sed -e "s/#{theme-name}/${THEMES[i]}/g" -e "s/#{num}/${container_num}/g" _docker-compose.yml >> docker-compose.yml
  printf "\e[32mapp${container_num}をテーマ${THEMES[i]}に設定しました\e[m\n"
done
