#!/bin/bash

#引数がallの場合は全テーマ実行
#番号の場合は指定の番号のコンテナを実行
#ない場合は1つ目のコンテナを実行
if [ $1 ] ; then
  if [ $1 = "all" ] ; then
    for theme in `find . -type d -regex "./*[0-9][0-9][0-9][A-Z]*"` ; do
      ./set-theme.sh ${theme##*/}
      docker-compose run web1 gulp stylelint
    done
  else
    for num in "$@" ; do
      docker-compose run web$num gulp stylelint
    done
  fi
else
  docker-compose run web1 gulp stylelint
fi

docker-compose down