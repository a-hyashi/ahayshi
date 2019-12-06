#!/bin/bash

# bash vertion3では連想配列が使えないため同じindexの値を取得して使う
pips=()
themes=()

error_themes=()

for theme in `find . -type d -regex "../*[0-9][0-9][0-9][A-Z]*"` ; do
  cp ./.circleci/gulpfile.js ./${theme##*/}/gulpfile.js
  cd ${theme##*/}
  gulp stylelint-check &
  pips+=($!)
  themes+=( ${theme##*/} )
  cd ../
done

error_themes=()

for ((i = 0; i < ${#pips[@]}; i++)) ; do
  wait ${pips[$i]}
  if [ $? -ne 0 ]; then
    error_themes+=(${themes[$i]})
  fi
done

if [ ${#error_themes[@]} -ne 0 ] ; then
  echo "ローカル環境で以下のテーマのlintを実行してください"
  echo "${error_themes[@]}"
  exit 1
fi
