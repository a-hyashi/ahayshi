#!/bin/bash

#引数がある場合は指定のテーマで実行 複数指定可能
#ない場合は現在のテーマで実行
if [ $* ] ; then
  ./set-themes.sh $*
fi

printf "\n\e[36m[info] Access URLs:\e[m\n"

APPS=($(grep 'app[0-9]*' docker-compose.yml --only-matching))
THEMES=($(grep '/buddy-theme/[0-9][0-9][0-9][A-Z]*' docker-compose.yml --only-matching | sed -e "s/\/buddy-theme\///"))

for ((i = 0; i < ${#APPS[@]}; i++)) ; do
  num=$(($i+1))
  printf "\e[36mテーマ${THEMES[i]}\e[m\n"
  printf "\e[36mlocal    URL: \e[34mhttp://localhost:300${num}\e[m\n"
  if [[ `ifconfig | grep 192.168.0.` =~ 192.168.0.[0-9]{1,3} ]]; then
    printf "\e[36mExternal URL: \e[34mhttp://"${BASH_REMATCH[0]}":300${num}\e[m\n"
  fi
  echo "-----------------------------------------------------"
done

printf "\e[36m[Info] スタイルガイドを起動します...\e[m\n\n"
docker-compose up
