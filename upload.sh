#!/bin/bash

#引数がallの場合は全テーマ実行
#番号の場合は指定の番号のコンテナを実行
#ない場合は1つ目のコンテナを実行

if [ $1 ] ; then
  if [ $1 = "all" ] ; then
    for theme in `find . -type d -regex "./*[0-9][0-9][0-9][A-Z]*"` ; do
      ./set-themes.sh ${theme##*/}
      docker-compose run web1 npx gulp upload
      docker-compose run web1 npx gulp upload-2
      docker-compose run web1 npx gulp upload-3
      docker-compose run web1 npx gulp upload-img
    done
  else
    for num in "$@" ; do
      docker-compose run web$num npx gulp upload
      docker-compose run web$num npx gulp upload-2
      docker-compose run web$num npx gulp upload-3
      docker-compose run web$num npx gulp upload-img
    done
  fi
else
  docker-compose run web1 npx gulp upload
  docker-compose run web1 npx gulp upload-2
  docker-compose run web1 npx gulp upload-3
  docker-compose run web1 npx gulp upload-img
fi

docker-compose down
