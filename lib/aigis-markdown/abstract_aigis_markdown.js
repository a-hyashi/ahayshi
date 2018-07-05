'use strict';

// packages
const AigisYaml = require('./aigis_yaml');
const AigisInnerMarkdown = require('./aigis_inner_markdown');

module.exports = class AbstractAigisMarkdown {

  constructor(name = '', tag = [], category = []){
    this.aigisYaml= new AigisYaml(name, tag, category)
    this.aigisMd = new AigisInnerMarkdown(); 
  }

  makeAigisYaml(){
    return this.aigisYaml.getYamlString();
  }
  makeAigisMarkdown(){
    return this.aigisMd.getMarkdownString();
  }
  makeAigisComment(){
    const aigisYaml = this.makeAigisYaml();
    const aigisMd = this.makeAigisMarkdown();
    return AbstractAigisMarkdown.aigisCommentSyntax(aigisYaml, aigisMd);
  }
  
  static aigisCommentSyntax(yamlStr, innerMarkdownStr){
    let commentSyntaxStr = 
`/*
---
${yamlStr}
---
${innerMarkdownStr}
*/`;
    return commentSyntaxStr;
  }

  static sanitize(strings, ...values) {
    values = values.map(value=>{
      return value
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;')
        .replace(/\s/g, '&nbsp;')
        .replace(/\\n/g, '</br>'); // サニタイズでは無いが、同時に処理するのでここに入れた。改行コードをBRに変換
    })
    return String.raw(strings, values);
  }
}