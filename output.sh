#!/bin/bash

#引数がallの場合は全テーマ実行
#番号の場合は指定の番号のコンテナを実行
#ない場合は1つ目のコンテナを実行
if [ $1 ] ; then
  if [ $1 = "all" ] ; then
    for theme in `find . -type d -regex "./*[0-9][0-9][0-9][A-Z]*"` ; do
      ./set-themes.sh ${theme##*/}
      docker-compose run bt1 npx gulp output
    done
  else
    for theme in "$@" ; do
      ./set-themes.sh ${theme##*/}
      docker-compose run bt1 npx gulp output
    done
  fi
else
  docker-compose run bt1 npx gulp output
fi

docker-compose down
