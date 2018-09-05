#!/bin/bash

# コードが汚いのでわかる方はリファクタしてください

# 引数がある場合は引数のテーマを出力
if [ $1 ] ; then
  ./set-theme.sh $1
  docker-compose run base gulp build
# ない場合は全テーマを出力
else
  for theme in `find . -type d -regex "./*[0-9][0-9][0-9]"` ; do
    ./set-theme.sh ${theme##*/}
    docker-compose run base gulp build
  done
  for theme in `find . -type d -regex "./*[0-9][0-9][0-9][A-Z]"` ; do
    ./set-theme.sh ${theme##*/}
    docker-compose run base gulp build
  done
fi
