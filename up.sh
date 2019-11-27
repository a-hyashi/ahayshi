#!/bin/bash

#引数がある場合は指定のテーマで実行 複数指定可能
#引数がない場合は実行しない
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
  printf "\n\e[36m[Info] スタイルガイドを起動します...\e[m\n\n"
  docker-compose up
else
  printf "\e[31m[Error] テーマを指定してください\e[m\n"
fi
