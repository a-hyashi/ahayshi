'use strict';

// packages
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const js_yaml = require('js-yaml');
const json2md = require('json2md');

const utils = require('./utils/utils');
const unittest = require('./aigis-markdown/unittest');
const buddyPartsFunctions = require('./utils/buddy-parts-functions.json');

const pjcFileName = 'parts-json-config.json';

exports.makeAigis = async (htmlDir, styleguideDir, aigisRoot) => {
  console.log('make styleguide files')

  const htmlDirList = await fs.readdir(htmlDir)
  await Promise.all(
    htmlDirList.map(async htmlDirName=>{
      return makeAigisMDFile(htmlDirName, htmlDir, styleguideDir, aigisRoot);
    })
  );
  await makeSmartphoneAssets(styleguideDir);

  console.log('DONE!')
}

const makeAigisMDFile = async (htmlDirName, htmlDirPath, destPath, refPath) => {
  const files = await fs.readdir(path.resolve(htmlDirPath, htmlDirName));
  const functions = {};
  const [blockNo, blockCategory, partsName] = htmlDirName.split('_');
  const pjcdata = JSON.parse(fs.readFileSync(path.resolve(htmlDirPath, htmlDirName, pjcFileName)));

  // htmlの入った個別ブロックフォルダについて、ファンクショングループ別に分類する。
  for(const file of files){
    if(file === pjcFileName) continue;
    const functionKey = file.replace(/\.html/,'').split('_')[3];
    if(!functions[functionKey]){
      functions[functionKey] = {};
      functions[functionKey]['files'] = [];
    }
    functions[functionKey]['files'].push(file);
  }
  // パーツ設定のロード
  const partsJsonConfig = JSON.parse(await fs.readFile(path.resolve(htmlDirPath, htmlDirName, pjcFileName), 'utf-8'));

  for(const functionKey of Object.keys(functions)){
    const commentBlockName = `${buddyPartsFunctions[functionKey]['blockName']}`;
    const unittestAigisMarkdown = unittest.createUnittestMD(commentBlockName, functionKey, htmlDirName);
    unittestAigisMarkdown.setAigisMarkdown(functionKey, blockCategory);
    for(const file of functions[functionKey]['files']){
      const html = await fs.readFile(path.resolve(htmlDirPath, htmlDirName, file), 'utf-8');
      const fileParamKey = file.replace(/_[0-9]*.html$/,'');
      const variation = file.split('_').pop().replace(/.html/,'');
      unittestAigisMarkdown.setHtmlFiles(partsJsonConfig[fileParamKey], variation, html);
      // console.log(html);
    }
    //console.log(unittestAigisMarkdown.makeAigisComment());
    await utils.fileOutput(
      path.resolve(destPath, 'parts', `${htmlDirName}_${functionKey}.md`),
      unittestAigisMarkdown.makeAigisComment());
  }
  return true;
}

// スマホ表示用を個別に作成する
const makeSmartphoneAssets = async (styleguideDir) => {
  const unittestAigisMarkdown0 = unittest.createUnittestMD('基本形', 'a00', '214_smartphoneAssets');
  const html0_1 = await fs.readFile(path.resolve('lib', 'each_part', 'mod-sp-head-bar_a00_001.html'), 'utf-8');

  unittestAigisMarkdown0.setHtmlFiles('mod-sp-head-bar', '', html0_1);
  utils.fileOutput(
    path.resolve(styleguideDir, 'parts', '214_smartphoneAssets_a00.md'),
    unittestAigisMarkdown0.makeAigisComment()
  );

  const unittestAigisMarkdown1 = unittest.createUnittestMD('電話番号表示', 'a01', '214_smartphoneAssets');
  const html1_1 = await fs.readFile(path.resolve('lib', 'each_part', 'mod-sp-head-bar_a01_001.html'), 'utf-8');

  unittestAigisMarkdown1.setHtmlFiles('あり', '', html1_1);

  const html1_2 = await fs.readFile(path.resolve('lib', 'each_part', 'mod-sp-head-bar_a01_002.html'), 'utf-8');

  unittestAigisMarkdown1.setHtmlFiles('なし', '', html1_2);
  utils.fileOutput(
    path.resolve(styleguideDir, 'parts', '214_smartphoneAssets_a01.md'),
    unittestAigisMarkdown1.makeAigisComment()
  );

  const unittestAigisMarkdown2 = unittest.createUnittestMD('サイト名の文字の大きさ', 'a02', '214_smartphoneAssets');
  const html2_1 = await fs.readFile(path.resolve('lib', 'each_part', 'mod-sp-head-bar_a02_001.html'), 'utf-8');

  unittestAigisMarkdown2.setHtmlFiles('S', '', html2_1);

  const html2_2 = await fs.readFile(path.resolve('lib', 'each_part', 'mod-sp-head-bar_a02_002.html'), 'utf-8');

  unittestAigisMarkdown2.setHtmlFiles('M', '', html2_2);

  const html2_3 = await fs.readFile(path.resolve('lib', 'each_part', 'mod-sp-head-bar_a02_003.html'), 'utf-8');

  unittestAigisMarkdown2.setHtmlFiles('L', '', html2_3);
  utils.fileOutput(
    path.resolve(styleguideDir, 'parts', '214_smartphoneAssets_a02.md'),
    unittestAigisMarkdown2.makeAigisComment()
  );
}