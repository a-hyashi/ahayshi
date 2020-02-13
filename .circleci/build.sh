#!/bin/bash

# bash vertion3では連想配列が使えないため同じindexの値を取得して使う
pips=()
themes=()

error_themes=()

count=0
for theme in `find . -type d -regex "./*[0-9][0-9][0-9][A-Z]*"` ; do
  ./copy.sh ${theme##*/}
  cd ${theme##*/}
  gulp build &
  pips+=($!)
  themes+=( ${theme##*/} )
  cd ../

  count=$(( count + 1 ))
  # 一括処理だとメモリが不足して以下のエラーが発生するため分割して実行
  # ./.circleci/build.sh: line 9:   999 Killed
  if [ ${count} -eq 8 ] ; then
    for ((i = 0; i < ${#pips[@]}; i++)) ; do
      wait ${pips[$i]}
      if [ $? -ne 0 ]; then
        error_themes+=(${themes[$i]})
      fi
    done
    count=0
    pips=()
    themes=()
  fi
done

for ((i = 0; i < ${#pips[@]}; i++)) ; do
  wait ${pips[$i]}
  if [ $? -ne 0 ]; then
    error_themes+=(${themes[$i]})
  fi
done

if [ ${#error_themes[@]} -ne 0 ] ; then
  echo "以下のテーマのビルドに失敗しました"
  echo "${error_themes[@]}"
  exit 1
fi
