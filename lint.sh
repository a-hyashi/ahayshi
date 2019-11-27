#!/bin/bash

#引数がallの場合は全テーマ実行
#それ以外の場合は指定のテーマで実行
#ない場合は現在のテーマで実行
if [ $1 ] ; then
  if [ $1 = "all" ] ; then
    printf "\e[36m[Info] 全テーマでlintを実行します\e[m\n"
    for theme in `find . -type d -regex "./*[0-9][0-9][0-9][A-Z]*"` ; do
      ./set-themes.sh ${theme##*/}
      docker-compose run app1 npx gulp stylelint
    done
  else
    for theme in "$@" ; do
      printf "\e[36m[Info] ${theme##*/}でlintを実行します\e[m\n"
      ./set-themes.sh ${theme##*/}
      docker-compose run app1 npx gulp stylelint
    done
  fi
else
  printf "\e[36m[Info] lintを実行します\e[m\n"
  docker-compose run app1 npx gulp stylelint
fi

docker-compose down
printf "\e[32m[Info] lintが完了しました\e[m\n"
