#!/bin/bash

rm docker-compose.yml
echo version: \"3\" >> docker-compose.yml
echo services: >> docker-compose.yml
THEMES=($@)
num=0
for i in ${!THEMES[@]}; do
  num=$(($num+1))
  num2=$(($num+1))
  sed -e "s/#{theme-name}/${THEMES[i]}/g" -e "s/#{num}/${num}/g" -e "s/#{num2}/${num2}/g" _docker-compose.yml >> docker-compose.yml
  if [ $# -ge 2 ]; then
    printf "\e[36m[Info] $(($i+1))つめのテーマを${THEMES[i]}に設定しました\e[m\n"
  else
    printf "\e[36m[Info] テーマを${THEMES[i]}に設定しました\e[m\n"
  fi
  num=$(($num+1))
done
