#!/bin/bash

# 実行ディレクトリが変わってしまうため、シンボリックリンクではなくコピーする
\cp ../gulpfile.js ./
printf "\e[36m[Info] gulpfile.jsをコピーしました\e[m\n"

if [ -e ./lib/ ]; then
  rm -r ./lib/
fi
\cp -r ../lib/ ./
printf "\e[36m[Info] lib/をコピーしました\e[m\n"
