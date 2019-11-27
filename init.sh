#!/bin/bash

#引数がallの場合は全テーマ実行
#それ以外の場合は指定のテーマで実行 複数指定可能
#ない場合は現在のテーマで実行
THEMES=($@)
if [ $1 ] ; then
  if [ $1 = "all" ] ; then
    printf "\e[36m[Info] 全テーマでinitを実行します\e[m\n"
    for theme in `find . -type d -regex "./*[0-9][0-9][0-9][A-Z]*"` ; do
      ./set-themes.sh ${theme##*/}
      docker-compose run app1 cp ../copy.sh ./copy.sh
      docker-compose run app1 ./copy.sh
      docker-compose run app1 npx gulp update-styleguide
    done
  else
    printf "\e[36m[Info] $*でinitを実行します\e[m\n"
    ./set-themes.sh $*
    for i in ${!THEMES[@]}; do
      docker-compose run app$(($i*2+1)) cp ../copy.sh ./copy.sh
      docker-compose run app$(($i*2+1)) ./copy.sh
      docker-compose run app$(($i*2+2)) cp ../copy.sh ./copy.sh
      docker-compose run app$(($i*2+2)) ./copy.sh
      docker-compose run app$(($i*2+1)) npx gulp update-styleguide
      docker-compose run app$(($i*2+2)) npx gulp update-styleguide
    done
  fi
else
  docker-compose run app1 cp ../copy.sh ./copy.sh
  docker-compose run app1 ./copy.sh
  docker-compose run app1 npx gulp update-styleguide
fi

docker-compose down
printf "\e[32m[Info] initが完了しました\e[m\n"
