'use strict';

const AigisYaml = require('./aigis-yaml');
const AigisInnerMarkdown = require('./aigis-inner-markdown');
const unitTestSettings = require('../btool-settings/unit-test-settings.json');
const individualSpecifications = require('../btool-settings/individual-specifications.json');

module.exports.createUnittestMD = (functionKey, htmlDirName) => {
  return new Unittest(functionKey, htmlDirName);
}

class Unittest {
  constructor(functionKey, htmlDirName) {
    this.aigisYaml = new AigisYaml();
    this.aigisMd = new AigisInnerMarkdown();
    this.aigisYaml.setName(unitTestSettings[functionKey]['name']);
    this.aigisYaml.addCategory(`unittest/${htmlDirName}`);
    this.aigisYaml.addTag(functionKey);
  }

  setAigisMarkdown(functionKey, blockName) {
    // 最上部コメントの設定
    this.aigisMd.setHeading(3, `ブロック名称：${unitTestSettings[functionKey]['name']}`);

    const section = unitTestSettings[functionKey];
    if(!('specifications' in section)) return;

    section['specifications'].forEach(specification => {
      let caseStrings = [];
      specification['testCases'].forEach(testCase => {
        if(testCase['blocks'].includes(blockName)) {
          caseStrings.push(this.sanitize(
            `${testCase['case']} ${this.device(testCase)}`
          ));
        }
      });
      // いずれかのテストケースの対象ブロックであれば出力する
      if(!caseStrings.length) return;

      // デザイン・機能仕様ブロックのトップコメント
      this.aigisMd.setHeading(3, `[${specification['id']}:${specification['name']}]`);
      // デザイン・機能仕様コメント
      this.aigisMd.setHeading(4, 'デザイン・機能仕様：');
      if (individualSpecifications[blockName] && individualSpecifications[blockName][specification['id']]) {
        this.aigisMd.setHeading(5, '個別仕様');
        this.aigisMd.setP(this.sanitize(`${individualSpecifications[blockName][specification['id']]}`));
      }
      this.aigisMd.setHeading(4, 'テストケース：');
      this.aigisMd.setUl(caseStrings);
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
    this.aigisMd.setHeading(5, desc);
    this.aigisMd.setHeading(5, `バリエーション${variation}`);
    this.aigisMd.setCode(htmlCode.split(/\n/g));
  }

  makeAigisComment() {
    const comment =
`/*
---
${this.aigisYaml.getYamlString()}
---
${this.aigisMd.getMarkdownString()}
*/`;
    return comment;
  }

  sanitize(strings) {
    strings = strings.replace(/>/g, '&gt;');
    strings = strings.replace(/</g, '&lt;');
    strings = strings.replace(/\s/g, '&nbsp;');
    strings = strings.replace(/\\n/g, '</br>');
    return strings;
  }
}
