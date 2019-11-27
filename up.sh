#!/bin/bash

#引数がある場合は指定のテーマで実行 複数指定可能
#ない場合は現在のテーマで実行
THEMES=($@)
if [ $1 ] ; then
  ./set-themes.sh ${THEMES[@]}
  if [[ `ifconfig | grep 192.168.0.` =~ 192.168.0.[0-9]{1,3} ]]; then
    printf "\n\e[32m[Info] 外部URL: \e[34mhttp://"${BASH_REMATCH[0]}"\e[m\n"
  fi
  for i in ${!THEMES[@]}; do
    num1=$(($i*2+1))
    num2=$(($i*2+2))
    printf "\e[32m${THEMES[i]} block 001~099 - URL: \e[34mhttp://localhost:300${num1}\e[m\n"
    printf "\e[32m${THEMES[i]} block 100~    - URL: \e[34mhttp://localhost:300${num2}\e[m\n"
  done
fi

printf "\n\e[36m[Info] スタイルガイドを起動します...\e[m\n\n"
docker-compose up
