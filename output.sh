#!/bin/bash

#引数がallの場合は全テーマ実行
#それ以外の場合は指定のテーマで実行
#ない場合は現在のテーマで実行
if [ $1 ] ; then
  if [ $1 = "all" ] ; then
    printf "\e[36m[Info] 全テーマのCSSを出力してACRE-Themeにコピーします\e[m\n"
    for theme in `find . -type d -regex "./*[0-9][0-9][0-9][A-Z]*"` ; do
      ./set-themes.sh ${theme##*/}
      docker-compose run app1 npx gulp build
      docker-compose run app1 npx gulp output
    done
  else
    for theme in "$@" ; do
      printf "\e[36m[Info] ${theme##*/}のCSSを出力してACRE-Themeにコピーします\e[m\n"
      ./set-themes.sh ${theme##*/}
      docker-compose run app1 npx gulp build
      docker-compose run app1 npx gulp output
    done
  fi
else
  printf "\e[36m[Info] CSSを出力してACRE-Themeにコピーします\e[m\n"
  docker-compose run app1 npx gulp output
fi

docker-compose down
printf "\e[32m[Info] コピーが完了しました\e[m\n"
