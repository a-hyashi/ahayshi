#!/bin/bash

# コードが汚いのでわかる方はリファクタしてください

# 引数がある場合は引数のテーマで実行
if [ $1 ] ; then
  ./set-theme.sh $1
  docker-compose run base cp ../copy.sh ./copy.sh
  docker-compose run base ./copy.sh
  docker-compose run base gulp update-parts --max_old_space_size=8192

# ない場合は全テーマで実行
else
  for theme in `find . -type d -regex "./*[0-9][0-9][0-9]"` ; do
    ./set-theme.sh ${theme##*/}
    docker-compose run base cp ../copy.sh ./copy.sh
    docker-compose run base ./copy.sh
    docker-compose run base gulp update-parts --max_old_space_size=8192
  done
  for theme in `find . -type d -regex "./*[0-9][0-9][0-9][A-Z]"` ; do
    ./set-theme.sh ${theme##*/}
    docker-compose run base cp ../copy.sh ./copy.sh
    docker-compose run base ./copy.sh
    docker-compose run base gulp update-parts --max_old_space_size=8192
  done
fi
