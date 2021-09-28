'use strict';

const fs = require('fs-extra');
const unitTestSettings = require('./btool-settings/unit-test-settings.json');
const formTableAll = require('./each-part/formTableAll.json');
const _ = require('lodash');

module.exports = class BuddyPartsFunctions {
  /**
   * 渡されたdataが、functionIdの機能を持っているか判断する。
   * @param data datajsonオブジェクト
   * @param functionId 機能IDの文字列
   */
  static hasFunction(data, functionId) {
    if(!unitTestSettings[functionId]['specifications']) return false;

    return unitTestSettings[functionId]['specifications'].some(specification => {
      return specification['testCases'].some(testCase => {
        return testCase['blocks'].includes(data['blockName']);
      });
    });
  }

  /**
   * 有効な機能IDの一覧を返す
   */
  static targetFunctionIds(data) {
    return Object.keys(unitTestSettings).filter((functionId) => {
      return module.exports.hasFunction(data, functionId);
    });
  }

  /**
   * 全機能パターンのdatajsonを配列で返す
   */
  static allFunctionalDatas(functionId, data, config) {
    if(!(functionId in dataMakeFunctions)) {
      if(!['a00', 'f00', 'f01'].includes(functionId)) {
        console.warn('入力したfunctionIdに対する機能パターン生成がありません。');
        console.warn(`functionId: ${functionId}, data.templateDir: ${data.templateDir}`);
      }
      return false;
    }
    return dataMakeFunctions[functionId](data, unitTestSettings[functionId], config);
  }
}

/**
 * dataをpropertiesの値で書き換える。
 * @param {*} data
 * @param {*} properties
 */
const makeDataWProperties = (data, properties) => {
  let _textChangeFunction = [];
  _textChangeFunction.push('href');
  for(const key of Object.keys(properties)) {
    if(key === 'spacingTweak') {
      data.data[key] = properties[key]['value'];
    }
    if(data.data[key] !== undefined) {
      data.data[key] = properties[key]['value'];
    }
  }
  for (let content of _.map(data.data.contents)) {
    let hasFunctionFlag = false;
    let textChangeFlag = false;
    for(const key of Object.keys(properties)) {
      if(_textChangeFunction.includes(key)) {
        textChangeFlag = true;
      }
      if(content[key] !== undefined) {
        content[key] = properties[key]['value'];
        hasFunctionFlag = true;
      }
    }
    if(textChangeFlag && content['text'] !== undefined) {
      content['text'] = hasFunctionFlag ? '機能対象エリア' : '対象外'
    }
  }
  return data;
}

/**
 * dataをpropertiesの値で書き換える。
 * @param {*} data
 * @param {*} properties
 * @param {*} name
 */
const makeDataWPropertiesMany = (data, properties, name) => {
  let now = 0;
  for (let content of _.map(data.data.contents)) {
    if(content[name] !== undefined) {
      content[name] = properties[now][name]['value'];
      now++;
    }
  }
  return data;
}

/**
 * dataオブジェクト内にnameパラメータが何回登場するかをカウントして返す。最小値１。
 * @param {*} data
 * @param {*} name
 */
const countParameter = (data, name) => {
  let count = 0;
  if(data.data[name] !== undefined) {
    count++;
  }
  for(const content of _.map(data.data.contents)) {
    if(content[name] !== undefined) {
      count++
    }
  }
  return count;
}

/**
 * properitesMap配列をcountPのサイズ長に適切に分割して返す。
 * 割り切れない場合は、最後の配列は後方から切り出す。
 * @param {*} propertiesMap
 * @param {*} countP
 */
const dividePropateies = (propertiesMap, countP) => {
  if(countP == 1) return [].push(propertiesMap);

  let divProperties = [];
  let divIndexes = [];
  const num = propertiesMap.length;
  let start = 0;
  let end = countP;
  let check = true;
  while(check) {
    if(end >= num) {
      divProperties.push(propertiesMap.slice(-1 * countP));
      divIndexes.push(end);
      check = false;
    }else{
      divProperties.push(propertiesMap.slice(start, end));
      divIndexes.push(end);
      start += countP;
      end += countP;
    }
  }
  return [divProperties, divIndexes];
};

/**
 * メニュー比較用の文字に変更する.
 * @param {*} data
 */
const replaceMenuText = (data) => {
  let _data = _.cloneDeep(data);
  // 改行対応
  _data.data.contents['1']['label'] = '改行あり<br>改行あり';
  // 最小文字対応
  _data.data.contents['2']['label'] = '';
  // 最大文字対応
  _data.data.contents['3']['label'] = 'あいうえおかきくけこさしすせそ';
  return _data;
}

const select_properties = (pf, blockName) => {
  if('properties' in pf) return pf['properties'];

  for(const propertyPattern of pf['propertyPatterns']) {
    if(propertyPattern['blocks'].includes(blockName)) {
      return propertyPattern['properties'];
    }
  }
}

/**
 * 2017/11/22 naddy
 * 以降のforXXXのメソッド群は、共通処理を括ってクラスにしておきたい。
 * 開発環境として、利用する際にちゃんと考えよう。
 * 共通クラスとして、makeDataJsonsクラスとか作っといて。
 * 実行する流れもそこで定義しておいて、各クラスで個別処理を実装する。みたいな。
 * →要は、テンプレートメソッド
 */

/**
 * 列挙型１つの場合の対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forEnum = (data, pf, _config) => {
  let _properties = select_properties(pf, data['blockName']);
  const _propertiesKeys = Object.keys(_properties);
  const _propertiesMap = _properties[_propertiesKeys[0]]['value'].map((value) => {
    let __propaties = {};
    __propaties[_propertiesKeys[0]] = {};
    __propaties[_propertiesKeys[0]]['value'] = value;
    return __propaties;
  });
  const _labelsArray = _properties[_propertiesKeys[0]]['label'];
  let datas = [];
  for(let i = 0; i < _propertiesMap.length; i++) {
    let _dataobj = {};
    let _data = _.cloneDeep(data);
    _data = makeDataWProperties(_data, _propertiesMap[i]);
    _dataobj[_labelsArray[i]] = _data;
    datas.push(_dataobj);
  }
  return datas;
}

/**
 * アイコンの戻り値を作成する.
 */
const makeIconDates = (data, propertiesMap, labelsArray) => {
  let datas = [];
  const countP = countParameter(data, 'iconType');
  if(countP == 1) {
    for(let i = 0; i < propertiesMap.length; i++) {
      let _dataobj = {};
      let _data = _.cloneDeep(data);
      _data = makeDataWProperties(_data, propertiesMap[i]);
      _dataobj[labelsArray[i]] = _data;
      datas.push(_dataobj);
    }
  } else {
    const [_divPropateies, _divIndexes] = dividePropateies(propertiesMap, countP);
    const _name = Object.keys(propertiesMap[0])[0];
    for(let i = 0; i < _divPropateies.length; i++) {
      let _dataobj = {};
      let _data = _.cloneDeep(data);
      _data = makeDataWPropertiesMany(_data, _divPropateies[i], _name);
      const _labelStr = `${labelsArray[_divIndexes[i] - countP]} 〜 ${labelsArray[_divIndexes[i] - 1]}`;
      _dataobj[_labelStr] = _data;
      datas.push(_dataobj);
    }
  }
  return datas;
}

/**
 * アイコンの場合の対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forIconType = (data, pf, _config) => {
  const _properties = select_properties(pf, data['blockName']);
  let _labelsArray = [];
  let _propertiesMap;
  if(('size' in _properties)) {
    _propertiesMap = _properties['iconType']['value'].map((iconType) => {
      return _properties['size']['value'].map((size) => {
        _labelsArray.push(`アイコン設定: ${iconType}、サイズ設定: ${size}`);
        let __propaties = {};
        __propaties['iconType'] = {};
        __propaties['iconType']['value'] = iconType;
        __propaties[['size']] = {}
        __propaties[['size']]['value'] = size;
        return __propaties;
      });
    }).flat();
  } else {
    _propertiesMap = _properties['iconType']['value'].map((value) => {
      let __propaties = {};
      __propaties['iconType'] = {};
      __propaties['iconType']['value'] = value;
      return __propaties;
    });
    _labelsArray = _properties['iconType']['label'];
  }
  return makeIconDates(data, _propertiesMap, _labelsArray);
}

/**
 * 真理値の場合の対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forBoolean = (data, pf, _config) => {
  const _properties = pf.properties;
  const _propertiesKeys = Object.keys(_properties);
  const _propertiesMap = [true, false].map((value) => {
    let __propaties = {};
    for(let i = 0; i < _propertiesKeys.length; i++) {
      __propaties[_propertiesKeys[i]] = {};
      __propaties[_propertiesKeys[i]]['value'] = value;
    }
    return __propaties;
  });
  const _labelsArray = ['チェックオン／設定が有効なパターン', 'チェックオフ／設定が無効なパターン'];
  let datas = [];
  for(let i = 0; i < _propertiesMap.length; i++) {
    let _dataobj = {};
    let _data = _.cloneDeep(data);
    _data = makeDataWProperties(_data, _propertiesMap[i]);
    _dataobj[_labelsArray[i]] = _data;
    datas.push(_dataobj);
  }
  return datas;
}

/**
 * 均等配置の場合の対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forWidthEqualized = (data, pf, config) => {
  let _data = replaceMenuText(data);
  return forBoolean(_data, pf, config);
}

/**
 * カレントの場合の対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forEmCurrent = (data, _pf, _config) => {
  const _labelsArray = ['通常、強調、カレント、強調＋カレント'];
  let datas = [];
  let _dataobj = {};
  let _data = _.cloneDeep(data);
  const keys = Object.keys(_data.data.contents);
  for(let i = 0; i < keys.length; i++) {
    if(i == 0) {
      // なし
      _data.data.contents[keys[i]].href = '#';
      _data.data.contents[keys[i]].label = '通常';
    }else if(i == 1) {
      // 強調のみ
      _data.data.contents[keys[i]].strong = true;
      _data.data.contents[keys[i]].href = '#';
      _data.data.contents[keys[i]].label = '強調';
    }else if(i == 2) {
      // カレントのみ
      _data.data.contents[keys[i]].label = 'カレント';
      _data.data.contents[keys[i]].isCurrentPage = 'state-current';
      _data.data.contents[keys[i]].href = '#';
    }else if(i == 3) {
      // 強調＋カレント
      _data.data.contents[keys[i]].strong = true;
      _data.data.contents[keys[i]].label = '強調+カレント';
      _data.data.contents[keys[i]].isCurrentPage = 'state-current';
      _data.data.contents[keys[i]].href = '#';
    }
  }
  _dataobj[_labelsArray[0]] = _data;
  datas.push(_dataobj);
  return datas;
}
// state-current

/**
 * 列挙型＋ユーザー指定値の場合の対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forEnumWidthUserValue = (data, pf, config) => {
  const _properties = pf.properties;
  let datas = [];
  for (let key of Object.keys(_properties)) {
    let _datas;
    let _pf = {};
    _pf.properties = {};
    _pf.properties[key] = _.cloneDeep(_properties[key]);
    if(_properties[key].type === 'enum') {
      _datas = forEnum(data, _pf, config);
    }else if(_properties[key].type === 'string' || _properties[key].type === 'integer') {
      _datas = forSetStrings(data, _pf, config);
    }
    datas = datas.concat(_datas);
  }
  return datas;

}

const STR_VALUE_TYPE = {
  'href': 'リンク設定あり',
  'anchor': 'アンカーフラグ設定あり',
  'html': 'ダミー用HTML設定あり',
  'userEditColWidth': 'ユーザー設定値',
  'target': 'リンク設定あり',
  'userEditWidth': 'ユーザー設定値',
  'spUserEditWidth': 'ユーザー設定値',
  'f07': 'ユーザー設定値',
  'f11': 'リンク設定あり',
  'f13': 'ユーザー設定値',
  'f16': 'アンカーフラグ設定あり',
  'f22': 'ダミー用HTML設定あり'
};

/**
 * すべてが文字型の場合の対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forSetStrings = (data, pf, _config) => {
  const _properties = pf.properties;
  let _data = _.cloneDeep(data);
  _data = makeDataWProperties(_data, _properties)
  const _labelstr = Object.keys(_properties).reduce((pre, key) => {
    if(!(key in STR_VALUE_TYPE)) return pre;
    if(pre) return pre;
    if(STR_VALUE_TYPE[key]) return STR_VALUE_TYPE[key];

    return '';
  }, '');
  let _dataobj = {};
  _dataobj[_labelstr] = _data;
  return [_dataobj]
}

/**
 * SPでの表示想定
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forSP = (data, _pf, _config) => {
  let _data = _.cloneDeep(data);
  _data.data['isSP'] = true;
  let _dataobj = {};
  _dataobj['SPの表示想定'] = _data;
  return [_dataobj];
}

// textで使う定数
const NAV_LIST = '<ul><li>[innerText]</li><li>[innerText]</li></ul>';
const TABLE = '<table><tbody><tr><th>[innerText]</th><th><span>項目2</span></th><th><span>項目3</span></th><th><span>項目4</span></th></tr><tr><td>[innerText]</td><td><span>2</span></td><td><span>3</span></td><td><span>4</span></td></tr></tbody></table>';
const TEMPLATE = {
  'priceTable': '<table><tbody><tr><th style="width:50%;">[innerText]</th><td style="width:50%; text-align:right;">[innerText]</td></tr></tbody></table>',
  'navList': NAV_LIST,
  'footerUnit-navList': NAV_LIST,
  'sideBoxList': NAV_LIST,
  'table': TABLE,
  'sideBoxTable': TABLE,
  'footerUnit-table': TABLE,
  'headerUnit-table': TABLE
};
const MIN_TEXT = '';
const MAX_TEXT = '方針は日本語要件を列挙でき原則ないますため、侵害しれ記事に漏洩者可能の著作技術を定めるれてはさませ、対象の事典は、著作生じる作品を違反いいことに対し一見必要あるあるていません。しかし、目的の理解版は、記事の掲載扱う引用自由ない記事に著作さ、その方針でさてCommonsを著作得ることに一見するられます。たとえばで、引用コモンズが達成しればい本が仮にするすることは、批判ですます、場合によっては調査者の引用として文章上の問題はしことを、被許諾物は、十分の承諾を得て下を引用しあるてなりなで。';
const MAX_ENG_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
const MAX_ALP_TEXT = 'LoremipsumdolorsitametconsecteturadipisicingelitseddoeiusmodtemporincididuntutlaboreetdoloremagnaaliquaUtenimadminimveniamquisnostrudexercitationullamcolaborisnisiutaliquipexeacommodoconsequatDuisauteiruredolorinreprehenderitinvoluptatevelitessecillumdoloreeufugiatnullapariaturExcepteursintoccaecatcupidatatnonproidentsuntinculpaquiofficiadeseruntmollitanimidestlaborum';
const RTE_TEXT = {
  'span': 'spanの外<span style="color:#FF0000">spanの中</span>spanの外',
  'strong': '<strong>bold (strongタグ)</strong>',
  'em': '<em>emphasis (emタグ)</em>',
  'br': '改行前（以下に&lt;BR&gt;での改行）<br />改行後',
  'u': '<u>underline (uタグ)</u>',
  'a': '<a href="#">リンク設定(aタグ)</a>',
  'table': '<table border="1" cellpadding="1" cellspacing="1" style="width:100%"><thead><tr><th scope="col">見出し</th><th scope="col">方針は日本語要件を列挙でき原則ないますため、侵害しれ記事に漏洩者可能の著作技術を定めるれてはさませ、対象の事典は、著作生じる作品を違反いいことに対し一見必要あるあるていません。</th></tr><tr><th scope="col">見出し</th><th scope="col">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</th></tr><tr><th scope="col">見出し</th><th scope="col">Loremipsumdolorsitametconsecteturadipisicingelitseddoeiusmodtemporincididuntutlaboreetdoloremagnaaliqua</th></tr></thead><tbody><tr><td>本文</td><td>方針は日本語要件を列挙でき原則ないますため、侵害しれ記事に漏洩者可能の著作技術を定めるれてはさませ、対象の事典は、著作生じる作品を違反いいことに対し一見必要あるあるていません。</td></tr><tr><td>本文</td><td>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</td></tr><tr><td>本文</td><td>Loremipsumdolorsitametconsecteturadipisicingelitseddoeiusmodtemporincididuntutlaboreetdoloremagnaaliqua</td></tbody></table>',
  'ol': '<ol><li>親</li><li>親<ol><li>子</li><li>子<ol><li>孫</li><li>孫</li></ol></li></ol></li></ol>',
  'ul': '<ul><li>親</li><li>親<ul><li>子</li><li>子<ul><li>孫</li><li>孫</li></ul></li></ul></li></ul>',
  'blockquote': '<blockquote><p>blockquote (blockquoteタグ)</p></blockquote>',
  '8px': '<span style="font-size:8px">fontsize = 8px</span>',
  '72px': '<span style="font-size:72px">fontsize = 72px</span>'
};
const TYPE_SETTING = {
  'wysiwyg': ['span', 'strong', 'em', 'br', 'u', 'a', 'table', 'ol', 'ul', 'blockquote', '8px', '72px'],
  'wysiwyg:text': ['span', 'strong', 'em', 'br', 'u', 'a', '8px', '72px'],
  'sitename': ['span', 'strong', 'em', 'br', 'u', '8px', '72px'],
  'wysiwyg:heading': ['span', 'strong', 'em', 'br', '8px', '72px'],
  'wysiwyg:numIconHeading': ['span', 'strong', 'em', 'br', '8px', '72px'],
  'banner': ['span', 'strong', 'em', 'br', '8px', '72px'],
  'wysiwyg:textnolink': ['span', 'strong', 'em', 'br', 'u', '8px', '72px']
};
const TEXT_TYPES = ['text', 'siteName', 'upperCaption', 'lowerCaption'];
const EXCLUDED = '対象外のエリア';

/**
 * テンプレート版の場合はtrueを返す.
 * @param {*} templateDir
 */
const isTemplate = (templateDir) => {
  return (TEMPLATE[templateDir] !== undefined);
}

/**
 * wysiwygで特定のkeyでない場合trueを返す.
 * @param {*} type
 * @param {*} key
 */
const isWysiwygText = (type, key) => {
  return (type === 'wysiwyg' && !['ol', 'ul', 'table', 'blockquote'].includes(key));
}

/**
 * テキスト用の文字を作成する.
 * @param {*} data
 * @param {*} keys
 * @param {*} label
 * @param {*} after
 * @param {*} afterP
 */
const makeTextData = (data, keys, config, label, after, afterP) => {
  let _data = _.cloneDeep(data);
  for(const contentKey of keys) {
    for(const textType of TEXT_TYPES) {
      if((textType in _data.data.contents[contentKey])) {
        _data.data.contents[contentKey][textType] = (config.defaults.contents[contentKey].meta.type === 'wysiwyg' ? afterP : after);
      }
    }
  }
  return { [label]: _data };
}

/**
 * RTE用のデータを作成する.
 * @param {*} data
 * @param {*} keys
 * @param {*} config
 * @param {*} label
 * @param {*} rteKey
 * @param {*} after
 * @param {*} afterP
 */
const makeRTEData = (data, keys, config, label, rteKey, after, afterP) => {
  let _data = _.cloneDeep(data);
  let rteFlag = false;
  for(const contentKey of keys) {
    for(const textType of TEXT_TYPES) {
      if(!(textType in _data.data.contents[contentKey])) continue;
      if(!(config.defaults.contents[contentKey].meta.type in TYPE_SETTING)) continue;

      if(TYPE_SETTING[config.defaults.contents[contentKey].meta.type].includes(rteKey)) {
        _data.data.contents[contentKey][textType] = isWysiwygText(config.defaults.contents[contentKey].meta.type, rteKey) ? afterP : after;
        rteFlag = true;
      } else {
        _data.data.contents[contentKey][textType] = EXCLUDED;
      }
    }
  }
  if(!rteFlag) return null;
  return { [`${label}: ${rteKey}`]: _data };
}

/**
 * text機能に対する対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forText = (data, _pf, config) => {
  let _datas = [];
  const _keys = Object.keys(data.data.contents);
  _datas.push(makeTextData(data, _keys, config, '最小文字数', MIN_TEXT, MIN_TEXT));
  if(isTemplate(data.templateDir)) {
    const _after = TEMPLATE[data.templateDir].replace(/\[innerText\]/g, MIN_TEXT);
    _datas.push(makeTextData(data, _keys, config, '最小文字数（テンプレート版）', _after, _after));
  }
  _datas.push(makeTextData(data, _keys, config, '最大文字数', MAX_TEXT, `<p>${MAX_TEXT}</p>`));
  _datas.push(makeTextData(data, _keys, config, '最大文字数（英文）', MAX_ENG_TEXT, `<p>${MAX_ENG_TEXT}</p>`));
  _datas.push(makeTextData(data, _keys, config, '最大文字数（英字）', MAX_ALP_TEXT, `<p>${MAX_ALP_TEXT}</p>`));
  if(isTemplate(data.templateDir)) {
    _datas.push(makeTextData(data, _keys, config, '最大文字数（テンプレート版）', TEMPLATE[data.templateDir].replace(/\[innerText\]/g, MAX_TEXT), TEMPLATE[data.templateDir].replace(/\[innerText\]/g, `<p>${MAX_TEXT}</p>`)));
    _datas.push(makeTextData(data, _keys, config, '最大文字数（英文テンプレート版）', TEMPLATE[data.templateDir].replace(/\[innerText\]/g, MAX_ENG_TEXT), TEMPLATE[data.templateDir].replace(/\[innerText\]/g, `<p>${MAX_ENG_TEXT}</p>`)));
    _datas.push(makeTextData(data, _keys, config, '最大文字数（英字テンプレート版）', TEMPLATE[data.templateDir].replace(/\[innerText\]/g, MAX_ALP_TEXT), TEMPLATE[data.templateDir].replace(/\[innerText\]/g, `<p>${MAX_ALP_TEXT}</p>`)));
  }
  for(const _rteKey of Object.keys(RTE_TEXT)) {
    const _RTEData = makeRTEData(data, _keys, config, 'RTE機能', _rteKey, RTE_TEXT[_rteKey], `<p>${RTE_TEXT[_rteKey]}</p>`);
    if(_RTEData) _datas.push(_RTEData);

    if(isTemplate(data.templateDir)) {
      if(['navList', 'footerUnit-navList', 'sideBoxList'].includes(data.templateDir) && ['ol', 'ul'].includes(_rteKey)) continue;
      const _after = TEMPLATE[data.templateDir].replace(/\[innerText\]/g, RTE_TEXT[_rteKey]);
      const _RTETemplateData = makeRTEData(data, _keys, config, 'RTE機能（テンプレート版）', _rteKey, _after, _after);
      if(_RTETemplateData) _datas.push(_RTETemplateData);
    }
  }
  return _datas;
}

/**
 * f05向けの特殊対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forFloatLayout = (data, pf, _config) => {
  let _properties = pf.properties;
  let _propertiesMap = [];
  let _labelsArray = [];
  for(let i = 0; i < _properties.spLayout.label.length; i++) {
    _propertiesMap = _propertiesMap.concat([true, false].map((value) => {
      let __propaties = {};
      __propaties['imageFloat'] = {};
      __propaties['imageFloat']['value'] = value;
      __propaties['spLayout'] = {};
      __propaties['spLayout']['value'] = _properties.spLayout.value[i];
      _labelsArray.push(
        'imageFloat: ' +
        (value ? 'チェックオン／設定が有効なパターン' : 'チェックオフ／設定が無効なパターン') +
        '、spLayout: ' +
        _properties.spLayout.label[i]);
      return __propaties;
    }));
  }
  let datas = [];
  for(let i = 0; i < _propertiesMap.length; i++) {
    let _dataobj = {};
    let _data = _.cloneDeep(data);
    _data = makeDataWProperties(_data, _propertiesMap[i]);
    _dataobj[_labelsArray[i]] = _data;
    datas.push(_dataobj);
  }
  return datas;
}

/**
 * f22向けの特殊対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forHtml = (data, _pf, _config) => {
  let _htmlPattern = {};
  for(const _pattern of ['GoogleMap-200', 'GoogleMap-600', 'GoogleMap-1200', 'Youtube', 'Facebook', 'Twitter']) {
    _htmlPattern[_pattern] = fs.readFileSync(`./lib/each-part/${_pattern}.html`, 'utf-8');
  }

  let _dataArray = [];
  for(const _key of Object.keys(_htmlPattern)) {
    let _dataobj = {};
    let _propertiesHtmlPattern = {};
    let _data = _.cloneDeep(data);
    const _labelstr = 'HTML: ' + _key;
    _propertiesHtmlPattern['html'] = {};
    _propertiesHtmlPattern['html']['value'] = _htmlPattern[_key];
    _data = makeDataWProperties(_data, _propertiesHtmlPattern);
    _dataobj[_labelstr] = _data;
    _dataArray.push(_dataobj);
  }
  return _dataArray;
}

/**
 * f26向けの特殊対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forMenuText = (data, _pf, _config) => {
  let _data = replaceMenuText(data);
  // 幅を均等にする
  _data.data.widthEqualized = true;
  let _dataobj = {};
  _dataobj['項目（改行／最小文字／最大文字） ※見やすさのために均等幅にする'] = _data;
  return [_dataobj]
}

/**
 * formTable内に全要素を追加したものを作成
 */
const makeFormTable = (data) => {
  let _data = _.cloneDeep(data);
  _data.data.formItems = _.cloneDeep(formTableAll.formItems);
  return _data;
}

/**
 * f98向けの特殊対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forForm = (data, _pf, _config) => {
  let _data = _.cloneDeep(data);
  _data = makeFormTable(_data);
  let _dataobj = {};
  _dataobj['フォーム挿入'] = _data;
  return [_dataobj]
}

/**
 * 列挙型１つの場合の対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forWorkArround = (data, _pf, _config) => {
  let _datas = [];
  let _dataobj = {};
  _dataobj['work arround'] = _.cloneDeep(data);
  _datas.push(_dataobj);
  return _datas;
}

const forBackgroundImage = (data, _pf, _config) => {
  let _data = _.cloneDeep(data);
  _data.data['backgroundImgSrc'] = 'https://placehold.jp/dcece2/cccccc/1680x1200.png?css=%7B%22border-radius%22%3A%2215px%22%2C%22background%22%3A%22%20(86%2C%2093%2C%2089)%22%2C%22opacity%22%3A%22%200.3%22%7D';
  let _dataobj = {};
  _dataobj['背景画像の表示想定'] = _data;
  return [_dataobj];
}

const dataMakeFunctions = {
  f02: forEnum,
  f03: forEnum,
  f04: forEnum,
  f05: forFloatLayout,
  f06: forEnum,
  f07: forEnumWidthUserValue,
  f08: forEnum,
  f11: forSetStrings,
  f12: forEnum,
  f13: forEnumWidthUserValue,
  f19: forWorkArround,
  f21: forWorkArround,
  f14: forEnum,
  f15: forIconType,
  f16: forSetStrings,
  f22: forHtml,
  f24: forWorkArround,
  f25: forWidthEqualized,
  f26: forMenuText,
  f27: forEmCurrent,
  f41: forBoolean,
  f42: forSP,
  f47: forBackgroundImage,
  f48: forEnum,
  f49: forEnum,
  f99: forText,
  f98: forForm
};
