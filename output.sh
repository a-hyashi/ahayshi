#!/bin/bash

#引数がallの場合は全テーマ実行
#それ以外の場合は指定のテーマで実行 複数指定可能
#ない場合は現在のテーマで実行
printf "\e[36m[Info] CSSとimgsの差分をACRE-Themeへコピーします\e[m\n"

if [ $1 ] ; then
  # 引数がallの場合は全テーマ実行
  if [ $1 = "all" ] ; then
    for theme in `find . -type d -maxdepth 1 -regex "./[0-9][0-9][0-9][A-Z]*" | sort` ; do
      ./set-themes.sh ${theme#./}
      docker-compose run app1 npx gulp output_to_ACRE_theme
    done
    docker-compose down
    printf "\e[32mACRE-Themeへ差分コピーが完了しました\e[m\n"
    exit
  # 引数がある場合は引数のテーマで実行
  else
    ./set-themes.sh $*
  fi
fi

APPS=($(grep 'app[0-9]*' docker-compose.yml --only-matching))
for ((i = 0; i < ${#APPS[@]}; i++)) ; do
  docker-compose run app$(($i+1)) npx gulp output_to_ACRE_theme
done

docker-compose down
printf "\e[32mACRE-Themeへ差分コピーが完了しました\e[m\n"
