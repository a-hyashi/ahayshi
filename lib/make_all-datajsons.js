'use strict';

// packages
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const utils = require('./utils/utils');
const djg = require('./utils/data-json-generator');
const bpf = require('./utils/buddy-parts-functions');
const mdj = require('./make_datajson');

const partsCategories = require('./btool-settings/parts-categories.json');

const metaFileName = 'meta.json';

module.exports = class MakeAllDatajson {

  /**
   * templateNameとtemplateDirの値を元に、outputFileDirにoutputFileNameでdata.json（デフォルト設定のみ）を生成する。
   * @param {*} templateName 
   * @param {*} templateDir 
   * @param {*} outputFileDir
   * @param {*} outputFileName
   */
  static async makeAllDatajson(templateName, templateDir, outputFileDir, outputFileName){
    console.log('make styleguide htmlfile using datajsons in datadir')
    djg.init(templateDir);
    try{
      await makeAllDatajsonRun(templateName, templateDir, outputFileDir, outputFileName)
      console.log('all files are done!!!')
    } catch(err){
      console.error(`Failed to get name: ${err.message}`);
    }
  }

  /**
   * 外部設定にそって、全部品の全パターンのdata.jsonを生成する。
   * @param {*} templateDirPath 
   * @param {*} outputFileDir 
   */
  static async makeAllDatajsonFull(templateDirPath, outputFileDir){
    console.log('make datajsons full')
    djg.init(templateDirPath);
    const keys = Object.keys(partsCategories);
    const runParameters = [];
    for(const key of keys){
      for(const category of partsCategories[key]){
        if(!category.parts){
          console.warn(`blockに対して開発用パーツが設定されていません。（category id: ${category.name})`);
          continue;
        }
        runParameters.push({
          'parts': category.parts,
          'key': key,
          'name': category.name,
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
            `${runParameter['key']}_${runParameter['name']}_${runParameter['parts']}`),
          `${runParameter['key']}_${runParameter['name']}_${runParameter['parts']}`,
          runParameter['name'])
      })
    );
    console.log('all files are done!!!')
  }
}

/**
 * 
 * @param {*} templateName 
 * @param {*} templateDir 
 * @param {*} outputFileDir 
 * @param {*} outputFileName 
 * @param {*} partsCategory 
 */
let makeAllDatajsonRun = async (templateName, templateDir, outputFileDir, outputFileName, partsCategory) => {
  // 設定保存用
  let tempConfig = {};

  // ファイルに関する値の保持用
  let partsJsonConfig = {};

  const partsJsonConfigSet = (outputFilename, labelStr) => { 
    partsJsonConfig[outputFilename.replace('\.json','')] = labelStr;
  }

  const filepath = path.join(templateDir, templateName, metaFileName);
  
  const partsData = await utils.readJsonFile(filepath).catch (err =>{
    console.error(`path Error\ntemplateDir  :${templateDir}\ntempalteName :${templateName}\nmetaFileName :${metaFileName}`);
  });
  // 設定保存用に現行設定値を保続
  tempConfig.config = _.cloneDeep(partsData.config);
  tempConfig.area = _.cloneDeep(partsData.area);
  tempConfig.defaults = {};
  tempConfig.defaults.config = _.cloneDeep(partsData.defaults.config);
  tempConfig.defaults.contents = {};
  Object.keys(partsData.defaults.contents)
    .reduce((pre, key) => {
      pre[key] = {};
      pre[key].config = partsData.defaults.contents[key].config;
      pre[key].meta = partsData.defaults.contents[key].meta;
      return pre;
    }, tempConfig.defaults.contents)
  // data.jsonを生成（幾つかのパーツに分けて）
  let datas = await Promise.all([
    djg.makeDataJsonDefaultContents(partsData),
    djg.makePartsVariations(partsData),
    djg.makeTemplateDir(templateName),
    djg.makeOtherParameters(partsData)
  ]);
  // 分けて生成したdata.jsonを結合
  // childを持っている場合に、trueが入っている。
  tempConfig._hasChild = datas[0]._hasChild;
  delete datas[0]._hasChild;
  let data = djg.joinDatas(datas);
    //imgSrcを開発用に変更
  data = djg.imgSrcForDev(data);
  // デフォルト状態の部品を出力しておく処理
  let filename = `${outputFileName}_a00_001.json`;
  partsJsonConfigSet(filename, "基本形");
  await utils.fileOutput(
    path.join(outputFileDir, filename),
    JSON.stringify(data, null, 2)
  );

  //　スイッチャブル判定
  tempConfig._hasSwitchable = djg.hasSwitchable(data);
  if (tempConfig._hasSwitchable) {
    data = bpf.switchableAllOff(data);
    filename = `${outputFileName}_f00_001.json`;
    partsJsonConfigSet(filename, '全要素非表示／全SWがOFF');
    await utils.fileOutput(
      path.join(outputFileDir, filename),
      JSON.stringify(data, null, 2)
    );
    data = bpf.switchableAllOn(data);
    filename = `${outputFileName}_f00_002.json`;
    partsJsonConfigSet(filename, "全要素表示／全SWがON");
    await utils.fileOutput(
      path.join(outputFileDir, filename),
      JSON.stringify(data, null, 2)
    );
  }
  
  // 子部品がある場合に、パーツからの物に切り替える
  if (tempConfig._hasChild) {
    //ここに子供のhtmlを切り替える処理を記述する。
    data = utils.switchContentsParameter(data, 'childrenHtml', 'childrenHtml_fromParts');
    let filename = `${outputFileName}_f00_003.json`;
    partsJsonConfigSet(filename, "編集枠：子部品追加");
    await utils.fileOutput(
      path.join(outputFileDir, filename),
      JSON.stringify(data, null, 2)
    );
  }

  // 部品が持っている機能IDのみにフィルタする
  const functionIds = bpf.functionIds().filter((functionId)=>{
    return bpf.hasFunction(data, partsCategory, functionId);
  })
  for(const functionId of functionIds){
    let datas = bpf.allFunctionalDatas(functionId, data, tempConfig);
    if (!datas) {
      continue;
    }
    try{
      await Promise.all(
        datas.map((data, index) => {
          let jsonStr = "";
          const keys = Object.keys(data);
          const currentOutputFilename = `${outputFileName}_${functionId.replace(/-[0-9]*$/, '')}_${('000' + (index + 1)).slice(-3)}.json`;
          const outputFilePath = path.join(outputFileDir, currentOutputFilename);
          if (keys.length == 1) {
            jsonStr = JSON.stringify(data[keys[0]], null, 2);
            partsJsonConfigSet(currentOutputFilename, keys[0]);
          } else {
            jsonStr = JSON.stringify(data, null, 2);
          }
          return utils.fileOutput(outputFilePath, jsonStr);
        }))
      datas = null;
    } catch (err) {
      console.log(`err catch templateName:${templateName}, fid:${functionId}\n${err}`);
    }
  }
  let outputFilePath = path.join(outputFileDir, 'parts-json-config.json');
  await utils.fileOutput(outputFilePath, JSON.stringify(partsJsonConfig, null, 2));
}