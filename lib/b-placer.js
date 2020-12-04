'use strict';

const fs = require('fs-extra');

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
    const matched_sp_line = b_placer_scss_line.match(/\$device\s*==\s*[\'\"]SP[\'\"]/);
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

const update_md = () => {
  const b_placer_record_list = create_b_placer_record_list();
  throw_if_not_exist_sp_value(b_placer_record_list);
  fs.writeFileSync('devStuff/docs/bPlacer.md', to_md_text(b_placer_record_list));
}

module.exports.update_md = update_md;
