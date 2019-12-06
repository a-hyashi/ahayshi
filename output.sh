#!/bin/bash

#引数がallの場合は全テーマ実行
#それ以外の場合は指定のテーマで実行 複数指定可能
#ない場合は現在のテーマで実行
printf "\e[36m[Info] $@ CSSとimgsの差分をACRE-Themeへコピーします\e[m\n"

if [ $1 ] ; then
  # 引数がallの場合は全テーマ実行
  if [ $1 = "all" ] ; then
    for theme in `find . -type d -maxdepth 1 -regex "./[0-9][0-9][0-9][A-Z]*"` ; do
      # コピー先にチェックサムの差分がある場合のみコピーする(隠しファイルは除外)
      rsync -rcv --exclude "**/.*" ${theme#./}/build/themes ${theme#./}/build/theme_materials ../ACRE-theme/acre/
    done
    printf "\e[32mACRE-Themeへコピーが完了しました\e[m\n"
    exit
  # 引数がある場合は引数のテーマで実行
  else
    theme=$@
  fi
fi

for theme in "$@"
  rsync -rcv --exclude "**/.*" ${theme}/build/themes ${theme}/build/theme_materials ../ACRE-theme/acre/
done

printf "\e[32mACRE-Themeへコピーが完了しました\e[m\n"
