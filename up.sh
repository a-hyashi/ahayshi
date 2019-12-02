#!/bin/bash

#引数がある場合は指定のテーマで実行 複数指定可能
#ない場合は現在のテーマで実行
if [ $1 ] ; then
  THEMES=($@)
  ./set-themes.sh ${THEMES[@]}
  printf "\n\e[32m[Info] Access URLs:\e[m\n"
  for i in ${!THEMES[@]}; do
    num=$(($i*2+1))
    printf "\e[36mテーマ${THEMES[i]}\e[m\n"
    printf "\e[32mlocal    URL: \e[34mhttp://localhost:300${num}\e[m\n"
    if [[ `ifconfig | grep 192.168.0.` =~ 192.168.0.[0-9]{1,3} ]]; then
      printf "\e[32mExternal URL: \e[34mhttp://"${BASH_REMATCH[0]}":300${num}\e[m\n"
    fi
    echo "-----------------------------------------------------"
  done
else
  printf "\n\e[32m[Info] Access URLs:\e[m\n"
  printf "\e[32mlocal    URL: \e[34mhttp://localhost:300${num}\e[m\n"
  if [[ `ifconfig | grep 192.168.0.` =~ 192.168.0.[0-9]{1,3} ]]; then
    printf "\e[32mExternal URL: \e[34mhttp://"${BASH_REMATCH[0]}":300${num}\e[m\n"
  fi
fi

printf "\e[36m[Info] スタイルガイドを起動します...\e[m\n\n"
docker-compose up
