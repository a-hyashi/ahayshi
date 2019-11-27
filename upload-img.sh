#!/bin/bash

#引数がallの場合は全テーマ実行
#それ以外の場合は指定のテーマで実行
#ない場合は現在のテーマで実行
if [ $1 ] ; then
  if [ $1 = "all" ] ; then
    printf "\e[36m[Info] 全テーマのimgsを開発環境にアップロードします\e[m\n"
    for theme in `find . -type d -regex "./*[0-9][0-9][0-9][A-Z]*"` ; do
      ./set-themes.sh ${theme##*/}
      docker-compose run app1 npx gulp upload-img
    done
  else
    for theme in "$@" ; do
      printf "\e[36m[Info] ${theme##*/}のimgsを開発環境にアップロードします\e[m\n"
      ./set-themes.sh ${theme##*/}
      docker-compose run app1 npx gulp upload-img
    done
  fi
else
  printf "\e[36m[Info] imgsを開発環境にアップロードします\e[m\n"
  docker-compose run app1 npx gulp upload-img
fi

docker-compose down
printf "\e[32m[Info] アップロードが完了しました\e[m\n"
