'use strict';

const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const _ = require('lodash');
const common_config = require('./btool-settings/common_config.json');

module.exports = class Utils{
  static async readDirList(dirPath) {
    await Promise.resolve();
    const list = await fs.readdir(dirPath);
    return Promise.resolve(
      list.filter((obj) => {
        return (!obj.startsWith('.'));
      }).map((obj_1) => {
        return { name: obj_1, path: path.join(dirPath, obj_1) };
      })
    );
  }

  static async fileOutput(filePath, dataString) {
    await Promise.resolve();
    return fs.outputFile(filePath, dataString);
  }

  static async outputJsonFile(filePath, dataString) {
    await Promise.resolve();
    return fs.outputFile(filePath, JSON.stringify(dataString, null, 2));
  }

  static async readJsonFile(jsonFilePath) {
    await Promise.resolve();
    const stringBuffer = await fs.readFile(jsonFilePath);
    return JSON.parse(stringBuffer);
  }

  static existsFile(filePath) {
    try {
      fs.statSync(filePath);
      return true;
    } catch (err) {
      if(err.code === 'ENOENT') return false;
    }
  }

  static getFilePath(dir, fileName) {
    let filePath = path.join(dir, fileName);
    if (this.existsFile(filePath)) return filePath;

    // テーマディレクトリにない場合はcommonを参照する
    console.log(`common使用: ${fileName}`);
    return path.join(path.resolve(), common_config.templates_dir, fileName);
  }

  static getTemplate(templateDirPath) {
    var templates = templates || {};
    var templateDirPath = templateDirPath;
    return (templateId) => {
      if(templateId in templates) return templates[templateId];

      let filePath = this.getFilePath(templateDirPath, `${templateId}/template.html`);
      try {
        var template = fs.readFileSync(filePath, 'utf-8');
      } catch(err) {
        console.error(err);
      }
      template = hbs.compile(template);
      templates[templateId] = template;
      return template;
    }
  }

  static switchContentsParameter(data, param1, param2) {
    let _data = _.cloneDeep(data);
    const _keys = Object.keys(_data.data.contents);
    for (const key of _keys) {
      if(_data.data.contents[key][param1] !== undefined && _data.data.contents[key][param2] !== undefined) {
        const __tempStr = _data.data.contents[key][param1];
        _data.data.contents[key][param1] = _data.data.contents[key][param2];
        _data.data.contents[key][param2] = __tempStr;
      }
    }
    return _data;
  }

  static async dirReset(dirPath, backup) {
    try {
      await Promise.resolve();
      if (backup) {
        return fs.copy(dirPath, dirPath + moment().format('YYYYMMDDHH24MMSS'));
      } else {
        return Promise.resolve();
      }
    } catch (err) {
      console.error(err);
      await Promise.resolve('ok');
    }
    await fs.remove(dirPath);
    return fs.mkdir(dirPath);
  }
}
