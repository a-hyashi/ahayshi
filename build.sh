#!/bin/bash

themes=()

# 引数がある場合は引数のテーマを出力
if [ $1 ] ; then
  themes+=$1
# ない場合は全テーマを出力
else
  for filepath in `find . -type d -regex "./[0-9]{3}"` ; do
    echo $filepath
  done
fi

for theme in $themes
do
echo $theme
:
#  sed -e 's/theme-name/'$theme'/g' _docker-compose.yml > docker-compose.yml 
#  docker-compose run base gulp build
done
