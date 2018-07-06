'use strict'

// packages
const js_yaml = require('js-yaml');

module.exports = class AigisYaml {
  constructor(name = '', tag = [], category = []){
    this.yml = {};
    this.yml.name = name;
    this.yml.tag = tag;
    this.yml.category = category;
  }

  setName(name){
    this.yml.name = name;
  }

  setTags(tags){
    this.yml.tag = tags;
  }

  addTag(tag){
    this.yml.tag.push(tag);
  }

  setCategories(categories){
    this.yml.category = categories;
  }

  addCategory(category){
    this.yml.category.push(category);
  }

  getYamlString(){
    return js_yaml.dump(this.yml);
  }
}