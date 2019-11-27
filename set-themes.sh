#!/bin/bash

rm docker-compose.yml
echo version: \"3\" >> docker-compose.yml
echo services: >> docker-compose.yml
THEMES=($@)
num=0
if [ $1 ] ; then
  for i in ${!THEMES[@]}; do
    num=$(($num+1))
    num2=$(($num+1))
    sed -e "s/#{theme-name}/${THEMES[i]}/g" -e "s/#{num}/${num}/g" -e "s/#{num2}/${num2}/g" _docker-compose.yml >> docker-compose.yml
    printf "\e[36m[Info] $(($i+1))つめのテーマを${THEMES[i]}に設定しました\e[m\n"
    num=$(($num+1))
  done
else
  printf "\e[31m[Error] テーマを指定してください\e[m\n"
fi
