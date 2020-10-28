const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');
const config = require('./gulp_config.json');
const del = require('del');
const fs = require('fs-extra');
const make_aigis = require('./lib/make_aigis');
const make_allDatajson = require('./lib/make_all-datajsons');
const make_html = require('./lib/make_html');
const mergeStream = require('merge-stream');
const sassdoc = require('sassdoc');
const sftp = require('gulp-sftp-up4');

// scssを自動整形
gulp.task('stylelint-fix', () => {
  return gulp.src('devStuff/src/parts/*.scss')
  .pipe($.stylelint({
    fix: true,
    failAfterError: false
  }))
  .pipe(gulp.dest('devStuff/src/parts'));
});

// stylelint-fix時にチェックも入れると拾いきれない場合があるので分割している
gulp.task('stylelint-check', () => {
  return gulp.src('devStuff/src/parts/*.scss')
  .pipe($.stylelint({
    failAfterError: false,
    reporters: [{formatter: 'string', console: true}]
  }));
});

// Stylelintで自動整形と構文チェック .stylelintrc.ymlのルール参照
gulp.task('stylelint', gulp.series('stylelint-fix', 'stylelint-check'));

// ビルド前に一時フォルダ作成
gulp.task('mkdir-temp', () => {
  return gulp.src('*.*', {read: false})
  .pipe(gulp.dest('devStuff/temp/css'));
});

// 通常ビルド
gulp.task('sass-build', () => {
  styleSource = ['devStuff/src/**/*.scss'];
  return mergeStream(
    styleSource.map(styleSource => {
      return gulp.src(styleSource)
      .pipe($.sass({outputStyle: 'compressed'}))
      .pipe($.autoprefixer({grid: 'autoplace'}))
      .pipe(gulp.dest('devStuff/temp/css'));
    })
  )
});

// スタイルガイド用ビルド
gulp.task('sass-build-styleguide', () => {
  styleSources = [
    'devStuff/src/pc-L25.scss',
    'devStuff/src/pc-N00.scss',
    'devStuff/src/sp.scss'
  ];
  return mergeStream(
    styleSources.map(styleSource => {
      return gulp.src(styleSource)
      .pipe($.sourcemaps.init())
      .pipe($.sass({outputStyle: 'expanded'}))
      .pipe($.autoprefixer({grid: 'autoplace'}))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('devStuff/styleguide/css'))
    })
  )
});

const get_theme_name = () => {
  return __dirname.split('/').pop();
}

const get_deploy_values = () => {
  var filelist = fs.readdirSync('devStuff/temp/css');
  var deployValues = [];
  for (var file of filelist) {
    var values = file.split('-');
    if (values.length == 1 || values[0].substring(0, 2) != 'pc') continue;
    deployValues.push(create_deploy_hush(values));
  }
  return deployValues;
}

const create_deploy_hush = (aVlues) => {
  var variation = aVlues[0].substring(2, 3);
  var ratio = aVlues[1].split('.')[0];
  return ({
    'variation': variation,
    'ratio': ratio
  });
}

const output_imgs = (aTheme) => {
  gulp.src('devStuff/src/imgs/**/*.+(jpg|jpeg|png|gif|svg)')
  .pipe($.imagemin())
  .pipe(gulp.dest('build/theme_materials/' + aTheme + '/imgs/'));
}

const output_css = (aTheme, aValues) => {
  for (var value of aValues) {
    var folder = aTheme + '-' + value.ratio;
    if (value.variation) {
      folder += '-' + value.variation;
    }
    output_rename_pc_css(value, folder);
    output_rename_sp_css(value, folder);
  }
}

const output_rename_pc_css = (value, folder) => {
  gulp.src('devStuff/temp/css/pc' + value.variation + '-' + value.ratio + '.css')
  .pipe($.rename('theme.css'))
  .pipe(gulp.dest('build/themes/' + folder + '/pc/'));
}

const output_rename_sp_css = (value, folder) => {
  gulp.src('devStuff/temp/css/sp' + value.variation + '.css')
  .pipe($.rename('theme.css'))
  .pipe(gulp.dest('build/themes/' + folder + '/sp/'));
}

gulp.task('create-build', () => {
  var theme = get_theme_name();
  var values = get_deploy_values();
  output_imgs(theme);
  output_css(theme, values);
  return del('devStuff/temp/css');
})

gulp.task('update-sassdoc', () => {
  var options = {
    dest: './devStuff/sassdoc',
    verbose: true,
    display: {
      access: ['public', 'private'],
      alias: true,
      watermark: true,
    },
    groups: {
      'undefined': 'Ungrouped',
      foo: 'Foo group',
      bar: 'Bar group',
    },
    basePath: 'https://github.com/SassDoc/sassdoc',
  };
  return gulp.src('devStuff/src/**/*.scss')
  .pipe(sassdoc(options));
});

const b_placer_lines = () => {
  var b_placer_scss = fs.readFileSync('devStuff/src/config/_bPlacer.scss', 'utf8');
  return b_placer_scss.toString().split('\n');
}

class BPlacerRecord {
  constructor(category, area, name, class_name, variation, pc_value, pc_n00_value, sp_value) {
    this.category = category;
    this.area = area;
    this.name = name;
    this.class_name = class_name;
    this.variation = variation;
    this.pc_value = pc_value;
    this.pc_n00_value = pc_n00_value;
    this.sp_value = sp_value;
  }
  to_td_line() {
    return to_td_line([
      this.category,
      this.area,
      this.name,
      this.class_name,
      this.variation,
      this.pc_value,
      this.pc_n00_value,
      this.sp_value
    ]);
  }
}

const to_td_line = (arr) => {
  return '|' + arr.join('|') + '|';
}

const create_b_placer = (b_placer_base, matched_variation) => {
  // カテゴリー、エリア、名前は前にコメントで出てきた値を使う
  var b_placer = Object.assign(Object.create(Object.getPrototypeOf(b_placer_base)), b_placer_base);
  b_placer.class_name = matched_variation[1].trim();
  if (matched_variation[3]) b_placer.variation = matched_variation[3].trim();
  if (matched_variation[5]) b_placer.pc_n00_value = matched_variation[5].trim();
  b_placer.pc_value = matched_variation[6].trim();
  return b_placer;
}

const update_sp_value = (b_placers, matched_variation) => {
  // PCで作成したb_placerを探し、そのレコードにSPの値を設定する
  var b_placer = b_placers.find((b) => {
    variation = matched_variation[3] ? matched_variation[3].trim() : undefined;
    return b.class_name === matched_variation[1].trim() && b.variation === variation;
  });
  b_placer.sp_value = matched_variation[6].trim();
}

const to_md_text = (b_placers) => {
  const th = ['カテゴリ', 'エリア', '部品名・要素名', 'クラス名', 'バリエーション', 'PC', 'PC<br>(N00)', 'SP'];
  const th_separator_line = new Array(th.length).fill('-');
  var md_table = [to_td_line(th), to_td_line(th_separator_line)];
  b_placers.forEach((b_placer) => {
    md_table.push(b_placer.to_td_line());
  });
  return md_table.join('\n');
}

const create_b_placers = () => {
  // 一度出てきた情報を保持しておくために使います
  // （例）一度01.見出しと出てくれば、次のが出てくるまでずっと01.見出し
  var b_placer_base = new BPlacerRecord();
  var b_placers = [];
  var is_sp = false;
  b_placer_lines().forEach(function(b_placer_line) {
    // $device == "SP" 以降はSPの余白として設定する
    has_matched_sp = b_placer_line.match(/\$device\s*==\s*[\'\"]SP[\'\"]/);
    if (has_matched_sp) is_sp = true;
    // //# で始まるコメントはカテゴリー
    var matched_category = b_placer_line.match(/\/\#\s+(.*)/);
    if (matched_category) b_placer_base.category = matched_category[1].trim();
    // //## で始まるコメントはエリアと名前 | でエリアと名前を区切る
    var matched_area_and_name = b_placer_line.match(/\/\##\s+(.*)/);
    if (matched_area_and_name) {
      var area_and_name = matched_area_and_name[1].trim().split('|');
      b_placer_base.area = area_and_name[0].trim();
      b_placer_base.name = area_and_name[1].trim();
    }
    // .t0-b-で始まる文字はバリエーション
    // [a-zA-Z]がないと数字がバリエーション名の中に紛れてしまう
    // 正規表現がややこしくなるため、スペース等はあまり考慮していません
    // .t0-b-xxxxx(数字 or #{$...} or 無)-bPlacer{@if $layout == "N00" {padding-bottom:00;}@else{padding-bottom:99;}}
    // [0]:全体, [1]:クラス名, [2]:t0-, [3]:バリエーション名, [4]:{}の中身（使わない）, [5]:N00がある場合の余白の値, [6]:N00でない余白の値
    var matched_variation = b_placer_line.match(/(\.(t0-)?b-[\.\_\-a-zA-Z0-9]*[a-zA-Z])(\d*|\#\{\$[a-zA-Z0-9]+\})?-bPlacer{(.+N00.+padding-bottom:(.+?);)?.*padding-bottom:(.+?);}/);
    if (matched_variation) {
      if (!is_sp) {
        b_placers.push(create_b_placer(b_placer_base, matched_variation));
      } else {
        update_sp_value(b_placers, matched_variation);
      }
    }
  });
  return b_placers;
}

gulp.task('create-b-placer-doc', (done) => {
  // ファイルがない場合は実行しない
  if (!fs.existsSync('devStuff/src/config/_bPlacer.scss')) {
    done();
    return;
  }

  const b_placers = create_b_placers();
  fs.writeFileSync('devStuff/docs/bPlacer.md', to_md_text(b_placers));
  done();
  }
);

// ビルド
gulp.task('build', gulp.series('mkdir-temp', 'sass-build', 'create-b-placer-doc', 'create-build'));

// スタイルガイド用cssを更新
gulp.task('update-css', gulp.parallel('sass-build-styleguide', 'create-b-placer-doc'));

// スタイルガイド用imgsを更新
gulp.task('update-imgs', () => {
  return gulp.src('./devStuff/src/imgs/**/*', { base: './devStuff/src/imgs/' })
  .pipe($.changed('./devStuff/styleguide/imgs/'))
  .pipe($.imagemin())
  .pipe(gulp.dest('./devStuff/styleguide/imgs/'));
});

// スタイルガイド作成用jsonを作成
gulp.task('make-allparts-datajson', () => {
  return make_allparts_datajson('');
});

gulp.task('make-allparts-datajson2', () => {
  return make_allparts_datajson('2');
});

gulp.task('make-allparts-datajson3', () => {
  return make_allparts_datajson('3');
});

const make_allparts_datajson = (num) => {
  return make_allDatajson.makeAllDatajsonFull(
    config.html_templates_dir,
    `./temp/datajson${num}/`,
    `./btool-settings/parts-categories${num}.json`
  );
}

// スタイルガイド作成用htmlを作成
gulp.task('make-html', () => {
  return exec_make_html('');
});

gulp.task('make-html2', () => {
  return exec_make_html('2');
});

gulp.task('make-html3', () => {
  return exec_make_html('3');
});

const exec_make_html = (num) => {
  return make_html.makeHtml(
    `./temp/html${num}/`,
    `./temp/datajson${num}/`,
    config.html_templates_dir,
    false
  );
}

// スタイルガイド用mdファイル作成
gulp.task('make-unittest', () => {
  return make_aigis.makeAigis('./temp/html/', './temp/unittest/');
});

gulp.task('make-unittest2', () => {
  return make_aigis.makeAigis('./temp/html2/', './temp/unittest/');
});

gulp.task('make-unittest3', () => {
  return make_aigis.makeAigis('./temp/html3/', './temp/unittest/');
});

// styleguide作成
gulp.task('make-aigis', () => {
  if (!fs.existsSync('./devStuff/styleguide/css')) {
    fs.mkdirSync('./devStuff/styleguide/css', {recursive: true});
  }
  return gulp.src('devStuff/aigis_config.yml')
  .pipe($.aigis());
});

// 作業前に一時フォルダを削除
gulp.task('del-datafile', () => {
  return del(['./temp', './devStuff/styleguide']);
});

// 作業後に一時フォルダを削除
gulp.task('del-tempfile', () => {
  return del('./temp');
});

// スタイルガイド作成
gulp.task('update-styleguide',
  gulp.series(
    // 余計なファイルが残っていると動かない場合があるので最初に作業ディレクトリを削除する
    gulp.parallel('del-datafile', 'update-css'),
    // ファイルが多すぎてnode.jsがエラーになるので分割して実行
    gulp.parallel('make-allparts-datajson', 'make-allparts-datajson2', 'make-allparts-datajson3'),
    // 同時実行件数が多いとエラーになるので直列処理する
    'make-html', 'make-html2', 'make-html3',
    // htmlからmdファイル作成
    gulp.parallel('make-unittest', 'make-unittest2', 'make-unittest3'),
    // styleguide作成
    'make-aigis',
    // 作業ディレクトリを削除
    'del-tempfile'
  )
);

// build/とACRE-theme/acre/の間で差分があるファイルを転送する
gulp.task('output', () => {
  return gulp.src('./build/')
  .pipe($.rsync({
    root: './build/',
    destination: '../../ACRE-theme/acre/',
    archive: true,
    incremental: true,
    recursive: true,
    exclude: '**/.*'
  }));
});

const upload_themes = () => {
  const ssh_config = require('../ssh/ssh_config.json');
  const theme = get_theme_name();
  return gulp.src([
    `build/themes/${theme}-**/**/theme.css`
  ], {
    allowEmpty: true
  })
  .pipe(sftp({
    // 内容はssh_config.jsonに記載
    host: ssh_config.host_name,
    user: ssh_config.user_name,
    key: {
      location: ssh_config.key_location,
      passphrase: ssh_config.password
    },
    remotePath: ('/mnt/efs/master/acre/themes/')
  }));
}

const upload_img = () => {
  const ssh_config = require('../ssh/ssh_config.json');
  return gulp.src([
    // SFTP error or directory existsのエラーが出ても気にしないこと
    'build/theme_materials/**/*'
  ], {
    allowEmpty: true
  })
  .pipe(sftp({
    // 内容はssh_config.jsonに記載
    host: ssh_config.host_name,
    user: ssh_config.user_name,
    key: {
      location: ssh_config.key_location,
      passphrase: ssh_config.password
    },
    remotePath: ('/mnt/efs/master/acre/theme_materials/')
  }));
}

// sftp upload
// FTPサーバーにテーマフォルダのtheme.cssをアップロードする
gulp.task('upload-css', (done) => {
  upload_themes();
  done();
});

// 画像をアップロード
gulp.task('upload-img', (done) => {
  upload_img();
  done();
});

// browserSyncリロード
gulp.task('reload', (done) => {
  browserSync.reload();
  done();
});

// 監視タスク
gulp.task('watch', () => {
  gulp.watch('devStuff/src/**/*.scss', gulp.series('update-css', 'reload'));
});

// webserver立ち上げ
gulp.task('server', () => {
  return browserSync({
    server: {
      baseDir: './devStuff/styleguide',
      routes: {
        '/sassdoc': './devStuff/sassdoc'
      },
      proxy: 'localhost:3000'
    },
    open: false
  });
});

// スタイルガイド起動
gulp.task('default',
  gulp.series(
    gulp.parallel('update-css', 'update-imgs'),
    gulp.parallel('server', 'watch')
  )
);
