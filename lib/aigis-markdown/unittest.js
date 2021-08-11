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

  setAigisMarkdown(functionKey, blockCategory) {
    //コメントブロックトップの生成
    const aigisMd = this.aigisMd;
    // 最上部コメントの設定
    aigisMd.setHeading(3, `ブロック名称：${buddyPartsFunctions[functionKey]['name']}`);

    // functionKeyの対象デザインブロックのみにする
    const designBlockKeys = Object.keys(buddyPartsFunctions).filter(key => {
      if(!buddyPartsFunctions[key]['specifications']) return false;
      return buddyPartsFunctions[key]['specifications'].some(specification => {
        return specification['testCases'].some(testCase => {
          return testCase['blocks'].includes(blockCategory);
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
      if(!buddyPartsFunctions[designBlockKey]['specifications']) continue;
      buddyPartsFunctions[designBlockKey]['specifications'].forEach(specification => {
        specification['testCases'].forEach(testCase => {
          if (testCase['blocks'].includes(blockCategory)) {
            caseStrings.push(Unittest.sanitize(
              `${testCase['case']} ${this.device(testCase)}`
            ));
          }
        });
      });

      if (caseStrings.length !== 0) {
        // デザイン・機能仕様ブロックのトップコメント
        aigisMd.setHeading(3, `[${designBlockKey}:${buddyPartsFunctions['name']}(${/^d/.test(designBlockKeys) ? 'デザイン仕様' : '機能仕様'})]`);
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
