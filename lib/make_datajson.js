'use strict';

// packages
const path = require('path');
const utils = require('./utils/utils');
const djg = require('./utils/data-json-generator');
const metaFileName = 'meta.json';
exports.makeDatajson = function(templateName, templateDir, outputFilePath) {
  console.log('htmlテンプレートからdata.jsonを作成します')
  makeDatajsonRun(templateName, templateDir, outputFilePath)
  .then(() => {
    return true;
  })
  .catch(() => {
    return false;
  })
}

function makeDatajsonRun(templateName, templateDir, outputFilePath) {
  return Promise.resolve()
  .then(() => {
    const filepath = path.join(templateDir, templateName, metaFileName);
    return utils.readJsonFile(filepath);
  })
  .then(data => {
    return Promise.all([
      djg.makeDataJsonDefaultContents(data),
      djg.makePartsVariations(data),
      djg.makeTemplateDir(templateName),
      djg.makeOtherParameters(data)
    ]);
  })
  .then(datas => {
    return Promise.resolve()
    .then(() => {
      return djg.joinDatas(datas);
    })
  })
  .then((data) => {
    return utils.outputJsonFile(outputFilePath, data);
  })
  .then(() => {
    console.log('data.jsonの作成が完了しました')
  })
  .catch(err => {
    console.log(err)
  });
}
