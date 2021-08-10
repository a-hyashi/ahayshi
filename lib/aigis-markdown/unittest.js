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
    this.aigisYaml.setName(buddyPartsFunctions[commentBlockCategory]['blockName']);
    this.aigisYaml.addCategory(`unittest/${htmlDirName}`);
    this.aigisYaml.addTag(commentBlockCategory);
  }

  setAigisMarkdown(functionKey, blockCategory) {
    //コメントブロックトップの生成
    const aigisMd = this.aigisMd;
    // 最上部コメントの設定
    aigisMd.setHeading(3, `ブロック名称：${buddyPartsFunctions[functionKey]['blockName']}`);

    // functionKeyの対象デザインブロックのみにする
    const designBlockKeys = Object.keys(buddyPartsFunctions).filter(blockName => {
      if(!buddyPartsFunctions[blockName]['testCase']) return false;
      return Object.keys(buddyPartsFunctions[blockName]['testCase']).some(testBlockKey => {
        return Object.keys(buddyPartsFunctions[blockName]['testCase'][testBlockKey]).some(testCaseKey => {
          return buddyPartsFunctions[blockName]['testCase'][testBlockKey][testCaseKey]['target'].includes(blockCategory);
        });
      });
    });
    if(functionKey !== 'a00' && !designBlockKeys.includes(functionKey)) {
      designBlockKeys.push(functionKey);
    }

    // デザイン・機能仕様ブロック毎の処理
    for (const designBlockKey of designBlockKeys) {
      // テスト仕様記述
      let caseStrings = [];
      if(!buddyPartsFunctions[designBlockKey]['testCase']) continue;
      Object.keys(buddyPartsFunctions[designBlockKey]['testCase']).forEach(testBlockKey => {
        Object.keys(buddyPartsFunctions[designBlockKey]['testCase'][testBlockKey]).forEach(testCaseKey => {
          if (buddyPartsFunctions[designBlockKey]['testCase'][testBlockKey][testCaseKey]['target'].includes(blockCategory)) {
            caseStrings.push(Unittest.sanitize(
              `${buddyPartsFunctions[designBlockKey]['testCase'][testBlockKey][testCaseKey]['case']} ${this.device(buddyPartsFunctions[designBlockKey]['testCase'][testBlockKey][testCaseKey])}`
            ));
          }
        });
      });

      if (caseStrings.length !== 0) {
        // デザイン・機能仕様ブロックのトップコメント
        aigisMd.setHeading(3, `[${designBlockKey}:${buddyPartsFunctions['blockName']}(${/^d/.test(designBlockKeys) ? 'デザイン仕様' : '機能仕様'})]`);
        // デザイン・機能仕様コメント
        aigisMd.setHeading(4, 'デザイン・機能仕様：');
        if (individualSpecifications[blockCategory] && individualSpecifications[blockCategory][designBlockKey]) {
          aigisMd.setHeading(5, '個別仕様');
          aigisMd.setP(Unittest.sanitize(`${individualSpecifications[blockCategory][designBlockKey]}`));
        }

        aigisMd.setHeading(4, 'テストケース：');
        aigisMd.setUl(caseStrings);
      }
    }
  }

  device(testCaseKey) {
    if(testCaseKey['pc']) {
      if(testCaseKey['sp']) {
        return '';
      } else {
        return '（PCのみ）';
      }
    } else {
      if(testCaseKey['sp']) {
        return '（SPのみ）';
      } else {
        console.log(`どちらのデバイスも有効でないテストケースがあります：${testCaseKey}`);
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
