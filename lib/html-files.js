'use strict';

const fs = require('fs-extra');
const path = require('path');
const unittest = require('./aigis-markdown/unittest');
const unitTestSettings = require('./unit-test-settings');
const pjcFileName = 'parts-json-config.json';

module.exports.makeUnitTestFiles = async (dataJsonDir, htmlDir, styleguideDir) => {
  console.log('mdを作成します');
  const htmlDirList = await fs.readdir(htmlDir);
  await Promise.all(
    htmlDirList.map(async htmlDirName => {
      return makeAigisMDFile(dataJsonDir, htmlDirName, htmlDir, styleguideDir);
    })
  );
  console.log('mdの作成が完了しました');
}

module.exports.makeExtraTestFiles = async (styleguideDir) => {
  await Promise.all([
    makeLogin(styleguideDir),
    makeSmartphoneAssets0(styleguideDir),
    makeSmartphoneAssets1(styleguideDir),
    makeSmartphoneAssets2(styleguideDir)
  ]);
}

const makeAigisMDFile = async (dataJsonDir, htmlDirName, htmlDir, destPath) => {
  const files = await fs.readdir(path.resolve(htmlDir, htmlDirName));
  const functions = {};
  const [_blockNo, blockName, _partsName] = htmlDirName.split('_');
  // htmlの入った個別ブロックフォルダについて、ファンクショングループ別に分類する。
  for(const file of files) {
    const functionKey = file.replace(/\.html/, '').split('_')[3];
    if(!functions[functionKey]) {
      functions[functionKey] = {};
      functions[functionKey]['files'] = [];
    }
    functions[functionKey]['files'].push(file);
  }
  // パーツ設定のロード
  const partsJsonConfig = JSON.parse(await fs.readFile(path.resolve(dataJsonDir, htmlDirName, pjcFileName), 'utf-8'));
  for(const functionKey of Object.keys(functions)) {
    const unittestAigisMarkdown = unittest.createUnittestMD(functionKey, htmlDirName);
    unittestAigisMarkdown.setAigisMarkdown(functionKey, blockName);
    for(const file of functions[functionKey]['files']) {
      const html = await fs.readFile(path.resolve(htmlDir, htmlDirName, file), 'utf-8');
      const fileParamKey = file.replace(/_[0-9]*.html$/, '');
      const variation = Number(file.split('_').pop().replace(/.html/, ''));
      unittestAigisMarkdown.setHtmlFiles(partsJsonConfig[fileParamKey], variation, html);
    }
    await fs.outputFile(
      path.resolve(destPath, 'parts', `${htmlDirName}_${functionKey}.md`),
      unittestAigisMarkdown.makeAigisComment()
    );
  }
  return true;
}

// ログイン部品を個別に作成する
const makeLogin = async (styleguideDir) => {
  const unittestAigisMarkdown = unittest.createUnittestMD('a00', '212_login');
  for(const functionId of unitTestSettings.targetFunctionIds({ 'blockName': 'login' })) {
    unittestAigisMarkdown.setAigisMarkdown(functionId, 'login');
  }
  const html = await fs.readFile(path.resolve('lib', 'each-part', 'login.html'), 'utf-8');
  unittestAigisMarkdown.setHtmlFiles('login', '', html);
  fs.outputFile(
    path.resolve(styleguideDir, 'parts', '212_login_a00.md'),
    unittestAigisMarkdown.makeAigisComment()
  );
}

// スマホ表示用を個別に作成する
const makeSmartphoneAssets0 = async (styleguideDir) => {
  const unittestAigisMarkdown = unittest.createUnittestMD('a00', '214_smartphoneAssets');
  const html = await fs.readFile(path.resolve('lib', 'each-part', 'mod-sp-head-bar-a00-001.html'), 'utf-8');
  unittestAigisMarkdown.setHtmlFiles('mod-sp-head-bar', '', html);
  fs.outputFile(
    path.resolve(styleguideDir, 'parts', '214_smartphoneAssets_a00.md'),
    unittestAigisMarkdown.makeAigisComment()
  );
}

const makeSmartphoneAssets1 = async (styleguideDir) => {
  const unittestAigisMarkdown = unittest.createUnittestMD('a01', '214_smartphoneAssets');
  const html1 = await fs.readFile(path.resolve('lib', 'each-part', 'mod-sp-head-bar-a01-001.html'), 'utf-8');
  unittestAigisMarkdown.setHtmlFiles('あり', '', html1);
  const html2 = await fs.readFile(path.resolve('lib', 'each-part', 'mod-sp-head-bar-a01-002.html'), 'utf-8');
  unittestAigisMarkdown.setHtmlFiles('なし', '', html2);
  fs.outputFile(
    path.resolve(styleguideDir, 'parts', '214_smartphoneAssets_a01.md'),
    unittestAigisMarkdown.makeAigisComment()
  );
}

const makeSmartphoneAssets2 = async (styleguideDir) => {
  const unittestAigisMarkdown = unittest.createUnittestMD('a02', '214_smartphoneAssets');
  const html1 = await fs.readFile(path.resolve('lib', 'each-part', 'mod-sp-head-bar-a02-001.html'), 'utf-8');
  unittestAigisMarkdown.setHtmlFiles('S', '', html1);
  const html2 = await fs.readFile(path.resolve('lib', 'each-part', 'mod-sp-head-bar-a02-002.html'), 'utf-8');
  unittestAigisMarkdown.setHtmlFiles('M', '', html2);
  const html3 = await fs.readFile(path.resolve('lib', 'each-part', 'mod-sp-head-bar-a02-003.html'), 'utf-8');
  unittestAigisMarkdown.setHtmlFiles('L', '', html3);
  fs.outputFile(
    path.resolve(styleguideDir, 'parts', '214_smartphoneAssets_a02.md'),
    unittestAigisMarkdown.makeAigisComment()
  );
}
