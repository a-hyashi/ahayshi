'use strict';

const AbstractAigisMarkdown = require('./abstract-aigis-markdown');
const buddyPartsFunctions = require('../btool-settings/buddy-parts-functions.json');
const individualSpecifications = require('../btool-settings/individual-specifications.json');

module.exports.createUnittestMD = (commentBlockCategory, htmlDirName) => {
  return new Unittest(commentBlockCategory, htmlDirName);
}

class Unittest extends AbstractAigisMarkdown {
  constructor(commentBlockCategory, htmlDirName) {
    super();
    this.aigisYaml.setName(buddyPartsFunctions[commentBlockCategory]['name']);
    this.aigisYaml.addCategory(`unittest/${htmlDirName}`);
    this.aigisYaml.addTag(commentBlockCategory);
  }

  setAigisMarkdown(functionKey, blockName) {
    //コメントブロックトップの生成
    const aigisMd = this.aigisMd;
    // 最上部コメントの設定
    aigisMd.setHeading(3, `ブロック名称：${buddyPartsFunctions[functionKey]['name']}`);

    const category = buddyPartsFunctions[functionKey];
    if(!('specifications' in category)) return;

    category['specifications'].forEach(specification => {
      let caseStrings = [];
      specification['testCases'].forEach(testCase => {
        if(testCase['blocks'].includes(blockName)) {
          caseStrings.push(Unittest.sanitize(
            `${testCase['case']} ${this.device(testCase)}`
          ));
        }
      });
      // いずれかのテストケースの対象ブロックであれば出力する
      if(!caseStrings.length) return;

      // デザイン・機能仕様ブロックのトップコメント
      aigisMd.setHeading(3, `[${specification['id']}:${specification['name']}]`);
      // デザイン・機能仕様コメント
      aigisMd.setHeading(4, 'デザイン・機能仕様：');
      if (individualSpecifications[blockName] && individualSpecifications[blockName][specification['id']]) {
        aigisMd.setHeading(5, '個別仕様');
        aigisMd.setP(Unittest.sanitize(`${individualSpecifications[blockName][specification['id']]}`));
      }
      aigisMd.setHeading(4, 'テストケース：');
      aigisMd.setUl(caseStrings);
    });
  }

  device(testCase) {
    if(testCase['pc']) {
      if(testCase['sp']) {
        return '';
      } else {
        return '（PCのみ）';
      }
    } else {
      if(testCase['sp']) {
        return '（SPのみ）';
      } else {
        console.log(`どちらのデバイスも有効でないテストケースがあります：${testCase['id']}`);
        return '';
      }
    }
  }

  setHtmlFiles(desc, variation, htmlCode) {
    const aigisMd = this.aigisMd;
    aigisMd.setHeading(5, desc);
    aigisMd.setHeading(5, `バリエーション${variation}`);
    aigisMd.setCode(htmlCode.split(/\n/g));
  }
  getCommentString() {
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
