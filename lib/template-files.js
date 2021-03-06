'use strict';

const path = require('path');
const _ = require('lodash');
const utils = require('./utils');
const djg = require('./data-json-generator');
const unitTestSettings = require('./unit-test-settings');

module.exports = class MakeAllDatajson {
  /** templateNameとtemplateDirの値を元に、outputFileDirにblockNameでdata.json（デフォルト設定のみ）を生成する。
  * @param {*} templateName
  * @param {*} templateDir
  * @param {*} outputFileDir
  * @param {*} blockName
  */
  static async makeAllDatajson(templateName, templateDir, outputFileDir, blockName) {
    console.log('htmlテンプレートから全部品のdata.jsonを作成します')
    djg.init(templateDir);
    try{
      await makeAllDatajsonRun(templateName, templateDir, outputFileDir, blockName)
      console.log('完了しました')
    } catch(err) {
      console.error(`Failed to get name: ${err.message}`);
    }
  }

  /** 外部設定にそって、全部品の全パターンのdata.jsonを生成する。
  * @param {*} templateDirPath
  * @param {*} outputFileDir
  * @param {*} blocks
  */
  static async makeAllDatajsonFull(templateDirPath, outputFileDir, blocks) {
    console.log('全部品全パターンのdata.jsonを生成します')
    djg.init(templateDirPath);
    const runParameters = [];
    for(const key of Object.keys(blocks)) {
      for(const block of blocks[key]) {
        runParameters.push({
          'parts': block.parts,
          'key': key,
          'name': block.name,
        })
      }
    }
    await Promise.all(
      runParameters.map(runParameter => {
        return makeAllDatajsonRun(
          runParameter['parts'],
          templateDirPath,
          path.join(
            outputFileDir,
            `${runParameter['key']}_${runParameter['name']}_${runParameter['parts']}`
          ),
          `${runParameter['key']}_${runParameter['name']}_${runParameter['parts']}`,
          runParameter['name']
        )
      })
    );
    console.log('data.jsonの生成が完了しました')
  }
}

/**
* @param {*} templateName
* @param {*} templateDir
* @param {*} outputFileDir
* @param {*} outputFileName
* @param {*} blockName
*/
const makeAllDatajsonRun = async (templateName, templateDir, outputFileDir, outputFileName, blockName) => {
  // 設定保存用
  let tempConfig = {};
  // ファイルに関する値の保持用
  let partsJsonConfig = {};
  const partsJsonConfigSet = (outputFilename, labelStr) => {
    partsJsonConfig[outputFilename.replace('\.json', '')] = labelStr;
  }
  let filepath = utils.getFilePath(templateDir, `${templateName}/meta.json`);
  const partsData = await utils.readJsonFile(filepath).catch (_err => {
    console.error(`path Error\nfilepath :${filepath}`);
  });
  // データがない場合にスキップする
  if (!partsData) return;
  // 設定保存用に現行設定値を保続
  tempConfig.config = _.cloneDeep(partsData.config);
  tempConfig.area = _.cloneDeep(partsData.area);
  tempConfig.defaults = {};
  tempConfig.defaults.config = _.cloneDeep(partsData.defaults.config);
  tempConfig.defaults.contents = {};
  Object.keys(partsData.defaults.contents).reduce((pre, key) => {
      pre[key] = {};
      pre[key].config = partsData.defaults.contents[key].config;
      pre[key].meta = partsData.defaults.contents[key].meta;
      return pre;
    }, tempConfig.defaults.contents)
  // data.jsonを生成（幾つかのパーツに分けて）
  let datas = await Promise.all([
    djg.makeDataJsonDefaultContents(partsData),
    djg.makePartsVariations(partsData, blockName),
    djg.makeTemplateDir(templateName),
    djg.makeOtherParameters(partsData)
  ]);
  // 分けて生成したdata.jsonを結合
  // childを持っている場合に、trueが入っている。
  tempConfig._hasChild = datas[0]._hasChild;
  delete datas[0]._hasChild;
  let data = djg.joinDatas(datas);
  data['blockName'] = blockName;
  //imgSrcを開発用に変更
  data = djg.imgSrcForDev(data);
  // 部品が持っている機能IDのみにフィルタする
  const functionIds = unitTestSettings.targetFunctionIds(data);

  if(functionIds.includes("a00")) {
    // デフォルト状態の部品を出力しておく処理
    const filename = `${outputFileName}_a00_001.json`;
    partsJsonConfigSet(filename, "基本形");
    await utils.outputJsonFile(path.join(outputFileDir, filename), data);
  }

  if(functionIds.includes("f00")) {
    // スイッチャブル判定
    tempConfig._hasSwitchable = djg.hasSwitchable(data);
    if (tempConfig._hasSwitchable) {
      data = changeAllSwitchable(data, false);
      const offFilename = `${outputFileName}_f00_001.json`;
      partsJsonConfigSet(offFilename, '全要素非表示／全SWがOFF');
      await utils.outputJsonFile(path.join(outputFileDir, offFilename), data);
      data = changeAllSwitchable(data, true);
      const onFilename = `${outputFileName}_f00_002.json`;
      partsJsonConfigSet(onFilename, "全要素表示／全SWがON");
      await utils.outputJsonFile(path.join(outputFileDir, onFilename), data);
    }
    // 子部品がある場合に、パーツからの物に切り替える
    if (tempConfig._hasChild) {
      //ここに子供のhtmlを切り替える処理を記述する。
      data = utils.switchContentsParameter(data, 'childrenHtml', 'childrenHtml_fromParts');
      const filename = `${outputFileName}_f00_003.json`;
      partsJsonConfigSet(filename, "編集枠：子部品追加");
      await utils.outputJsonFile(path.join(outputFileDir, filename), data);
    }
  }

  if (blockName === 'sideMenu') {
    partsJsonConfigSet("151_sideMenu_sideMenu_f28_001", "親がカレント");
    partsJsonConfigSet("151_sideMenu_sideMenu_f28_002", "子がカレント");
    partsJsonConfigSet("151_sideMenu_sideMenu_f28_003", "孫がカレント");
  }

  for(const functionId of functionIds) {
    let datas = unitTestSettings.allFunctionalDatas(functionId, data, tempConfig);
    if (!datas) continue;
    try{
      await Promise.all(
        datas.map((data, index) => {
          const keys = Object.keys(data);
          const currentOutputFilename = `${outputFileName}_${functionId.replace(/-[0-9]*$/, '')}_${('000' + (index + 1)).slice(-3)}.json`;
          const outputFilePath = path.join(outputFileDir, currentOutputFilename);
          if (keys.length == 1) {
            partsJsonConfigSet(currentOutputFilename, keys[0]);
            return utils.outputJsonFile(outputFilePath, data[keys[0]]);
          } else {
            return utils.outputJsonFile(outputFilePath, data);
          }
        }))
      datas = null;
    } catch (err) {
      console.log(`err catch templateName:${templateName}, fid:${functionId}\n${err}`);
    }
  }
  const outputFilePath = path.join(outputFileDir, 'parts-json-config.json');
  await utils.outputJsonFile(outputFilePath, partsJsonConfig);
}

const changeAllSwitchable = (data, switchValue) => {
  let _data = _.cloneDeep(data);
  _data = Object.keys(_data.data.contents).reduce((pre, key) => {
    if(pre.data.contents[key].switchable !== undefined) {
      pre.data.contents[key].switchable = switchValue;
    }
    return pre;
  }, _data);
  return _data;
}
