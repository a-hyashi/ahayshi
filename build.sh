#!/bin/bash

#引数がallの場合は全テーマ実行
#それ以外の場合は指定のテーマで実行 複数指定可能
#ない場合は現在のテーマで実行
printf "\e[36m[Info] $@ buildを実行します\e[m\n"

if [ $1 ] ; then
  # 引数がallの場合は全テーマ実行
  if [ $1 = "all" ] ; then
    for theme in `find . -type d -regex "./*[0-9][0-9][0-9][A-Z]*"` ; do
      ./set-themes.sh ${theme##*/}
      docker-compose run app1 npx gulp build
    done
    docker-compose down
    printf "\e[32m buildが完了しました\e[m\n"
    exit
  # 引数がある場合は引数のテーマで実行
  else
    ./set-themes.sh $*
  fi
fi

APPS=($(grep 'app[0-9]*' docker-compose.yml --only-matching))
for ((i = 0; i < ${#APPS[@]}; i++)) ; do
  docker-compose run app$(($i+1)) npx gulp build
done

docker-compose down
printf "\e[32m buildが完了しました\e[m\n"
