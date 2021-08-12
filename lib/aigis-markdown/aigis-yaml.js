'use strict'

const js_yaml = require('js-yaml');

module.exports = class AigisYaml {
  constructor(name = '', tag = [], category = []) {
    this.yml = {};
    this.yml.name = name;
    this.yml.tag = tag;
    this.yml.category = category;
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
