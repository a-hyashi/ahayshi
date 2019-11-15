#!/bin/bash

#引数がallの場合は全テーマ実行
#それ以外の場合は指定のテーマで実行
#ない場合は現在のテーマで実行

if [ $1 ] ; then
  if [ $1 = "all" ] ; then
    for theme in `find . -type d -regex "./*[0-9][0-9][0-9][A-Z]*"` ; do
      ./set-themes.sh ${theme##*/}
      docker-compose run bt-gulp4 cp ../copy.sh ./copy.sh
      docker-compose run bt-gulp4 ./copy.sh
      docker-compose run bt-gulp4 npx gulp update-parts --max_old_space_size=8192
    done
  else
    for theme in "$@" ; do
      ./set-themes.sh ${theme##*/}
      docker-compose run bt-gulp4 cp ../copy.sh ./copy.sh
      docker-compose run bt-gulp4 ./copy.sh
      docker-compose run bt-gulp4 npx gulp update-parts --max_old_space_size=8192
    done
  fi
else
  docker-compose run bt-gulp4 cp ../copy.sh ./copy.sh
  docker-compose run bt-gulp4 ./copy.sh
  docker-compose run bt-gulp4 npx gulp update-parts --max_old_space_size=8192
fi

docker-compose down
