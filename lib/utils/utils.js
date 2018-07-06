'use strict';
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const _ = require('lodash');

const dummyImgSrc = 'https://placehold.jp/400x160.png';

module.exports = class Utils{
  static readDirList(dirPath){
    return Promise.resolve()
    .then(()=>{
      return fs.readdir(dirPath)
    })
    .then(list=>{
      return Promise.resolve(
        list
        .filter((obj, index, array)=>{
          return (!obj.startsWith('.'))
        })
        .map((obj, index, array)=>{
          return {name: obj, path: path.join(dirPath, obj)};
        })
      );
    });      
  }

  static fileOutput(filepath, dataString){
    return Promise.resolve()
    .then(()=>{
      return fs.outputFile(filepath, dataString);
    });
  }

  static readJsonFile(jsonFilePath){
    return Promise.resolve()
    .then(()=>{
      return fs.readFile(jsonFilePath)
    })
    .then(stringBuffer=>{
      return JSON.parse(stringBuffer);
    })
  }
  
  static getTemplate(templateDirPath){
    var templates = templates || {}; 
    var templateDirPath = templateDirPath;
    return (templateId) => {
      if(templateId in templates){
        return templates[templateId];
      }else{
        var template = fs.readFileSync(path.join(templateDirPath, templateId + '/template.html'), 'utf-8');
        template = hbs.compile(template);
        templates[templateId] = template;
        return template;
      }
    }
  }

  static switchContentsParameter(data, param1, param2){
    let _data = _.cloneDeep(data);
    let _keys = Object.keys(_data.data.contents);
    for (let key of _keys){
      if(_data.data.contents[key][param1] !== undefined && _data.data.contents[key][param2] !== undefined){
        let __tempStr = _data.data.contents[key][param1];
        _data.data.contents[key][param1] = _data.data.contents[key][param2];
        _data.data.contents[key][param2] = __tempStr;
      }
    }
    return _data;
  }

  static imgSrcForDev(data){
    let parameter = 'imgSrc';
    _.map(data.data.contents)
    .reduce((pre, content)=>{
      if(content[parameter] !== undefined){
        content[parameter] = dummyImgSrc;
      }
      return true;
    },true)
    return data;
  } 

  static dirReset(dirPath, backup){
    return Promise.resolve()
      .then(() => {
        if (backup) {
          return fs.copy(dirPath, dirPath + moment().format('YYYYMMDDHH24MMSS'));
        } else {
          return Promise.resolve();
        }
      })
      .catch(err => {
        console.error(err);
        return Promise.resolve('ok');
      })
      .then(() => {
        return fs.remove(dirPath);
      })
      .then(() => {
        return fs.mkdir(dirPath);
      });
  }
}