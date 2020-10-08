'use strict';

const _ = require('lodash');
const utils = require('./utils');
const tv4 = require('tv4');
const parser = require('json-schema-parser');
const DATA_SCHEMA = parser.parse(require('./schemas/dataSchema.json'));
const PARTS_VARIATIONS = parser.parse(require('./btool-settings/parts-variations.json'));
const childHtml = '<div style="border: 1px dashed red;padding: 5px;">編集枠：[name]</div>';
const dummyImgSrc = 'https://placehold.jp/400x160.png';

module.exports = class DataJsonGenerator {
  static init(templateDirPath) {
    module.exports.template = utils.getTemplate(templateDirPath);
  }

  static async makeDataJsonDefaultContents(data) {
    await Promise.resolve();
    let _data = module.exports.makeDataJsonDefaultContentsSync(data);
    return _data ? Promise.resolve(_data) : Promise.reject(testResult);
  }

  static makeDataJsonDefaultContentsSync(data) {
    let hasChild = false;
    const dataJsonDefault = data['defaults']['contents'].map(content => {
      let _data = {};
      const _keys = String(content['meta']['path']).split('.');
      _data[_keys[0]] = {}
      _data[_keys[0]][_keys[1]] = {}
      _data[_keys[0]][_keys[1]][_keys[2]] = Object.assign({}, content['defaults']);
      if(_data[_keys[0]][_keys[1]][_keys[2]]['children']) {
        _data[_keys[0]][_keys[1]][_keys[2]]['childrenHtml'] = childHtml.replace(/\[name\]/, content.meta.name);
        const _children = _.cloneDeep(_data[_keys[0]][_keys[1]][_keys[2]]['children']);
        const _childHtmlFromParts = _children.map((child) => {
          const md = module.exports.makeDataJsonDefaultContentsSync(child);
          const mo = module.exports.makeOtherParametersSync(child, false);
          let data = module.exports.joinDatas([md, mo]);
          data = module.exports.imgSrcForDev(data);
          return (module.exports.template(child.template_id))(data);
        }).reduce((pre, child) => {
          return pre + child;
        }, '');
        _data[_keys[0]][_keys[1]][_keys[2]]['childrenHtml_fromParts'] = _childHtmlFromParts;
        hasChild = true;
      }
      return _data;
    }).reduce((pre, data) => {
      const _key1 = Object.keys(data)[0];
      const _key2 = Object.keys(data[_key1])[0];
      const _key3 = Object.keys(data[_key1][_key2])[0];
      if(!pre[_key1]) {
        pre[_key1] = Object.assign({}, data[_key1]);
      }else{
        pre[_key1][_key2][_key3] = Object.assign({}, data[_key1][_key2][_key3]);
      }
      return pre;
    }, {});
    const testResult = tv4.validateMultiple(dataJsonDefault, DATA_SCHEMA);
    dataJsonDefault._hasChild = hasChild;
    return testResult.valid ? dataJsonDefault : testResult.valid;
  }

  static makePartsVariations(data, partsCategory) {
    return Promise.resolve(module.exports.makePartsVariationsSync(data, partsCategory));
  }

  static makePartsVariationsSync(data, partsCategory) {
    if(!data['defaults']['config']['partsVariation']) return {'partsVariations': ''};

    const partsVariationSize = PARTS_VARIATIONS[partsCategory] || data['defaults']['config']['partsVariation'].length;
    let partsVariationsValue = '';
    for (var i = 1; i <= partsVariationSize; i++) {
      if(i === 1) continue;
      partsVariationsValue += `,${i}`;
    };
    return {'partsVariations': partsVariationsValue};
  }

  static makeTemplateDir(templateName) {
    return Promise.resolve(module.exports.makeTemplateDirSync(templateName));
  }

  static makeTemplateDirSync(templateName) {
    let td = {};
    td['templateDir'] = templateName;
    return td;
  }

  static makeOtherParameters(data, withoutPV = true) {
    return Promise.resolve(module.exports.makeOtherParametersSync(data, withoutPV));
  }

  static makeOtherParametersSync(data, withoutPV = true) {
    const parameters = data['defaults'];
    const parameterNames = Object.keys(DATA_SCHEMA.properties.data.properties).filter(name => {
      return !(name === 'contents' || (withoutPV && name === 'partsVariation') || name === 'config');
    });
    return parameterNames.reduce((pre, name) => {
      pre = pre['data'] ? pre : {data: {}}
      if(parameters[name] !== undefined) {
        pre['data'][name] = parameters[name];
      }
      return pre;
    }, {});
  }

  static joinDatas(datas) {
    return datas.reduce((pre, data) => {
      const _key1 = Object.keys(data)[0];
      if(!pre[_key1]) {
        if(typeof data[_key1] === 'string') {
          pre[_key1] = data[_key1];
        }else{
          pre[_key1] = Object.assign({}, data[_key1]);
        }
      }else{
        if(typeof data[_key1] === 'string') {
          // 同じ名前のときはからぶり
        }else{
          pre[_key1] = Object.assign(pre[_key1], data[_key1]);
        }
      }
      return pre;
    }, {});
  }

  static imgSrcForDev(data) {
    const parameter = 'imgSrc';
    _.map(data.data.contents).reduce((_pre, content) => {
      if(content[parameter] !== undefined) {
        content[parameter] = dummyImgSrc;
      }
      return true;
    }, true);
    return data;
  }

  static hasInvisibleArea(data) {
    const parameter = 'switchable';
    let flag = false;
    _.map(data.data.contents).reduce((_pre, content) => {
      if(content[parameter] !== undefined && !content[parameter]) {
        flag = true;
      }
      return true;
    }, true);
    return flag;
  }

  static hasSwitchable(data) {
    const parameter = 'switchable';
    let flag = false;
    _.map(data.data.contents).reduce((_pre, content) => {
      if(content[parameter] !== undefined) {
        flag = true;
      }
      return true;
    }, true);
    return flag;
  }
};
