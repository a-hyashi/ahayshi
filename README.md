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
├── 031（各テーマ）
│   ├── copy.sh
│   ├── gulp_config.json
│   ├── gulpfile.js
│   ├── lib
│   │   └── ･･･
│   └── styleguide_assets
│   │   └── ･･･
│   └── unittest
│       └── ･･･
├── btool-settings
│   ├── buddy-parts-testcases.json
│   ├── function-design.json
│   └── parts-categories.json
├── ssh
│   ├── devwork_rsa
│   └── sshconfig.json
├── copy.sh
├── Dockerfile
├── _docker-compose.yml
├── docker-compose.yml
├── gulpfile.js
├── package.json
├── package-lock.json
└── node_modules
    └── ･･･
```

<br>

### 全体で一度だけ実行すること

#### Dockerとnpmのインストール
1. アカウントを作成し、Dockerをインストール  
https://qiita.com/scrummasudar/items/750aa52f4e0e747eed68

2. アプリのアイコンをクリックしDockerを起動する  
Macの上部にアイコンが表示されていればOK

3. 以下のコマンドを実行
```sh
$ cd （buddy-themeフォルダの場所）
$ ./set-themes.sh 031
$ docker-compose run web1 npm install
```
buddy-themeフォルダ内にdocker-compose.ymlファイルとnode_modulesフォルダがあればOKです。

#### 関連ファイルの配置
以下のリポジトリをローカルにクローンし、buddy-themeと同じディレクトリに配置してください。
- https://github.com/wmssystem/ACRE-theme

Googleドライブから**devwork_rsa**と**ssh_config.json**をダウンロードし、sshフォルダ内に配置してください。

<br>

#### テスト対象のブランチに変更
ACRE-theme, buddy-themeをそれぞれテスト対象のブランチにチェックアウトされた状態にしてください。

<br>

### テーマの設定

```sh
$ ./set-themes.sh (テーマ名)
```

テーマは複数設定することもでき、1から順にコンテナに割り当てられます。  
2〜3個を想定していますが、9個まで設定可能です。  
ただし多いほど処理に時間がかかるので、不要なテーマを含まないよう注意してください。  
```sh
$ ./set-themes.sh 031 031A 031B
```

```
コンテナ1：031
コンテナ2：031A
コンテナ3：031B
テーマを設定しました
```

<br>

### テーマごとに一度だけ実行すること

```sh
$ ./init.sh
```

指定したテーマフォルダ内に以下のファイルが作成されていればOKです。
- gulpfile.js
- lib/
- /unittest/parts/フォルダ内に部品名.md

<br>
<br>

## 利用編

### 起動
1. アプリのアイコンをクリックしDockerを起動  
Macの上部にアイコンが表示されていればOKです。

2. 以下のコマンドを実行
```sh
$ cd （buddy-themeフォルダの場所）
$ ./up.sh
```
CSSの更新は自動で反映されます。

以下のメッセージが表示された場合は`y`を押してください。
```sh
Continue with the new image? [yN]
```

起動中には、以下のことが自動で実行されます
- CSSとスタイルガイドの更新
- bPlacer.md（余白設定値表）の更新  
_bPlacer.scssを更新した場合は、bPlacer.mdも合わせてコミットしてください。

<br>

### スタイルガイド表示
```sh
[Browsersync] Serving files from:
```

が表示されたら
http://localhost:ポート番号  
を開いてください。  
ポート番号は3000 + コンテナ番号です  
**例:** コンテナ1の場合  
http://localhost:3001  


クロスブラウザテストで他の端末から接続する場合は  
`ターミナルに出力される外部URL + ポート番号`を開いてください  
**例:** コンテナ1の場合  
http://192.168.0.12:3001  


<br>

### 停止
```
Ctrl + C
```

<br>

### CSSを出力
```sh
$ ./build.sh
```

<br>

### 出力した内容を開発環境にアップロード
`theme.css`と、`theme_materials/`配下全てをアップロード
```sh
$ ./upload.sh
```
<br>

`theme.css`をアップロード
```sh
$ ./upload-css.sh
```
<br>

`theme_materials/`配下全てをアップロード
```sh
$ ./upload-img.sh
```
```
SFTP error or directory exists: Error: Failure /mnt/efs/master/acre/theme_materials/**
```
**※ 上記のエラーが出てもアップロードは正常に行われるので、無視してください**

<br>


### 整形・コーディングスタイルのチェック
```sh
$ ./lint.sh
```
コーディングルールに従ってscssファイルの中身が自動で整形されます。  
自動整形できなかった違反箇所はコンソールにログが出るので、手動で修正してください。

**※コードの整形・チェックはpartsディレクトリ配下の.scssファイルしか行わないので注意**  
**※閉じ括弧などが足りないと不正な出力になってしまうので注意** 

#### エラーの例:
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

エディタに拡張機能を入れておくとリアルタイムでエラーを発見できます。(推奨)
- [vscode-stylelint](https://marketplace.visualstudio.com/items?itemName=shinnn.stylelint) (VS code)
- [Sublime​Linter-stylelint](https://packagecontrol.io/packages/SublimeLinter-stylelint) (Sublime Text)
<br>

また、コードの中で`/* stylelint-disable */`と`/* stylelint-enable */`で囲んだ範囲は無視されます。

#### 参考
stylelintのルール一覧  
https://stylelint.io/user-guide/rules

<br>


### 別コンテナでの実行
上に記載した`./up.sh`以外のコマンドは、引数の指定ができます。  
並行して2つ以上のテーマを開発するための機能なので、1つのテーマのみ開発している場合は気にしなくて問題ありません。

**例:** buildの場合  
```sh
$ ./build.sh
```
引数を指定しない場合、コンテナ1で実行

<br>

```sh
$ ./build.sh 2 3
```
番号を指定した場合、指定番号のコンテナで実行

<br>

```sh
$ ./build.sh all
```
allを指定した場合、コンテナに関係なく全てのテーマで実行

<br>

### ACRE-themeへの出力

masterブランチへマージすると自動でcircleCIのジョブが登録されます。  
承認するまで実行されないので、circleCIの画面からWorkflowsを承認してください。  
しばらくすると、ACRE-themeにブランチが作成されます。  
ブランチ名に実行日時が入っているので、対象のブランチをマージしてください。

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
$ ./update-parts.sh
```

### sassdocが更新された
```sh
$ docker-compose run web1 gulp update-sassdoc
```

### 動作が遅くなってきた
いずれか、または全てを実行してください

- Dockerの再起動

- コンテナの削除
```sh
$ docker container prune
```

### buddy-themeが更新された

更新を取り込んだあと、

> テーマごとに一度だけ実行すること

を再実行してください。

<br>
<br>

## リポジトリの保守

### 新しいテーマを作る場合
1. フォルダの作成
既存のテーマのフォルダを複製し、新しいテーマ名にリネームしてください。  
**例:**
031を複製して031Aのフォルダを作成

2. devstuff/aigis_config.ymlの設定  
nameを新しいテーマ名に設定してください。  
**例:**
Theme 031A

3. gulp_config.jsonの設定  
html_templates_dirをACRE-theme内の対象テーマの部品があるフォルダに設定してください。  
**例:**
"../../ACRE-theme/acre/theme_materials/031/html_templates/"

<br>

### docker-compose.ymlを変更する場合
ユーザーがテーマ名を変更するため、.gitignoreに含めています。  
`_docker-compose.yml`を複製して使うようにしているので、このファイルを変更してください。

<br>


### 関連資料

- [機能／デザイン仕様一覧](https://docs.google.com/spreadsheets/d/1hUg4X2BChH0Uke0HFLX1G4h9MBK__HNb5_TWQ4eL05Y/edit#gid=1396076322)

<br>

## システム仕様

```
lib
├── aigis-markdown
│   ├── abstract_aigis_markdown.js
│   ├── aigis_inner_markdown.js
│   ├── aigis_yaml.js
│   └── unittest.js
├── btool-settings
│   ├── buddy-parts-testcases.json
│   ├── function-design.json
│   └── parts-categories.json
├── make_aigis.js
├── make_all-datajsons.js
├── make_datajson.js
├── make_html.js
├── schemas
│   ├── dataSchema.json
│   └── metaSchema.json
└── utils
    ├── breadcrumbs001.json
    ├── buddy-parts-design.json
    ├── buddy-parts-functions.js
    ├── buddy-parts-functions.json
    ├── data-json-generator.js
    ├── formTableAll.json
    ├── sideMenu001.json
    └── utils.js
```

### btool-settings
buddy-themeの設定情報等を格納する

#### buddy-parts-testcases.json
テストケース情報を設定しているファイル
- [生成用スプレッドシート](https://docs.google.com/spreadsheets/d/16pk-IFDGNxv7gjVvLemW0kNlOwpuLdcpc8zJYL81N6Y/edit#gid=318273719)
- 単体テスト > make buddy parts testcases json

#### function-design.json
標準機能仕様、ブロック個別機能仕様を一覧で管理する情報
- [生成用スプレッドシート](https://docs.google.com/spreadsheets/d/1hUg4X2BChH0Uke0HFLX1G4h9MBK__HNb5_TWQ4eL05Y/edit#gid=1396076322)
- 出力 > function-design.json

#### parts-categories.json
部品とCSSブロックのマッピング情報
- JSONを直接更新する

<br>

### schemas
dataJson, metaJsonのスキーマ情報

<br>

### utils

#### buddy-parts-functions.json
機能初期値、テスト値とブロックの対応状況の定義情報
- JSONを直接更新する

#### buddy-parts-design.json
デザイン仕様を確認するための機能とマッピング
- JSONを直接更新する

#### ブロック専用jsonファイル
ブロック固有の事情で必要になるファイル
- JSONを直接更新する
