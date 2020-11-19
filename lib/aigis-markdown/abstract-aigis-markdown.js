'use strict';

const AigisYaml = require('./aigis-yaml');
const AigisInnerMarkdown = require('./aigis-inner-markdown');

module.exports = class AbstractAigisMarkdown {
  constructor(name = '', tag = [], category = []) {
    this.aigisYaml= new AigisYaml(name, tag, category);
    this.aigisMd = new AigisInnerMarkdown();
  }

  makeAigisYaml() {
    return this.aigisYaml.getYamlString();
  }
  makeAigisMarkdown() {
    return this.aigisMd.getMarkdownString();
  }
  makeAigisComment() {
    const aigisYaml = this.makeAigisYaml();
    const aigisMd = this.makeAigisMarkdown();
    return AbstractAigisMarkdown.aigisCommentSyntax(aigisYaml, aigisMd);
  }

  static aigisCommentSyntax(yamlStr, innerMarkdownStr) {
    const commentSyntaxStr =
`/*
---
${yamlStr}
---
${innerMarkdownStr}
*/`;
    return commentSyntaxStr;
  }

  static sanitize(strings) {
    strings = strings.replace(/>/g, '&gt;');
    strings = strings.replace(/</g, '&lt;');
    strings = strings.replace(/\s/g, '&nbsp;');
    strings = strings.replace(/\\n/g, '</br>');
    return strings;
  }
}
