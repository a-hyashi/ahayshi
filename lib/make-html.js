'use strict';

const fs = require('fs-extra');
const path = require('path');
const htmlBeautify = require('js-beautify').html_beautify;
const utils = require('./utils');
const sideMenu001 = require('./each-part/sideMenu001.json');
const breadcrumbs001 = require('./each-part/breadcrumbs001.json');

module.exports.makeHtml = async (outputDirPath, dataDirPath, templateDirPath, backup) => {
  console.log('data.jsonからスタイルガイドhtmlを作成します')
  const dirs = await fs.readdir(dataDirPath);
  const promiseArray = [];
  const htmlMaker = new HtmlMaker(templateDirPath);
  await utils.dirReset(outputDirPath, backup);
  for (const dir of dirs) {
    const templateId = dir.split('_')[2];
    // 各makeHtmlFilesは並列に実行するため、promiseArrayに格納しておく。
    promiseArray.push(
      htmlMaker.makeHtmlFiles(
        templateId,
        path.resolve(dataDirPath, dir),
        path.resolve(outputDirPath, dir)
      ));
  }
  // 並列実行の待機
  await Promise.all(promiseArray);
  console.log('htmlの作成が完了しました');
}

class HtmlMaker {
  constructor(templateDirPath) {
    this.template = {};
    this.templateDirPath = templateDirPath;
    this.templateMemo = utils.getTemplate(templateDirPath);
  }

  async makeHtmlFiles(templateId, src, dest) {
    const files = await fs.readdir(src);
    return Promise.all(
      files.map(async file => {
        // partsコンフィグファイルの特殊処理（部品じゃないファイル）
        if (file === 'parts-json-config.json') {
          if (templateId === 'sideMenu') {
            const pjcdata = await utils.readJsonFile(path.resolve(src, file));
            pjcdata['151_sideMenu_sideMenu_f28_001'] = "親がカレント";
            pjcdata['151_sideMenu_sideMenu_f28_002'] = "子がカレント";
            pjcdata['151_sideMenu_sideMenu_f28_003'] = "孫がカレント";
            return utils.outputJsonFile(path.join(dest, file), pjcdata);
          } else {
            return fs.copySync(path.join(src, file), path.join(dest, file));
          }
        } else {
          const fileData = await utils.readJsonFile(path.resolve(src, file));
          return this.makeStyleguideHtmlFile(
            fileData,
            file.replace(/\.json/, ''),
            dest
          );
        }
      })
    );
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
        // https://github.com/wmssystem/nc-front/issues/1659
        // nc-frontの上記issue対応と同様の対応を追加
        // formItems内の各要素にもvariationを挿入する処理
        if(templateName === 'formTable' && 'formItems' in data.data) {
          for(let item of data.data.formItems) {
            item.partsVariation = partsVariation;
            // バリエーション間でidとnameが重複しないようにしておく
            if('options' in item) {
              for(let option of item.options) {
                // 次のループでも同じdataが使われるようなので、置換キーの文字は残す
                option.name = option.name.replace(/variation[0-9]*/, `variation${partsVariation}`);
                option.id = option.id.replace(/variation[0-9]*/, `variation${partsVariation}`);
              }
            }
          }
        }
        let html = htmlBeautify(this.templateMemo(templateName)(data));
        // 151_sideMenu対応
        // sideMenuはCMSで生成するため、ここだけ独自にdata.jsonから複数のHTMLを生成する。
        if (filename.match(/^151_.*_sideMenu_a00_001$/)) {
          for (const lv of [1, 2, 3]) {
            const _html = html.replace('[sidemenu:0]', sideMenu001["htmlLv" + lv]);
            const _filename = filename.replace('a00_001', `f28_00${lv}`);
            const _outputfilePath = path.join(outputDir, _filename + '_' + this.paddingZero(partsVariation ? partsVariation : '1') + '.html');
            await utils.fileOutput(_outputfilePath, _html);
          }
          html = html.replace('[sidemenu:0]', sideMenu001.html);
        } else {
          html = html.replace('[sidemenu:0]', '<div style="border: 1px dashed red;padding: 5px;">生成されたサイドメニューが入る</div>');
        }
        // パンくず対応
        if (filename.startsWith('023') || filename.startsWith('167')) {
          html = html.replace('[topicpath:0]', breadcrumbs001.html);
        }
        const outputfilePath = path.join(outputDir, filename + '_' + this.paddingZero(partsVariation ? partsVariation : '1') + '.html');
        return utils.fileOutput(outputfilePath, html);
      }
    ));
  }

  paddingZero(partsVariation) {
    return ('00' + partsVariation).slice(-2);
  }
}
