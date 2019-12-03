#!/bin/bash

# gulpの実行ディレクトリが変わってしまうため、シンボリックリンクではなくコピーする
THEMES=(`find . -type d -regex "./[0-9][0-9][0-9][A-Z]*" | sed -e "s/\.\///"`)
for i in ${!THEMES[@]}; do
  \cp ./gulpfile.js ./${THEMES[i]}/
  if [ -e ./${THEMES[i]}/lib/ ]; then
    rm -r ./${THEMES[i]}/lib/
  fi
  \cp -r ./lib/ ./${THEMES[i]}/lib/
done

printf "\e[32mgulpfile.jsを各テーマフォルダにコピーしました\e[m\n"
printf "\e[32mlib/を各テーマフォルダにコピーしました\e[m\n"
