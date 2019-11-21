#!/bin/bash

#引数がallの場合は全テーマ実行
#それ以外の場合は指定のテーマで実行
#ない場合は現在のテーマで実行
if [ $1 ] ; then
  if [ $1 = "all" ] ; then
    printf "\e[36m[Info] 全テーマのstyleguideを作成します\e[m\n"
    for theme in `find . -type d -regex "./*[0-9][0-9][0-9][A-Z]*"` ; do
      ./set-themes.sh ${theme##*/}
      docker-compose run bt1 npx gulp update-styleguide --max_old_space_size=8192
    done
  else
    for theme in "$@" ; do
      printf "\e[36m[Info] ${theme##*/}のstyleguideを作成します\e[m\n"
      ./set-themes.sh ${theme##*/}
      docker-compose run bt1 npx gulp update-styleguide --max_old_space_size=8192
    done
  fi
else
  docker-compose run bt1 npx gulp update-styleguide --max_old_space_size=8192
fi

docker-compose down
