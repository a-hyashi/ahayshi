#!/bin/bash

#タスクを全て実行する
#引数がある場合は指定のテーマで実行
#ない場合は現在のテーマで実行
if [ $1 ] ; then
  for theme in "$@" ; do
    printf "\e[36m[Info] ${theme##*/}で全てのタスクを実行します\e[m\n"
    ./set-themes.sh ${theme##*/}
    ./init.sh
    ./lint.sh
    ./build.sh
    ./output.sh
    ./upload.sh
  done
else
  ./init.sh
  ./lint.sh
  ./build.sh
  ./output.sh
  ./upload.sh
fi

./up.sh
