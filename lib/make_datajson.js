'use strict';

const path = require('path');
const utils = require('./utils');
const djg = require('./data-json-generator');
const metaFileName = 'meta.json';

exports.makeDatajson = function(templateName, templateDir, outputFilePath) {
  console.log('htmlテンプレートからdata.jsonを作成します')
  makeDatajsonRun(templateName, templateDir, outputFilePath).then(() => {
    return true;
  }).catch(() => {
    return false;
  })
}

async function makeDatajsonRun(templateName, templateDir, outputFilePath) {
  try {
    await Promise.resolve();
    const filepath = path.join(templateDir, templateName, metaFileName);
    const data = await utils.readJsonFile(filepath);
    const datas = await Promise.all([
      djg.makeDataJsonDefaultContents(data),
      djg.makePartsVariations(data),
      djg.makeTemplateDir(templateName),
      djg.makeOtherParameters(data)
    ]);
    await Promise.resolve();
    const data_1 = djg.joinDatas(datas);
    await utils.outputJsonFile(outputFilePath, data_1);
    console.log('data.jsonの作成が完了しました');
  } catch (err) {
    console.log(err);
  }
}
