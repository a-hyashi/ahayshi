'use strict';

// packages
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const htmlBeautify = require('js-beautify').html_beautify;
const _ = require('lodash');
const moment = require('moment');
const utils = require('./utils/utils');

const sideMenu001 = require('./utils/sideMenu001.json');
const breadcrumbs001 = require('./utils/breadcrumbs001.json');

exports.makeHtml = async (outputDirPath, dataDirPath, templateDirPath, backup) => {
  console.log('make styleguide htmlfile using datajsons in datadir')
  const dirs = await fs.readdir(dataDirPath);
  const promiseArray = [];
  const htmlMaker = new HtmlMaker(templateDirPath);
  await utils.dirReset(outputDirPath, backup);
  
  for (const dir of dirs) {
    const [blockNo, blockName, templateId] = dir.split('_');
    // 各makeHtmlFilesは並列に実行するため、promiseArrayに格納しておく。
    promiseArray.push(
      htmlMaker.makeHtmlFiles(
        blockNo,
        blockName,
        templateId,
        path.resolve(dataDirPath, dir),
        path.resolve(outputDirPath, dir)
      ));
  }

  // 並列実行の待機
  await Promise.all(promiseArray);
  console.log('all files are done!!!');
}

class HtmlMaker {

  constructor(templateDirPath) {
    this.template = {};
    this.templateDirPath = templateDirPath;
    this.templateMemo = utils.getTemplate(templateDirPath);
  }

  async makeHtmlFiles(blockNo, blockName, templateId, src, dest) {
    const files = await fs.readdir(src);
    const filePromiseArray = [];
    return Promise.all(
      files.map(async file => {
        if (file === 'parts-json-config.json') {
          // partsコンフィグファイルの特殊処理（部品じゃないファイル）
          if (templateId === 'sideMenu') {
            const pjcdata = await utils.readJsonFile(path.resolve(src, file));
            pjcdata['151_sideMenu_sideMenu_f28_001'] = "親がカレント";
            pjcdata['151_sideMenu_sideMenu_f28_002'] = "子がカレント";
            pjcdata['151_sideMenu_sideMenu_f28_003'] = "孫がカレント";
            return utils.fileOutput(path.join(dest, file), JSON.stringify(pjcdata, null, 2));
          } else {
            return fs.copy(path.join(src, file), path.join(dest, file));
          }
        } else {
          const fileData = await utils.readJsonFile(path.resolve(src, file));
          return this.makeStyleguideHtmlFile(
            fileData,
            file.replace(/\.json/,''),
            dest
          );
        }
      }));
  }

  async makeStyleguideHtmlFile(seedJsonData, filename, outputDir) {
    const partsVariations = seedJsonData.partsVariations.split(',');
    const templateName = seedJsonData.templateDir;
    return Promise.all(
      partsVariations.map(async partsVariation => {
        let data = seedJsonData;
        delete data['templateDir'];
        delete data['partsVariations']
        data.data.partsVariation = partsVariation;
        /**
         * https://github.com/wmssystem/nc-front/issues/1659
         * nc-frontの上記issue対応と同様の対応を追加
         * formItems内の各要素にもvariationを挿入する処理
         */ 
        if(templateName === 'formTable' && data.data.formItems && data.data.formItems.length !== 0){
          for(let item of data.data.formItems){
            item.partsVariation = partsVariation;
          }
        }
        let html = htmlBeautify(this.templateMemo(templateName)(data));
        // 151_sideMenu対応
        /**
         * 2017/12/08 wms-nad
         * sideMenuはCMSで生成するため、ここだけ独自にdata.jsonから複数のHTMLを生成する。
         */
        if (filename.split('_')[0] === '151' &&
          filename.split('_')[2] === 'sideMenu' &&
          filename.split('_')[3] === 'a00' &&
          filename.split('_')[4] === '001') {
          for (const lv of [1, 2, 3]) {
            let _html = html;
            _html = _html.replace('[sidemenu:0]', sideMenu001["htmlLv" + lv]);
            let _filename = filename.replace('a00_001',
              lv == 1 ? "f28_001" :
                lv == 2 ? "f28_002" :
                  "f28_003"
            );
            let _outputfilePath = path.join(outputDir, _filename + '_' + (partsVariation ? partsVariation : '1') + '.html');
            await utils.fileOutput(_outputfilePath, _html);
          }
          html = html.replace('[sidemenu:0]', sideMenu001.html);
        } else {
          html = html.replace('[sidemenu:0]', '<div style="border: 1px dashed red;padding: 5px;">生成されたサイドメニューが入る</div>');
        }
        // パンくず対応
        if (filename.slice(0, 3) === '023' || filename.slice(0, 3) === '167') {
          html = html.replace('[topicpath:0]', breadcrumbs001.html);
        }
        const outputfilePath = path.join(outputDir, filename + '_' + (partsVariation ? partsVariation : '1') + '.html');
        return utils.fileOutput(outputfilePath, html);
      }
    ));
  }
}
