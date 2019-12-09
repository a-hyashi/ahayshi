#!/bin/bash

# gulpの実行ディレクトリが変わってしまうため、シンボリックリンクではなくコピーする
if [ $1 ] ; then
  # 引数がallの場合は全テーマ実行
  if [ $1 = "all" ] ; then
    THEMES=(`find . -type d -maxdepth 1 -regex "./[0-9][0-9][0-9][A-Z]*" | sed -e "s/\.\///"`)
  else
  # 引数がある場合は引数のテーマで実行
    THEMES=($@)
  fi
else
  # 引数がない場合も全テーマ実行
  THEMES=(`find . -type d -maxdepth 1 -regex "./[0-9][0-9][0-9][A-Z]*" | sed -e "s/\.\///"`)
fi

for i in ${!THEMES[@]}; do
  \cp ./gulpfile.js ./${THEMES[i]}/
  # 上書きだけだと余計なファイルがあると残るので最初に消す
  if [ -e ./${THEMES[i]}/lib/ ]; then
    rm -r ./${THEMES[i]}/lib/
  fi
  \cp -r ./lib/ ./${THEMES[i]}/lib/
done

printf "\e[32mgulpfile.jsとlibのコピーが完了しました\e[m\n"
