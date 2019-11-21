#!/bin/bash

#引数がある場合は指定のテーマで実行
#ない場合は現在のテーマで実行
if [ $1 ] ; then
  for theme in "$@" ; do
    ./set-themes.sh ${theme##*/}
  done
fi

printf "\e[36m[Info] スタイルガイドを起動します...\e[m\n\n"
printf "\e[36m001~099 URL: http://localhost:3001\e[m\n"
printf "\e[36m100~    URL: http://localhost:3002\e[m\n\n"

docker-compose up
