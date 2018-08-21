'use strict';

// packages
const AbstractAigisMarkdown = require('./abstract_aigis_markdown');
const buddyPartsFunctions = require('../utils/buddy-parts-functions.json');
const buddyPartsDesign = require('../utils/buddy-parts-design.json');
const buddyPartsTestcases = require('../btool-settings/buddy-parts-testcases.json');
const buddyFunctionDesignDesc = require('../btool-settings/function-design.json');

exports.createUnittestMD = (commentBlockName, commentBlockCategory, htmlDirName)=>{
  const unittest = new Unittest(commentBlockName, commentBlockCategory, htmlDirName);
  return unittest;
}

class Unittest extends AbstractAigisMarkdown{

  constructor(commentBlockName, commentBlockCategory, htmlDirName){
    super()
    this.aigisYaml.setName(commentBlockName);
    this.aigisYaml.addCategory(`unittest/${htmlDirName}`);
    this.aigisYaml.addTag(commentBlockCategory);
  }

  setAigisMarkdown(functionKey, blockCategory){
    //コメントブロックトップの生成
    const aigisMd = this.aigisMd;
    // 最上部コメントの設定
    // const blockName = functionKey === 'a00' ? '基本形' : buddyFunctionDesignDesc.name[functionKey];
    const blockName = buddyPartsFunctions[functionKey]['blockName'];

    aigisMd.setHeading(3, `ブロック名称：${blockName}`);

    // functionKeyの対象デザインブロックのみにする
    const designBlockKeys = Object.keys(buddyPartsDesign).filter(buddyPartsDesignKey => {
      return buddyPartsDesign[buddyPartsDesignKey]['functionBlock'] === functionKey;
    })
    if(functionKey !== 'a00' && designBlockKeys.indexOf(functionKey) === -1){
      designBlockKeys.push(functionKey);
    }

    // デザイン・機能仕様ブロック毎の処理
    for (const designBlockKey of designBlockKeys) {

      // テスト仕様記述
      if (buddyPartsTestcases[designBlockKey] !== undefined && buddyPartsTestcases[designBlockKey]['testcase'] !== undefined) {
        const testcases = buddyPartsTestcases[designBlockKey]['testcase'];
        let caseStrings = [];
        for (const testcaseKey of Object.keys(testcases)) {
          if (testcases[testcaseKey]['target'].indexOf(blockCategory) !== -1) {
            caseStrings.push( Unittest.sanitize
              `${testcases[testcaseKey]['case']} ${testcases[testcaseKey]['pc'] ?
                (testcases[testcaseKey]['sp'] ? '' : '（PCのみ）') : '（SPのみ）'}`);
          }
        }
        if (caseStrings.length !== 0) {

          // デザイン・機能仕様ブロックのトップコメント
          aigisMd.setHeading(3, `[${designBlockKey}:${buddyFunctionDesignDesc.name[designBlockKey]}(${/^d/.test(designBlockKeys) ? 'デザイン仕様' : '機能仕様'})]`);

          // デザイン・機能仕様コメント
          aigisMd.setHeading(4, 'デザイン・機能仕様：');

          if (buddyFunctionDesignDesc[blockCategory][designBlockKey]) {
            aigisMd.setHeading(5, '個別仕様');
            aigisMd.setP(Unittest.sanitize `${buddyFunctionDesignDesc[blockCategory][designBlockKey]}`);
          }

          aigisMd.setHeading(4, 'テストケース：');
          aigisMd.setUl(caseStrings);
        }
      }
    }
  }

  setHtmlFiles(desc, variation, htmlCode){
    const aigisMd = this.aigisMd;
    aigisMd.setHeading(5, desc);
    aigisMd.setHeading(5, `バリエーション${variation}`);
    aigisMd.setCode(htmlCode.split(/\n/g));
  }
  getCommentString(){
    const str =
`/*
---
${this.aigisYml.getYamlString()}
---
${this.aigisMd.getMarkdownString()}
*/`
    return str;
  }
}
