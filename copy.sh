#!/bin/bash

# gulpの実行ディレクトリが変わってしまうため、シンボリックリンクではなくコピーする
THEMES=(`find . -type d -maxdepth 1 -regex "./[0-9][0-9][0-9][A-Z]*" | sed -e "s/\.\///"`)
for i in ${!THEMES[@]}; do
  \cp ./gulpfile.js ./${THEMES[i]}/
  if [ -e ./${THEMES[i]}/lib/ ]; then
    rm -r ./${THEMES[i]}/lib/
  fi
  \cp -r ./lib/ ./${THEMES[i]}/lib/
done

printf "\e[32mgulpfile.jsとlibのコピーが完了しました\e[m\n"
