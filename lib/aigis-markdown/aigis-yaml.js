'use strict'

const js_yaml = require('js-yaml');

module.exports = class AigisYaml {
  constructor() {
    this.yml = {};
    this.yml.name = '';
    this.yml.tag = [];
    this.yml.category = [];
  }

  setName(name) {
    this.yml.name = name;
  }

  addTag(tag) {
    this.yml.tag.push(tag);
  }

  addCategory(category) {
    this.yml.category.push(category);
  }

  getYamlString() {
    return js_yaml.dump(this.yml);
  }
}
