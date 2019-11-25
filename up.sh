#!/bin/bash

#引数がある場合は指定のテーマで実行
#ない場合は現在のテーマで実行
THEMES=($@)
if [ $1 ] ; then
  ./set-themes.sh ${THEMES[@]}
    printf "\e[36m\n[Info] 複数のスタイルガイドをバックグランドで起動します...\e[m\n"
  for i in ${!THEMES[@]}; do
    num=$(($num+1))
    num2=$(($num+1))
    printf "\e[36m[Info] ${THEMES[i]} block 001~099 - URL: http://localhost:300${num}\e[m\n"
    printf "\e[36m       ${THEMES[i]} block 100~    - URL: http://localhost:300${num2}\e[m\n"
    if [ $# -ge 2 ]; then
      docker-compose up -d bt${num}
      docker-compose up -d bt${num2}
      num=$(($num+1))
    fi
  done
else
  printf "\e[36m[Info] スタイルガイドを起動します...\e[m\n\n"
  printf "\e[36m[Info] 001~099 - URL: http://localhost:300${num}\e[m\n"
  printf "\e[36m       100~    - URL: http://localhost:300${num2}\e[m\n"
  docker-compose up
fi
