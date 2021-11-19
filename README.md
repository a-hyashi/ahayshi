# buddy-theme
![Docker:18.09.2](https://img.shields.io/badge/Docker-18.09.2-blue.svg)
![node:v11.10.1](https://img.shields.io/badge/node-v11.10.1-blue.svg)
![npm:6.9.0](https://img.shields.io/badge/npm-6.9.0-blue.svg)
![gulp:3.9.1](https://img.shields.io/badge/gulp-3.9.1-blue.svg)

## 概要
1. ACRE-themeのコンパイル前のソースコード管理
2. CSSの単体テスト
3. SASSのコンパイル  
のためのリポジトリです。

<br>
<br>

## 準備編

### 構築する環境
以下の環境になっていればスタイルガイドを起動できます。手順はこの環境を構築するための操作です。  
もしツールが動かなかったりエラーが表示される場合は、以下の環境が整っていることを確認してください。

1. Mac内でDockerが起動している
2. 以下のフォルダ構成になっている

```
buddy-theme
├── 031/ (各テーマフォルダ)
│   ├── build/
│   ├── devStuff/
│   │   ├── docs/
│   │   ├── src/
│   │   ├── styleguide/
│   │   └── aigis_config.yml
│   ├── lib/
│   ├── gulp_config.json
│   └── gulpfile.js
│
├── common/
│   └── devStuff/
│        ├──aigis_assets
│        ├──edge_src
│        ├──src
│        └──template_hbs
│
├── lib/
│   ├── aigis-markdown/
│   ├── btool-settings/
│   ├── each-part/
│   ├── schemas/
│   ├── *.js
│
├── config/
│   └── **
│
├── ssh/
│   ├── devwork_rsa
│   └── ssh_config.json
│
├── node_modules/
│   └── **
│
├── .dockerignore
├── .stylelintrc.yml
├── _docker-compose.yml
├── all.sh
├── build.sh
├── copy.sh
├── docker-compose.yml
├── Dockerfile
├── gulpfile.js
├── all_parts.sh
├── init.sh
├── lint.sh
├── output.sh
├── package-lock.json
├── package.json
├── README.md
├── set-themes.sh
├── up.sh
├── upload-css.sh
├── upload-img.sh
└── upload.sh
```

<br>

### 全体で最初に実行すること

#### 1. Dockerとnpmのインストール
1. アカウントを作成し、Dockerをインストール  
https://qiita.com/scrummasudar/items/750aa52f4e0e747eed68

2. アプリのアイコンをクリックしDockerを起動する  
Macの上部にアイコンが表示されていればOK

3. 以下のコマンドを実行
```sh
$ cd (buddy-themeフォルダの場所)
$ ./set-themes.sh 031
$ docker-compose run app1 npm ci
```
buddy-themeフォルダ内にdocker-compose.ymlファイルとnode_modulesフォルダがあればOKです。

<br>

#### 2. 関連ファイルの配置
以下のリポジトリをローカルにクローンし、buddy-themeと同じディレクトリに配置してください。
- https://github.com/wmssystem/ACRE-theme

Googleドライブから**devwork_rsa**と**ssh_config.json**をダウンロードし、sshフォルダ内に配置してください。

<br>

#### 3. テスト対象のブランチに変更
ACRE-theme, buddy-themeをそれぞれテスト対象のブランチにチェックアウトされた状態にしてください。

<br>
<br>
<br>

## 利用編

### テーマの設定

```sh
$ ./set-themes.sh (テーマ名)
```

テーマは複数設定することもできます。  
ただし多いほど処理に時間がかかるので、不要なテーマを含まないよう注意してください。  
```sh
$ ./set-themes.sh 031 031A 031B
```

```
app1を031に設定しました
app2を031Aに設定しました
app3を031Bに設定しました
```

<br>
---

### スタイルガイド用ファイルの作成

#### 基本的な部品のみの場合
以下のコマンドを実行  
```sh
$ ./init.sh
```

テーマフォルダ内に以下のファイルが作成されていればOKです。  
- gulpfile.js
- lib/
- devStuff/styleguide/

<br>

#### 基本形に部品を追加したい場合
`lib/user_config`内に`selected_blocks.txt`を作成し、ブロック名を記載してください。  
複数記載する場合はブロック名の間に改行を入れてください。  
**例:**
```txt
mediaXCol
frameWithHCaptionNumIcon
```

その後initを実行
```sh
$ ./init.sh
```

<br>

#### 全部品を作成したい場合
```sh
$ ./all_parts.sh
```
<br>
---

### スタイルガイド起動
1. アプリのアイコンをクリックしDockerを起動  
Macの上部にアイコンが表示されていればOKです。  

2. 以下のコマンドを実行  
```sh
$ cd （buddy-themeフォルダの場所）
$ ./up.sh
```
起動中には、以下のことが自動で実行されます  
- CSSとスタイルガイドの更新  
- bPlacer.md（余白設定値表）の更新  
  - _bPlacer.scssを更新した場合は、bPlacer.mdも合わせてコミットしてください。  

<br>

以下のメッセージが表示された場合は`y`を押してください。  
```sh
Continue with the new image? [y/N]
```

<br>
---

### スタイルガイド表示
ターミナルに  
```sh
[Browsersync] Serving files from:
```
が表示されたら、ターミナルに出力されるlocalのURLを開いてください。  

```sh
local    URL: http://localhost:3001  
```

<br>

クロスブラウザテストで他の端末から接続する場合はターミナルに出力されるExternalのURLを開いてください。  

```sh
External URL: http://192.168.0.19:3001  
```

<br>
---

### CSSを出力
```sh
$ ./build.sh
```

<br>
---

### CSSを出力して開発環境にアップロード
`theme.css`と、`theme_materials/`配下の画像をアップロード
```sh
$ ./upload.sh
```
<br>

`theme.css`のみをアップロード
```sh
$ ./upload-css.sh
```
<br>

`theme_materials/`配下の画像のみをアップロード
```sh
$ ./upload-img.sh
```
```
SFTP error or directory exists: Error: Failure /mnt/efs/master/acre/theme_materials/**
```
**※ 上記のエラーが出てもアップロードは正常に行われるので、無視してください**  

<br>
---

### コードの整形・コーディングスタイルのチェック
```sh
$ ./lint.sh
```
コーディングルールに従ってscssファイルの中身が自動で整形されます。  
自動整形できなかった違反箇所はコンソールにログが出るので、手動で修正してください。  
コードの整形・チェックはpartsディレクトリ配下の.scssファイルしか行わないので注意してください。  

また、コードの中で`/* stylelint-disable */`と`/* stylelint-enable */`で囲んだ範囲は無視されます。  

(ルールセットの中身は`.stylelintrc.yml`に書いてあります)  

**※閉じ括弧などが足りないと不正な出力になってしまうので注意**  

<br>

#### チェック結果の例:
```sh
devStuff/src/parts/_001_frameWithHCaptionNumIcon.scss
  2:51  ✖  Unexpected empty block               block-no-empty
 26:5   ⚠  Unexpected duplicate "#fff"          declaration-block-no-duplicate-properties
```
- 「2行目で✖(エラー)です。ブロックの中身が空です。(ルール:`block-no-empty`)」  
→ 空のブロックを削除してください。

- 「26行目で⚠(警告)です。`#fff`が重複しています。(ルール:`declaration-block-no-duplicate-properties`)」  
→ 重複している項目を修正してください。

<br>

**エディタに拡張機能を入れておくとリアルタイムで確認できます。（推奨）**
- [vscode-stylelint](https://marketplace.visualstudio.com/items?itemName=shinnn.stylelint) (VS code)
- [Sublime​Linter-stylelint](https://packagecontrol.io/packages/SublimeLinter-stylelint) (Sublime Text)
<br>

#### 参考
stylelintのルール一覧  
https://stylelint.io/user-guide/rules

<br>
---

### ACRE-themeへの出力

masterブランチへマージすると自動でcircleCIのジョブが登録されます。  
承認するまで実行されないので、circleCIの画面からWorkflowsを承認してください。  
しばらくすると、ACRE-themeにブランチが作成されます。  
ブランチ名に実行日時が入っているので、対象のブランチをマージしてください。

<br>
---

### テーマの設定とコマンドの実行
各コマンドはテーマ名を設定して実行することもできます(複数指定可能)  

**設定されているテーマで実行する場合の例:**  
現在設定中のテーマで実行されます  
```sh
$ ./init.sh
```

**テーマを設定して実行する場合の例:**  
```sh
$ ./init.sh 031 033
```

**全てのテーマで実行する場合の例:**  
```sh
$ ./init.sh all
```

<br>
<br>
<br>

## こんな時には？

### 以下のようなエラーが表示される
```sh
base_1  | events.js:165
base_1  |       throw er; // Unhandled 'error' event
base_1  |       ^
base_1  | Error: devStuff/src/parts/_033_lv2H.scss
base_1  | Error: Invalid CSS after "...r: $_textColor;": expected "}", was "&:hover "
base_1  |         on line 19 of devStuff/src/parts/_033_lv2H.scss
base_1  | >>       color: $_textColor;
```
SASSの構文エラーです。  
大抵の場合、メッセージ内にエラー内容、ファイル名、行数が書いてありますので、読んで修正してください。

### JSON/HTMLを修正した
```sh
$ ./init.sh
```

### 動作が遅くなってきた
いずれか、または全てを実行してください

- Dockerの再起動

- イメージとコンテナの削除
```sh
$ docker system prune
```

### buddy-themeが更新された

更新を取り込んだあと、`./init.sh (all)` を実行してください。

<br>
<br>

## リポジトリの保守
### 新規テーマ(無印)を作る場合の作成手順
1. **フォルダの作成**  
**base**フォルダを複製し、新しいテーマ名に変更してください。  
**例:**
`base`を複製して`036`に名前変更

2. **devStuff/aigis_config.yml の設定**  
`name:`を新しいテーマ名に設定してください。  
**例:**
`name: Theme 036`

3. **gulp_config.json の設定**  
`"html_templates_dir":`を、対象テーマの部品があるACRE-theme内のフォルダに設定してください。  
**例:**
` "html_templates_dir": "../../ACRE-theme/acre/theme_materials/036/html_templates/"`

4. **config/_colorConfig.scss の設定**
<br>
変数のカラーコードを書き換えることで部品の色を変更できます。  
基本的にカラーコードは _colorConfig.scss 内の変数に格納するようにしてください。  
詳しい使い方はコメントを参照してください。  
<br>

### カラバリテーマ(A~E)を作る場合の作成手順
1. **フォルダの作成**  
**baseA**フォルダを複製し、新しいテーマ名に変更してください。  
**例:** `baseA`を複製して`036A`に名前変更

2. **devStuff/aigis_config.yml の設定**  
`name:`を新しいテーマ名に設定してください。  
**例:** `name: Theme 036A`

3. **gulp_config.json の設定**  
`"html_templates_dir":`を、対象テーマの部品があるACRE-theme内のフォルダに設定してください。  
**例:** ` "html_templates_dir": "../../ACRE-theme/acre/theme_materials/036/html_templates/"`

4. **config/_colorConfig.scss の設定**  
最初に無印の_colorConfig.scssから中身をコピーしてきてください。  
変数のカラーコードを書き換えることで部品の色を変更できます。  
<br>

**画像ファイルは無印の画像ディレクトリと同じ名前にする必要があります。**

<br>
<br>

### docker-compose.ymlを変更する場合
ユーザーがテーマ名を変更するため、`.gitignore`に含めています。  
`_docker-compose.yml`を複製して使うようにしているので、このファイルを変更してください。

<br>


### 関連資料

- [機能／デザイン仕様一覧](https://docs.google.com/spreadsheets/d/1hUg4X2BChH0Uke0HFLX1G4h9MBK__HNb5_TWQ4eL05Y/edit#gid=1396076322)

<br>

## システム仕様

```
lib
├── aigis-markdown/ ･･･aigisに必要なファイル作成
├── btool-settings/ ･･･スタイルガイドに必要な設定ファイル
├── each-part/ ･･･各部品で必要な設定ファイル
├── schemas/ ･･･機能と選択肢に必要な設定ファイル
├── b-placer.js ･･･bPlacerの設定値をMarkdownの表に書き出す
├── data-json-files.js
├── data-json-generator.js
├── html-files.js
├── template-files.js
├── unit-test-settings.js
└── utils.js
```

### エラーが出たときの対応
```sh
Error: EIO: i/o error, open '/buddy-theme/037/temp/html/062_navBItem_navBItem/062_navBItem_navBItem_f99_005_07.html'
```
同時実行数が多すぎなので、blocks.jsonを分割する

```sh
Maximum call stack size exceeded
```
多すぎるページがあるので、バリエーションかテストケースを削減する
