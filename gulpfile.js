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

const read_b_placer_scss_lines = () => {
  const b_placer_scss = fs.readFileSync('devStuff/src/config/_bPlacer.scss', 'utf8');
  return b_placer_scss.split('\n');
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

const to_td_line = (arr) => `|${arr.join('|')}|`;

class BPlacerline {
  constructor(matched_line) {
    this.matched_line = matched_line;
  }

  has_matched() {
    return !!this.matched_line;
  }

  trim_index_of(index) {
    return this.matched_line[index] ? this.matched_line[index].trim() : '';
  }

  class_name() {
    return this.trim_index_of(1);
  }

  variation() {
    return this.trim_index_of(3);
  }

  pc_n00_value() {
    return this.trim_index_of(5);
  }

  value() {
    return this.trim_index_of(6);
  }
}

const create_b_placer_record = (b_placer_base_record, b_placer_line) => {
  // カテゴリー、エリア、名前は前にコメントで出てきた値を使う
  let b_placer_record = Object.assign(Object.create(Object.getPrototypeOf(b_placer_base_record)), b_placer_base_record);
  b_placer_record.class_name = b_placer_line.class_name();
  b_placer_record.variation = b_placer_line.variation();
  b_placer_record.pc_n00_value = b_placer_line.pc_n00_value();
  b_placer_record.pc_value = b_placer_line.value();
  return b_placer_record;
}

const set_sp_value = (b_placer_record_list, b_placer_line) => {
  const target_class_name = b_placer_line.class_name();
  const target_variation = b_placer_line.variation();
  // PCで作成したb_placerを探し、そのレコードにSPの値を設定する
  let found_b_placer_record = b_placer_record_list.find((b_placer_record) => {
    return b_placer_record.class_name === target_class_name && b_placer_record.variation === target_variation;
  });
  if(!found_b_placer_record) throw Error(`PCにバリエーションがありません。クラス：${target_class_name}、バリエーション：${target_variation}`);

  found_b_placer_record.sp_value = b_placer_line.value();
}

const to_md_text = (b_placer_record_list) => {
  const th = ['カテゴリ', 'エリア', '部品名・要素名', 'クラス名', 'バリエーション', 'PC', 'PC<br>(N00)', 'SP'];
  const th_separator_line = new Array(th.length).fill('-');
  let md_table = [to_td_line(th), to_td_line(th_separator_line)];
  b_placer_record_list.forEach((b_placer_record) => {
    md_table.push(b_placer_record.to_td_line());
  });
  return md_table.join('\n');
}

const create_b_placer_record_list = () => {
  // 一度出てきた情報を保持しておくために使います
  // （例）一度01.見出しと出てくれば、次のが出てくるまでずっと01.見出し
  let b_placer_base_record = new BPlacerRecord();
  let b_placer_record_list = [];
  let is_sp = false;
  read_b_placer_scss_lines().forEach((b_placer_scss_line) => {
    // $device == "SP" 以降はSPの余白として設定する
    matched_sp_line = b_placer_scss_line.match(/\$device\s*==\s*[\'\"]SP[\'\"]/);
    if (matched_sp_line) is_sp = true;
    // //# で始まるコメントはカテゴリー
    const matched_category_line = b_placer_scss_line.match(/\/\#\s+(.*)/);
    if (matched_category_line) b_placer_base_record.category = matched_category_line[1].trim();
    // //## で始まるコメントはエリアと名前 | でエリアと名前を区切る
    const matched_area_and_name_line = b_placer_scss_line.match(/\/\##\s+(.*)/);
    if (matched_area_and_name_line) {
      const [area, name] = matched_area_and_name_line[1].trim().split('|');
      b_placer_base_record.area = area.trim();
      b_placer_base_record.name = name.trim();
    }
    // .t0-b-で始まる文字はbPlacer
    // [a-zA-Z]がないと数字がバリエーション名の中に紛れてしまう
    // 正規表現がややこしくなるため、スペース等はあまり考慮していません
    // .t0-b-xxxxx(数字 or #{$...} or 無)-bPlacer{@if $layout == "N00" {padding-bottom:00;}@else{padding-bottom:99;}}
    // [0]:全体, [1]:クラス名, [2]:t0-, [3]:バリエーション名, [4]:{}の中身（使わない）, [5]:N00がある場合の余白の値, [6]:N00でない余白の値
    const matched_b_placer_line = b_placer_scss_line.match(/(\.(t0-)?b-[\.\_\-a-zA-Z0-9]*[a-zA-Z])(\d*|\#\{\$[a-zA-Z0-9]+\})?-bPlacer{(.+N00.+padding-bottom:(.+?);)?.*padding-bottom:(.+?);}/);
    const b_placer_line = new BPlacerline(matched_b_placer_line);
    if (b_placer_line.has_matched()) {
      if (!is_sp) {
        b_placer_record_list.push(create_b_placer_record(b_placer_base_record, b_placer_line));
      } else {
        set_sp_value(b_placer_record_list, b_placer_line);
      }
    }
  });
  return b_placer_record_list;
}

const throw_if_not_exist_sp_value = (b_placer_record_list) => {
  const error_message_list = b_placer_record_list.filter((b_placer_record) => {
    return !b_placer_record.sp_value;
  }).map((b_placer_record) => {
    return `クラス：${b_placer_record.class_name}、バリエーション：${b_placer_record.variation}`;
  });
  if(error_message_list.length) throw new Error(`SPにバリエーションがありません。\n${error_message_list.join('\n')}`);
}

gulp.task('create-b-placer-doc', (done) => {
  if (!fs.existsSync('devStuff/src/config/_bPlacer.scss')) {
    done();
    return;
  }

  const b_placer_record_list = create_b_placer_record_list();
  throw_if_not_exist_sp_value(b_placer_record_list);
  fs.writeFileSync('devStuff/docs/bPlacer.md', to_md_text(b_placer_record_list));
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

const make_allparts_datajson = (num) => {
  return make_allDatajson.makeAllDatajsonFull(
    config.html_templates_dir,
    `./temp/datajson${num}/`,
    `./btool-settings/parts-categories${num}.json`
  );
}

// スタイルガイド作成用htmlを作成
gulp.task('make-html', () => exec_make_html(''));
gulp.task('make-html2', () => exec_make_html('2'));
gulp.task('make-html3', () => exec_make_html('3'));
gulp.task('make-html4', () => exec_make_html('4'));

const exec_make_html = (num) => {
  return make_html.makeHtml(`./temp/html${num}/`, `./temp/datajson${num}/`, config.html_templates_dir, false);
}

// スタイルガイド作成mdファイル作成
gulp.task('make-unittest', () => make_aigis.makeAigis('./temp/html/', './temp/unittest/'));
gulp.task('make-unittest2', () => make_aigis.makeAigis('./temp/html2/', './temp/unittest/'));
gulp.task('make-unittest3', () => make_aigis.makeAigis('./temp/html3/', './temp/unittest/'));
gulp.task('make-unittest4', () => make_aigis.makeAigis('./temp/html4/', './temp/unittest/'));

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
    gulp.parallel('make-allparts-datajson', 'make-allparts-datajson2', 'make-allparts-datajson3', 'make-allparts-datajson4'),
    // 同時実行件数が多いとエラーになるので直列処理する
    'make-html',
    'make-html2',
    'make-html3',
    'make-html4',
    // htmlからmdファイル作成
    gulp.parallel('make-unittest', 'make-unittest2', 'make-unittest3', 'make-unittest4'),
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
