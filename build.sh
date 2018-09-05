#!/bin/bash

# コードが汚いのでわかる方はリファクタしてください

# 引数がある場合は引数のテーマを出力
if [ $1 ] ; then
  sed -e 's/theme-name/'$1'/g' _docker-compose.yml > docker-compose.yml 
  docker-compose run base gulp build
# ない場合は全テーマを出力
else
  for theme in `find . -type d -regex "./*[0-9][0-9][0-9]"` ; do
    sed -e 's/theme-name/'${theme##*/}'/g' _docker-compose.yml > docker-compose.yml 
    docker-compose run base gulp build
  done
  for theme in `find . -type d -regex "./*[0-9][0-9][0-9][A-Z]"` ; do
    sed -e 's/theme-name/'${theme##*/}'/g' _docker-compose.yml > docker-compose.yml 
    docker-compose run base gulp build
  done
fi
