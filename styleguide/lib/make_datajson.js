'use strict';

// packages
const fs = require('fs-extra');
const path = require('path');

const utils = require('./utils/utils');
const djg = require('./utils/data-json-generator');

const metaFileName = 'meta.json';

exports.makeDatajson = function(templateName, templateDir, outputFilePath){
  console.log('make styleguide htmlfile using datajsons in datadir')
  makeDatajsonRun(templateName, templateDir, outputFilePath)
  .then(()=>{
    return true;
  })
  .catch(()=>{
    return false;
  })
}

function makeDatajsonRun(templateName, templateDir, outputFilePath){
  return Promise.resolve()
  .then(()=>{
    let filepath = path.join(templateDir, templateName, metaFileName);
    return utils.readJsonFile(filepath);
  })
  .then(data=>{
    return Promise.all([
      djg.makeDataJsonDefaultContents(data),
      djg.makePartsVariations(data),
      djg.makeTemplateDir(templateName),
      djg.makeOtherParameters(data)
    ]);
  })
  .then(datas => {
    return Promise.resolve()
    .then(()=>{
      return djg.joinDatas(datas);
    })
  })
  .then((data)=>{
    let str = JSON.stringify(data);
    return utils.fileOutput(outputFilePath, JSON.stringify(data, null, 2));
  })
  .then(()=>{
    console.log('all files are done!!!')
  })
  .catch(err=>{
    console.log(err)
  });
}

function makeDataObject(data){
  return Promise.resolve()
  .then(data=>{
    return Promise.all([
      djg.makeDataJsonDefaultContents(data),
      djg.makeTemplateDir(templateName),
      djg.makeOtherParameters(data)
    ]);
  })
  .then(datas => {
    return Promise.resolve()
    .then(()=>{
      return djg.joinDatas(datas);
    })
  })
}