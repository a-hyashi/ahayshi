const gulp = require('gulp');
const sass = require('gulp-dart-sass');
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
const blocks = require('./lib/btool-settings/blocks.json');

const stylelint_fix = () => {
  return gulp.src('devStuff/src/parts/*.scss')
  .pipe($.stylelint({ fix: true, failAfterError: false }))
  .pipe(gulp.dest('devStuff/src/parts'));
};

// stylelint-fix時にチェックも入れると拾いきれない場合があるので分割している
const stylelint_check = () => {
  return gulp.src('devStuff/src/parts/*.scss')
  .pipe($.stylelint({ failAfterError: false, reporters: [{ formatter: 'string', console: true }] }));
};

// Stylelintで自動整形と構文チェック .stylelintrc.ymlのルール参照
exports.stylelint = gulp.series(stylelint_fix, stylelint_check);

// ファイルが存在しないエラーになるため作成する
const mkdir_temp = () => {
  return gulp.src('*.*', {read: false})
  .pipe(gulp.dest('devStuff/temp/css'));
};

const compile_to_temp = () => {
  styleSource = ['devStuff/src/**/*.scss'];
  return mergeStream(
    styleSource.map(styleSource => {
      return gulp.src(styleSource)
      .pipe(sass({outputStyle: 'compressed'}))
      .pipe($.autoprefixer({grid: 'autoplace'}))
      .pipe(gulp.dest('devStuff/temp/css'));
    })
  )
};

const compile_to_styleguide = () => {
  styleSources = ['devStuff/src/pc-L25.scss', 'devStuff/src/pc-N00.scss', 'devStuff/src/sp.scss'];
  return mergeStream(
    styleSources.map(styleSource => {
      return gulp.src(styleSource)
      .pipe($.sourcemaps.init())
      .pipe(sass({outputStyle: 'expanded'}))
      .pipe($.autoprefixer({grid: 'autoplace'}))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('devStuff/styleguide/css'))
    })
  )
};

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

const output_to_build_folder = () => {
  const theme = get_theme_name();
  const variation_and_ratio_list = xtract_variation_and_ratio_list();
  output_imgs_to_build_folder(theme);
  output_css_to_build_folder(theme, variation_and_ratio_list);
  return del('devStuff/temp/css');
};

const create_b_placer_doc = (done) => {
  if (!fs.existsSync('devStuff/src/config/_bPlacer.scss')) {
    done();
    return;
  }

  b_placer.update_md();
  done();
};

exports.build = gulp.series(
  mkdir_temp,
  gulp.parallel(
    gulp.series(compile_to_temp, output_to_build_folder),
    create_b_placer_doc
  )
);

const update_styleguide_css = gulp.parallel(compile_to_styleguide, create_b_placer_doc);

const update_styleguide_imgs = () => {
  return gulp.src('./devStuff/src/imgs/**/*', { base: './devStuff/src/imgs/' })
  .pipe($.changed('./devStuff/styleguide/imgs/'))
  .pipe($.imagemin())
  .pipe(gulp.dest('./devStuff/styleguide/imgs/'));
};

// スタイルガイド作成用jsonを作成
const make_base_parts_datajson1 = () => make_parts_datajson('base', 1);
const make_base_parts_datajson2 = () => make_parts_datajson('base', 2);
const make_base_parts_datajson3 = () => make_parts_datajson('base', 3);
const make_base_parts_datajson4 = () => make_parts_datajson('base', 4);
const make_base_parts_datajson5 = () => make_parts_datajson('base', 5);
const make_base_parts_datajson6 = () => make_parts_datajson('base', 6);
const make_addition_parts_datajson1 = () => make_parts_datajson('addition', 1);
const make_addition_parts_datajson2 = () => make_parts_datajson('addition', 2);
const make_addition_parts_datajson3 = () => make_parts_datajson('addition', 3);

const make_parts_datajson = (type, num) => {
  return templateFiles.makeAllDatajsonFull(
    config.html_templates_dir,
    `./temp/${type}/datajson${num}/`,
    blocks[type][num - 1]
  );
}

// スタイルガイド作成用htmlを作成
const make_base_html1 = () => make_html('base', 1);
const make_base_html2 = () => make_html('base', 2);
const make_base_html3 = () => make_html('base', 3);
const make_base_html4 = () => make_html('base', 4);
const make_base_html5 = () => make_html('base', 5);
const make_base_html6 = () => make_html('base', 6);
const make_addition_html1 = () => make_html('addition', 1);
const make_addition_html2 = () => make_html('addition', 2);
const make_addition_html3 = () => make_html('addition', 3);

const make_html = (type, num) => {
  return dataJsonFiles.makeHtmlFiles(`./temp/${type}/html${num}/`, `./temp/${type}/datajson${num}/`, config.html_templates_dir, false);
}

// スタイルガイド作成mdファイル作成
const make_base_unittest1 = () => make_unittest('base', 1);
const make_base_unittest2 = () => make_unittest('base', 2);
const make_base_unittest3 = () => make_unittest('base', 3);
const make_base_unittest4 = () => make_unittest('base', 4);
const make_base_unittest5 = () => make_unittest('base', 5);
const make_base_unittest6 = () => make_unittest('base', 6);
const make_addition_unittest1 = () => make_unittest('addition', 1);
const make_addition_unittest2 = () => make_unittest('addition', 2);
const make_addition_unittest3 = () => make_unittest('addition', 3);

const make_unittest = (type, num) => {
  return htmlFiles.makeUnitTestFiles(`./temp/${type}/datajson${num}/`, `./temp/${type}/html${num}/`, './temp/unittest/');
}

// スタイルガイド作成
const make_aigis = () => {
  if (!fs.existsSync('./devStuff/styleguide/css')) {
    fs.mkdirSync('./devStuff/styleguide/css', {recursive: true});
  }
  return gulp.src('devStuff/aigis_config.yml')
  .pipe($.aigis());
};

const del_styleguide = () => del('./devStuff/styleguide');
const del_tempfile = () => del('./temp');

// スタイルガイド作成
exports.update_styleguide = gulp.series(
  gulp.parallel(
    del_styleguide,
    gulp.series(
      // 余計なファイルが残っていると動かない場合があるので最初に作業ディレクトリを削除する
      del_tempfile,
      // ファイルが多すぎてnode.jsがエラーになるので分割して実行
      gulp.parallel(
        make_base_parts_datajson1,
        make_base_parts_datajson2,
        make_base_parts_datajson3,
        make_base_parts_datajson4,
        make_base_parts_datajson5,
        make_base_parts_datajson6
      ),
      // 同時実行件数が多いとエラーになるので直列処理する
      make_base_html1,
      make_base_html2,
      make_base_html3,
      make_base_html4,
      make_base_html5,
      make_base_html6,
      // htmlからmdファイル作成
      gulp.parallel(
        make_base_unittest1,
        make_base_unittest2,
        make_base_unittest3,
        make_base_unittest4,
        make_base_unittest5,
        make_base_unittest6
      )
    )
  ),
  // styleguide作成
  make_aigis
);

// build/とACRE-theme/acre/の間で差分があるファイルを転送する
exports.output_to_ACRE_theme = () => {
  return gulp.src('./build/')
  .pipe($.rsync({
    root: './build/',
    destination: '../../ACRE-theme/acre/',
    archive: true,
    incremental: true,
    recursive: true,
    exclude: '**/.*'
  }));
};

exports.upload_css = () => {
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
    remotePath: ('/mnt/master/acre/themes/')
  }));
}

// SFTP error or directory existsのエラーが出ても気にしないこと
exports.upload_img = () => {
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
    remotePath: ('/mnt/master/acre/theme_materials/')
  }));
}

const reload = (done) => {
  browserSync.reload();
  done();
};

const watch = () => gulp.watch('devStuff/src/**/*.scss', gulp.series(update_styleguide_css, reload));

const server = () => {
  return browserSync({
    server: {
      baseDir: './devStuff/styleguide',
      proxy: 'localhost:3000'
    },
    open: false
  });
};

exports.default = gulp.series(
  gulp.parallel(update_styleguide_css, update_styleguide_imgs),
  gulp.parallel(server, watch)
);
