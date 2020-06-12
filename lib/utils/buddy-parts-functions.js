'use strict'

const fs = require('fs-extra');
const pf = require('./buddy-parts-functions.json');
const formTableAll = require('../each_part/formTableAll.json');
const _ = require('lodash');

module.exports = class BuddyPartsFunctions{
  /**
   * 渡されたdataが、functionIdの機能を持っているか判断する。
   * @param data datajsonオブジェクト
   * @param functionId 機能IDの文字列
   */
  static hasFunction(data, partsCategory, functionId) {
    return pf[functionId].use ? (() => {
      if(pf[functionId].use) {
        return pf[functionId].functionTarget.includes(partsCategory);
      }else{
        return false;
      }
    })() : false;
  }

  /**
   * 機能IDの一覧を配列で返す
   */
  static functionIds() {
    return Object.keys(pf);
  }

  /**
   * 全機能パターンのdatajsonを配列で返す
   */
  static allFunctionalDatas(functionId, data, config) {
    if(!(functionId in dataMakeFunctions)) {
      if(!['a00', 'f00', 'f01'].includes(functionId)) {
        console.warn('入力したfunctionIdに対する機能パターン生成がありません。\nfunctionId :' + functionId + ', data.templateDir' + data.templateDir);
      }
      return false;
    }
    return dataMakeFunctions[functionId](data, pf[functionId], config);
  }

  /**
   * スイッチャブルを全部onにした状態のdatajsonを返す
   */
  static switchableAllOn(data) {
    let _data = _.cloneDeep(data);
    _data = Object.keys(_data.data.contents).reduce((pre, key) => {
      if(pre.data.contents[key].switchable !== undefined) {
        pre.data.contents[key].switchable = true;
      }
      return pre;
    },_data);
    return _data;
  }

  /**
   * スイッチャブルを全部offにした状態のdatajsonを返す
   */
  static switchableAllOff(data) {
    let _data = _.cloneDeep(data);
    _data = Object.keys(_data.data.contents).reduce((pre, key) => {
      if(pre.data.contents[key].switchable !== undefined) {
        pre.data.contents[key].switchable = false;
      }
      return pre;
    },_data);
    return _data;
  }

  /**
   * formTable内に全要素を追加したものを作成
   */
  static makeFormTable(data) {
    let _data = _.cloneDeep(data);
    _data.data.formItems = _.cloneDeep(formTableAll.formItems);
    return _data;
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
    // 2017/11/21 spacingTweak対応
    if(key === 'spacingTweak') {
      data.data[key] = properties[key]["value"];
    }
    if(data.data[key] !== undefined) {
      data.data[key] = properties[key]["value"];
    }
  }
  for (let content of _.map(data.data.contents)) {
    let hasFunctionFlag = false;
    let textChangeFlag = false;
    for(const key of Object.keys(properties)) {
      if(_textChangeFunction.indexOf(key) !== -1) {
        textChangeFlag = true;
      }
      if(content[key] !== undefined) {
        content[key] = properties[key]["value"];
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
      content[name] = properties[now][name]["value"];
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
  if(countP == 1) {
    return [].push(propertiesMap);
  }else{
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
  }
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
const forEnum = (data, pf, config) => {
  let _properties = pf.properties;
  const _propertiesKeys = Object.keys(_properties);
  const _propertiesMap = _properties[_propertiesKeys[0]]["value"]
    .map((value) => {
      let __propaties = {};
      __propaties[_propertiesKeys[0]] = {};
      __propaties[_propertiesKeys[0]]["value"] = value;
      return __propaties;
    });
  const _labelsArray = _properties[_propertiesKeys[0]]["label"];
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
 * アイコンの場合の対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forIconType = (data, pf, config) => {
  const _propertiesMap = pf.properties["iconType"]["value"].map((value) => {
    let __propaties = {};
    __propaties["iconType"] = {};
    __propaties["iconType"]["value"] = value;
    return __propaties;
  });
  const _labelsArray = pf.properties["iconType"]["label"];
  let datas = [];
  const countP = countParameter(data, "iconType");
  if(countP == 1) {
    for(let i = 0; i < _propertiesMap.length; i++) {
      let _dataobj = {};
      let _data = _.cloneDeep(data);
      _data = makeDataWProperties(_data, _propertiesMap[i]);
      _dataobj[_labelsArray[i]] = _data;
      datas.push(_dataobj);
    }
  } else {
    const [_divPropateies, _divIndexes] = dividePropateies(_propertiesMap, countP);
    const _name = Object.keys(_propertiesMap[0])[0];
    for(let i = 0; i < _divPropateies.length; i++) {
      let _dataobj = {};
      let _data = _.cloneDeep(data);
      _data = makeDataWPropertiesMany(_data, _divPropateies[i], _name);
      const _labelStr = _labelsArray[_divIndexes[i] - countP] + " 〜 " + _labelsArray[_divIndexes[i] - 1];
      _dataobj[_labelStr] = _data;
      datas.push(_dataobj);
    }
  }
  return datas;
}

/**
 * サイズ付きアイコンの場合の対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forIconTypeWithSize = (data, pf, config) => {
  let _labelsArray = [];
  const _propertiesMap = pf.properties["iconType"]["value"].map((iconType) => {
    return pf.properties["size"]["value"].map((size) => {
      _labelsArray.push(`アイコン設定: ${iconType}、サイズ設定: ${size}`);
      let __propaties = {};
      __propaties["iconType"] = {};
      __propaties["iconType"]["value"] = iconType;
      __propaties[["size"]] = {}
      __propaties[["size"]]["value"] = size;
      return __propaties;
    });
  }).flat();
  let datas = [];
  const countP = countParameter(data, "iconType");
  if(countP == 1) {
    for(let i = 0; i < _propertiesMap.length; i++) {
      let _dataobj = {};
      let _data = _.cloneDeep(data);
      _data = makeDataWProperties(_data, _propertiesMap[i]);
      _dataobj[_labelsArray[i]] = _data;
      datas.push(_dataobj);
    }
  } else {
    const [_divPropateies, _divIndexes] = dividePropateies(_propertiesMap, countP);
    const _name = Object.keys(_propertiesMap[0])[0];
    for(let i = 0; i < _divPropateies.length; i++) {
      let _dataobj = {};
      let _data = _.cloneDeep(data);
      _data = makeDataWPropertiesMany(_data, _divPropateies[i], _name);
      const _labelStr = _labelsArray[_divIndexes[i]-countP] + " 〜 " + _labelsArray[_divIndexes[i]-1];
      _dataobj[_labelStr] = _data;
      datas.push(_dataobj);
    }
  }
  return datas;
}

/**
 * 真理値の場合の対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forBoolean = (data, pf, config) => {
  const _properties = pf.properties;
  const _propertiesKeys = Object.keys(_properties);
  const _propertiesMap = [true, false].map((value) => {
    let __propaties = {};
    for(let i = 0; i < _propertiesKeys.length; i++) {
      __propaties[_propertiesKeys[i]] = {};
      __propaties[_propertiesKeys[i]]["value"] = value;
    }
    return __propaties;
  });
  const _labelsArray = ["チェックオン／設定が有効なパターン", "チェックオフ／設定が無効なパターン"]
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
const forEmCurrent = (data, pf, config) => {
  const _labelsArray = ["通常、強調、カレント、強調＋カレント"]
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
    }else{
      // 何もしない
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

const strValueType = {
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
}

/**
 * すべてが文字型の場合の対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forSetStrings = (data, pf, config) => {
  const _properties = pf.properties;
  let _data = _.cloneDeep(data);
  _data = makeDataWProperties(_data, _properties)
  const _labelstr = Object.keys(_properties).reduce((pre, key) => {
    if(strValueType[key] !== undefined) {
      return pre ? pre : strValueType[key] ? strValueType[key] : "";
    }else{
      return pre;
    }
  },"");
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
const forSP = (data, pf, config) => {
  let _data = _.cloneDeep(data);
  _data.data["isSP"] = true;
  let _dataobj = {};
  _dataobj['SPの表示想定'] = _data;
  return [_dataobj]
}

/**
 * text機能に対する対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forText = (data, pf, config) => {
  let _datas = [];
  const _keys = Object.keys(data.data.contents);

  let _template = {};
  _template['priceTable'] = '<table><tbody><tr><th style="width:50%;">[innerText]</th><td style="width:50%; text-align:right;">[innerText]</td></tr></tbody></table>';
  _template['navList'] = '<ul><li>[innerText]</li><li>[innerText]</li></ul>';
  _template['footerUnit-navList'] = _template['navList'];
  _template['sideBoxList'] = _template['navList'];
  _template['table'] = '<table><tbody><tr><th>[innerText]</th><th><span>項目2</span></th><th><span>項目3</span></th><th><span>項目4</span></th></tr><tr><td>[innerText]</td><td><span>2</span></td><td><span>3</span></td><td><span>4</span></td></tr></tbody></table>';
  _template['sideBoxTable'] = _template['table']
  _template['footerUnit-table'] = _template['table']
  _template['headerUnit-table'] = _template['table']


  // 1. minText
  const _minText = '';
  let _minData = _.cloneDeep(data);
  for(const contentKey of _keys) {
    if(_minData.data.contents[contentKey].text !== undefined) {
      _minData.data.contents[contentKey].text = _minText;
    }
  }
  _datas.push({
    '最小文字数': _minData
  });
  if(_template[data.templateDir] !== undefined) {
    let _minDataTemplate = _.cloneDeep(data);
    for(const contentKey of _keys) {
      if(_minDataTemplate.data.contents[contentKey].text !== undefined) {
        _minDataTemplate.data.contents[contentKey].text = _template[data.templateDir].replace(/\[innerText\]/g,_minText);
      }
    }
    _datas.push({
      '最小文字数（テンプレート版）': _minDataTemplate
    });
  }
  // 2. maxText
  const _maxText = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゃゆゅよらりるれろわ・を・んアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤャユュヨララリルレロワ・ヲ・ンあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゃゆゅよらりるれろわ・を・んアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤャユュヨララリルレロワ・ヲ・ン';
  const _maxTextp = '<p>あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゃゆゅよらりるれろわ・を・んアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤャユュヨララリルレロワ・ヲ・ンあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゃゆゅよらりるれろわ・を・んアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤャユュヨララリルレロワ・ヲ・ン</p>';
  let _maxData = _.cloneDeep(data);
  for(const contentKey of _keys) {
    if(_maxData.data.contents[contentKey].text !== undefined) {
      if(config.defaults.contents[contentKey].meta.type === 'wysiwyg') {
        _maxData.data.contents[contentKey].text = _maxTextp;
      } else {
        _maxData.data.contents[contentKey].text = _maxText;
      }
    }
  }
  _datas.push({
    '最大文字数': _maxData
  });
  if(_template[data.templateDir] !== undefined) {
    let _maxDataTemplate = _.cloneDeep(data);
    for(const contentKey of _keys) {
      if(config.defaults.contents[contentKey].meta.type === 'wysiwyg') {
        _maxDataTemplate.data.contents[contentKey].text = _template[data.templateDir].replace(/\[innerText\]/g,_maxText);
      } else {
        _maxDataTemplate.data.contents[contentKey].text = _template[data.templateDir].replace(/\[innerText\]/g,_maxTextp);
      }
    }
    _datas.push({
      '最大文字数（テンプレート版）': _maxDataTemplate
    });
  }
  // 3. RTE
  let _rteTexts = {};
  _rteTexts['span'] = 'spanの外<span style="color:#FF0000">spanの中</span>spanの外';
  _rteTexts['strong'] = '<strong>bold (strongタグ)</strong>';
  _rteTexts['em'] = '<em>emphasis (emタグ)</em>';
  _rteTexts['br'] = '改行前（以下に&lt;BR&gt;での改行）<br />改行後';
  _rteTexts['u'] = '<u>underline (uタグ)</u>';
  _rteTexts['a'] = '<a href="#">リンク設定(aタグ)</a>';
  _rteTexts['table'] = '<table border="1" cellpadding="1" cellspacing="1" style="width:100%"><thead><tr><th scope="col">見出し</th><th scope="col">見出し</th></tr></thead><tbody><tr><td>本文</td><td>本文</td></tr><tr><td>本文</td><td>本文</td></tr></tbody></table>'
  _rteTexts['ol'] = '<ol><li>親</li><li>親<ol><li>子</li><li>子<ol><li>孫</li><li>孫</li></ol></li></ol></li></ol>'
  _rteTexts['ul'] = '<ul><li>親</li><li>親<ul><li>子</li><li>子<ul><li>孫</li><li>孫</li></ul></li></ul></li></ul>'
  _rteTexts['blockquote'] = '<blockquote><p>blockquote (blockquoteタグ)</p></blockquote>';
  _rteTexts['8px'] = '<span style="font-size:8px">fontsize = 8px</span>';
  _rteTexts['72px'] = '<span style="font-size:72px">fontsize = 72px</span>';

  // type別に対象化どうかをtrue/falseで記述
  // span/strong/em/br/u/blockquote/8px/72pxの順
  let _typeSettings = {};
  _typeSettings["wysiwyg"] = ['span','strong','em','br','u','a','table','ol','ul','blockquote','8px','72px'];
  _typeSettings["wysiwyg:text"] = ['span','strong','em','br','u','a','8px','72px'];
  _typeSettings["sitename"] = ['span','strong','em','br','u','8px','72px'];
  _typeSettings["wysiwyg:heading"] = ['span','strong','em','br','8px','72px'];
  _typeSettings["wysiwyg:numIconHeading"] = ['span','strong','em','br','8px','72px'];
  _typeSettings["banner"] = ['span','strong','em','br','8px','72px'];
  _typeSettings["wysiwyg:textnolink"] = ['span','strong','em','br','u','8px','72px'];
  let _rteKeys = Object.keys(_rteTexts);
  for(const _rteKey of _rteKeys) {
    let _rteData = _.cloneDeep(data);
    let _rteFlag = false;
    for(const contentKey of _keys) {
      if(_rteData.data.contents[contentKey].text !== undefined &&
          _typeSettings[config.defaults.contents[contentKey].meta.type] !== undefined) {
        if(_typeSettings[config.defaults.contents[contentKey].meta.type].indexOf(_rteKey) !== -1) {
          _rteData.data.contents[contentKey].text =
            (config.defaults.contents[contentKey].meta.type === 'wysiwyg' && _rteKey !== 'ol' && _rteKey !== 'ul' && _rteKey !== 'table' && _rteKey !== 'blockquote') ?
            '<p>' + _rteTexts[_rteKey] + '</p>' : _rteTexts[_rteKey] ;
          _rteFlag = true;
        } else {
          _rteData.data.contents[contentKey].text = '対象外のエリア'
        }
      }
    }
    if(_rteFlag) {
      let _data = {};
      _data['RTE機能: ' + _rteKey] = _rteData;
      _datas.push(_data);
    }
    if(_template[data.templateDir] !== undefined) {
      if(['navList','footerUnit-navList','sideBoxList'].indexOf(data.templateDir) !== -1 &&
        ['ol', 'ul'].indexOf(_rteKey) !== -1) { continue } ;
      let _rteDataTemplate = _.cloneDeep(data);
      let _rteFlag = false;
      for(const contentKey of _keys) {
        if(_rteDataTemplate.data.contents[contentKey].text !== undefined &&
            _typeSettings[config.defaults.contents[contentKey].meta.type] !== undefined) {
          if(_typeSettings[config.defaults.contents[contentKey].meta.type].indexOf(_rteKey) !== -1) {
            _rteDataTemplate.data.contents[contentKey].text =
            (config.defaults.contents[contentKey].meta.type === 'wysiwyg' && _rteKey !== 'ol' && _rteKey !== 'ul' && _rteKey !== 'table' && _rteKey !== 'blockquote') ?
              _template[data.templateDir].replace(/\[innerText\]/g,_rteTexts[_rteKey]) : _template[data.templateDir].replace(/\[innerText\]/g,_rteTexts[_rteKey]) ;
            _rteFlag = true;
          } else {
            _rteDataTemplate.data.contents[contentKey].text = _template[data.templateDir].replace(/\[innerText\]/g, '対象外のエリア');
          }
        }
      }
      if(_rteFlag) {
        let _data = {};
        _data['RTE機能（テンプレート版）: ' + _rteKey] = _rteDataTemplate;
        _datas.push(_data);
      }
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
const forFloatLayout = (data, pf, config) => {
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
        (value ? "チェックオン／設定が有効なパターン" : "チェックオフ／設定が無効なパターン") +
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
const forHtml = (data, pf, config) => {
  let _htmlPattern = {};
  _htmlPattern['GoogleMap-200'] = '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12962.37692780921!2d139.694101!3d35.686992!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x77b7d4b1f2106dd6!2z5qCq5byP5Lya56S-IFdFQuODnuODvOOCseODhuOCo-ODs-OCsOe3j-WQiOeglOeptuaJgA!5e0!3m2!1sja!2sjp!4v1511248756518" width="200" height="200" frameborder="0" style="border:0" allowfullscreen></iframe>';
  _htmlPattern['GoogleMap-600'] = '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12962.37692780921!2d139.694101!3d35.686992!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x77b7d4b1f2106dd6!2z5qCq5byP5Lya56S-IFdFQuODnuODvOOCseODhuOCo-ODs-OCsOe3j-WQiOeglOeptuaJgA!5e0!3m2!1sja!2sjp!4v1511248756518" width="600" height="600" frameborder="0" style="border:0" allowfullscreen></iframe>'
  _htmlPattern['GoogleMap-1200'] = '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12962.37692780921!2d139.694101!3d35.686992!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x77b7d4b1f2106dd6!2z5qCq5byP5Lya56S-IFdFQuODnuODvOOCseODhuOCo-ODs-OCsOe3j-WQiOeglOeptuaJgA!5e0!3m2!1sja!2sjp!4v1511248756518" width="1200" height="1200" frameborder="0" style="border:0" allowfullscreen></iframe>'

  _htmlPattern['Youtube'] = '<iframe width="560" height="315" src="https://www.youtube.com/embed/6ZfuNTqbHE8" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>'
  _htmlPattern['Facebook'] = fs.readFileSync('./lib/each_part/facebook.html', 'utf-8');
  _htmlPattern['Twitter'] = fs.readFileSync('./lib/each_part/twitter.html', 'utf-8');

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
const forMenuText = (data, pf, config) => {
  let _data = replaceMenuText(data);
  // 幅を均等にする
  _data.data.widthEqualized = true;
  let _dataobj = {};
  _dataobj['項目（改行／最小文字／最大文字） ※見やすさのために均等幅にする'] = _data;
  return [_dataobj]
}

/**
 * f98向けの特殊対応
 * @param {*} data
 * @param {*} pf
 * @param {*} config
 */
const forForm = (data, pf, config) => {
  let _data = _.cloneDeep(data);
  _data = module.exports.makeFormTable(_data);
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
const forWorkArround = (data, pf, config) => {
  let _datas = [];
  let _dataobj = {};
  _dataobj['work arround'] = _.cloneDeep(data);
  _datas.push(_dataobj);
  return _datas;
}

const forBackgroundImage = (data, pf, config) => {
  let _data = _.cloneDeep(data);
  _data.data["backgroundImgSrc"] = "https://placehold.jp/dcece2/cccccc/1680x1200.png?css=%7B%22border-radius%22%3A%2215px%22%2C%22background%22%3A%22%20(86%2C%2093%2C%2089)%22%2C%22opacity%22%3A%22%200.3%22%7D";
  let _dataobj = {};
  _dataobj['背景画像の表示想定'] = _data;
  return [_dataobj]
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
  'f14-1': forEnum,
  'f14-2': forEnum,
  'f14-3': forEnum,
  'f14-4': forEnum,
  'f15-1': forIconType,
  'f15-2': forIconType,
  'f15-3': forIconType,
  'f15-4': forIconTypeWithSize,
  'f15-5': forIconTypeWithSize,
  'f15-6': forIconType,
  'f15-7': forIconType,
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
  f99: forText,
  f98: forForm
}
