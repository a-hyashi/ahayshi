#!/bin/bash

error_themes=()
for theme in `find . -type d -regex "../*[0-9][0-9][0-9][A-Z]*"` ; do
  cp ./.circleci/gulpfile.js ./${theme##*/}/gulpfile.js
  cd ${theme##*/}
  gulp stylelint-check || error_themes+=( ${theme##*/} )
  cd ../
done

if (( ${#error_themes[@]} )); then
  echo "ローカル環境で以下のテーマのlintを実行してください"
  echo "${error_themes[@]}"
  exit 1
fi
