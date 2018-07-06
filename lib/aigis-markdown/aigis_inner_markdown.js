'use strict';

// packages
const json2md = require('json2md');

module.exports = class AigisInnerMarkdown {
  constructor(){
    this.md = [];
  }

  setHeading(lv, string){
    let data = {};
    data[`h${lv}`] = string;
    this.md.push(data);
  }

  setP(string){
    let data = {};
    data['p'] = string;
    this.md.push(data);
  }

  setUl(strings){
    let data = {};
    data['ul'] = strings;
    this.md.push(data);
  }

  setCode(contents){
    let data = {};
    data['code'] = {};
    data['code']['language'] = 'html';
    data['code']['content'] = contents;
    this.md.push(data);
  }

  getMarkdownString(){
    return json2md(this.md);
  }
}