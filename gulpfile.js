const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');
const config = require('./gulp_config.json');
const del = require('del');
const fs = require('fs-extra');
const b_placer = require('./lib/b-placer');
const htmlFiles = require('./lib/html-files');
const templateFiles = require('./lib/template-files');
const dataJsonFiles = require('./lib/data-json-files');
const mergeStream = require('merge-stream');
const sftp = require('gulp-sftp-up4');

gulp.task('stylelint-fix', () => {
  return gulp.src('devStuff/src/parts/*.scss')
  .pipe($.stylelint({ fix: true, failAfterError: false }))
  .pipe(gulp.dest('devStuff/src/parts'));
});

// stylelint-fix時にチェックも入れると拾いきれない場合があるので分割している
gulp.task('stylelint-check', () => {
  return gulp.src('devStuff/src/parts/*.scss')
  .pipe($.stylelint({ failAfterError: false, reporters: [{ formatter: 'string', console: true }] }));
});

// Stylelintで自動整形と構文チェック .stylelintrc.ymlのルール参照
gulp.task('stylelint', gulp.series('stylelint-fix', 'stylelint-check'));

// ファイルが存在しないエラーになるため作成する
gulp.task('mkdir-temp', () => {
  return gulp.src('*.*', {read: false})
  .pipe(gulp.dest('devStuff/temp/css'));
});

gulp.task('compile_to_temp', () => {
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

gulp.task('compile_to_styleguide', () => {
  styleSources = ['devStuff/src/pc-L25.scss', 'devStuff/src/pc-N00.scss', 'devStuff/src/sp.scss'];
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

const get_theme_name = () => __dirname.split('/').pop();

/**
 * @param {*} css_file_name 'pc2-L25.css'
 */
const xtract_variation_and_ratio = (css_file_name) => {
  const [pc_n, ratio_and_extension] = css_file_name.split('-');
  const variation = pc_n.substring(2, 3);
  const [ratio, ] = ratio_and_extension.split('.');
  return ({ 'variation': variation, 'ratio': ratio });
}

const xtract_variation_and_ratio_list = () => {
  const css_file_name_list = fs.readdirSync('devStuff/temp/css');
  let variation_and_ratio_list = [];
  for (const css_file_name of css_file_name_list) {
    if(css_file_name.startsWith('sp')) continue;

    variation_and_ratio_list.push(xtract_variation_and_ratio(css_file_name));
  }
  return variation_and_ratio_list;
}

const output_rename_css = (device, variation_and_ratio, folder) => {
  gulp.src(`devStuff/temp/css/${device}${variation_and_ratio}.css`)
  .pipe($.rename('theme.css'))
  .pipe(gulp.dest(`build/themes/${folder}/${device}/`));
}

const output_css_to_build_folder = (aTheme, variation_and_ratio_list) => {
  for (const variation_and_ratio of variation_and_ratio_list) {
    let folder = `${aTheme}-${variation_and_ratio.ratio}`;
    if (variation_and_ratio.variation) {
      folder += `-${variation_and_ratio.variation}`;
    }
    output_rename_css('pc', `${variation_and_ratio.variation}-${variation_and_ratio.ratio}`, folder);
    output_rename_css('sp', variation_and_ratio.variation, folder);
  }
}

const output_imgs_to_build_folder = (aTheme) => {
  gulp.src('devStuff/src/imgs/**/*.+(jpg|jpeg|png|gif|svg)')
  .pipe($.imagemin())
  .pipe(gulp.dest(`build/theme_materials/${aTheme}/imgs/`));
}

gulp.task('output_to_build_folder', () => {
  const theme = get_theme_name();
  const variation_and_ratio_list = xtract_variation_and_ratio_list();
  output_imgs_to_build_folder(theme);
  output_css_to_build_folder(theme, variation_and_ratio_list);
  return del('devStuff/temp/css');
});

gulp.task('create-b-placer-doc', (done) => {
  if (!fs.existsSync('devStuff/src/config/_bPlacer.scss')) {
    done();
    return;
  }

  b_placer.update_md();
  done();
  }
);

gulp.task('build',
  gulp.series(
    'mkdir-temp',
    gulp.parallel(
      gulp.series('compile_to_temp', 'output_to_build_folder'),
      'create-b-placer-doc'
    )
  )
);

gulp.task('update-styleguide-css', gulp.parallel('compile_to_styleguide', 'create-b-placer-doc'));

gulp.task('update-styleguide-imgs', () => {
  return gulp.src('./devStuff/src/imgs/**/*', { base: './devStuff/src/imgs/' })
  .pipe($.changed('./devStuff/styleguide/imgs/'))
  .pipe($.imagemin())
  .pipe(gulp.dest('./devStuff/styleguide/imgs/'));
});

// スタイルガイド作成用jsonを作成
gulp.task('make-allparts-datajson', () => make_allparts_datajson(''));
gulp.task('make-allparts-datajson2', () => make_allparts_datajson('2'));
gulp.task('make-allparts-datajson3', () => make_allparts_datajson('3'));
gulp.task('make-allparts-datajson4', () => make_allparts_datajson('4'));
gulp.task('make-allparts-datajson5', () => make_allparts_datajson('5'));
gulp.task('make-allparts-datajson6', () => make_allparts_datajson('6'));

const make_allparts_datajson = (num) => {
  return templateFiles.makeAllDatajsonFull(
    config.html_templates_dir,
    `./temp/datajson${num}/`,
    `./btool-settings/parts-categories${num}.json`
  );
}

// スタイルガイド作成用htmlを作成
gulp.task('make-html', () => makeHtml(''));
gulp.task('make-html2', () => makeHtml('2'));
gulp.task('make-html3', () => makeHtml('3'));
gulp.task('make-html4', () => makeHtml('4'));
gulp.task('make-html5', () => makeHtml('5'));
gulp.task('make-html6', () => makeHtml('6'));

const makeHtml = (num) => {
  return dataJsonFiles.makeHtmlFiles(`./temp/html${num}/`, `./temp/datajson${num}/`, config.html_templates_dir, false);
}

// スタイルガイド作成mdファイル作成
gulp.task('make-unittest', () => htmlFiles.makeUnitTestFiles('./temp/html/', './temp/unittest/'));
gulp.task('make-unittest2', () => htmlFiles.makeUnitTestFiles('./temp/html2/', './temp/unittest/'));
gulp.task('make-unittest3', () => htmlFiles.makeUnitTestFiles('./temp/html3/', './temp/unittest/'));
gulp.task('make-unittest4', () => htmlFiles.makeUnitTestFiles('./temp/html4/', './temp/unittest/'));
gulp.task('make-unittest5', () => htmlFiles.makeUnitTestFiles('./temp/html5/', './temp/unittest/'));
gulp.task('make-unittest6', () => htmlFiles.makeUnitTestFiles('./temp/html6/', './temp/unittest/'));

// スタイルガイド作成
gulp.task('make-aigis', () => {
  if (!fs.existsSync('./devStuff/styleguide/css')) {
    fs.mkdirSync('./devStuff/styleguide/css', {recursive: true});
  }
  return gulp.src('devStuff/aigis_config.yml')
  .pipe($.aigis());
});

gulp.task('del-styleguide', () => del('./devStuff/styleguide'));
gulp.task('del-tempfile', () => del('./temp'));

// スタイルガイド作成
gulp.task('update-styleguide',
  gulp.series(
    // 余計なファイルが残っていると動かない場合があるので最初に作業ディレクトリを削除する
    gulp.parallel('del-tempfile', 'del-styleguide', 'update-styleguide-css'),
    // ファイルが多すぎてnode.jsがエラーになるので分割して実行
    gulp.parallel(
      'make-allparts-datajson',
      'make-allparts-datajson2',
      'make-allparts-datajson3',
      'make-allparts-datajson4',
      'make-allparts-datajson5',
      'make-allparts-datajson6'
    ),
    // 同時実行件数が多いとエラーになるので直列処理する
    'make-html',
    'make-html2',
    'make-html3',
    'make-html4',
    'make-html5',
    'make-html6',
    // htmlからmdファイル作成
    gulp.parallel(
      'make-unittest',
      'make-unittest2',
      'make-unittest3',
      'make-unittest4',
      'make-unittest5',
      'make-unittest6'
    ),
    // styleguide作成
    'make-aigis',
    // 作業ディレクトリを削除
    'del-tempfile'
  )
);

// build/とACRE-theme/acre/の間で差分があるファイルを転送する
gulp.task('output_to_ACRE-theme', () => {
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
    host: ssh_config.host_name,
    user: ssh_config.user_name,
    key: {
      location: ssh_config.key_location,
      passphrase: ssh_config.password
    },
    remotePath: ('/mnt/efs/master/acre/themes/')
  }));
}

// SFTP error or directory existsのエラーが出ても気にしないこと
const upload_img = () => {
  const ssh_config = require('../ssh/ssh_config.json');
  return gulp.src([
    'build/theme_materials/**/*'
  ], {
    allowEmpty: true
  })
  .pipe(sftp({
    host: ssh_config.host_name,
    user: ssh_config.user_name,
    key: {
      location: ssh_config.key_location,
      passphrase: ssh_config.password
    },
    remotePath: ('/mnt/efs/master/acre/theme_materials/')
  }));
}

gulp.task('upload-css', (done) => {
  upload_themes();
  done();
});

gulp.task('upload-img', (done) => {
  upload_img();
  done();
});

gulp.task('reload', (done) => {
  browserSync.reload();
  done();
});

gulp.task('watch', () => gulp.watch('devStuff/src/**/*.scss', gulp.series('update-styleguide-css', 'reload')));

gulp.task('server', () => {
  return browserSync({
    server: {
      baseDir: './devStuff/styleguide',
      proxy: 'localhost:3000'
    },
    open: false
  });
});

gulp.task('default',
  gulp.series(
    gulp.parallel('update-styleguide-css', 'update-styleguide-imgs'),
    gulp.parallel('server', 'watch')
  )
);
