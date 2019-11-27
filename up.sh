#!/bin/bash

#引数がある場合は指定のテーマで実行 複数指定可能
#引数がない場合は実行しない
THEMES=($@)
if [ $1 ] ; then
  ./set-themes.sh ${THEMES[@]}
  for i in ${!THEMES[@]}; do
    num=$(($num+1))
    num2=$(($num+1))
    printf "\e[36m[Info] ${THEMES[i]} block 001~099 - URL: http://localhost:300${num}\e[m\n"
    printf "\e[36m       ${THEMES[i]} block 100~    - URL: http://localhost:300${num2}\e[m\n"
    num=$(($num+1))
  done
  printf "\n\e[32m[Info] スタイルガイドを起動します...\e[m\n\n"
  docker-compose up
else
  printf "\e[31m[Error] テーマを指定してください\e[m\n"
fi
