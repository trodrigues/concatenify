'use strict';

var through = require('through');
var glob = require('glob');
var falafel = require('falafel');
var path = require('path');

function makeTreeFile(basedir, filePath) {
  var treePath = path.join(basedir, filePath);
  var sourceFiles = glob.sync(treePath);
  var treeFile = '';
  sourceFiles.forEach(function (file) {
    treeFile += "require('" + file.replace(replaceBackslashes(basedir), '.') + "');";
  });
  return treeFile;
}

function replaceBackslashes(basedir) {
  return basedir.replace(/\\/g, '/');
};

function isCallFor(node, name) {
  var callee = node.callee;
  return node.type == 'CallExpression' && callee.type == 'Identifier' && callee.name == name;
}

function getArgOfType(node, index, type) {
  var args = node.arguments;
  return args[index].type == type && args[index].value;
}

function isRequireFor(node, moduleName) {
  return isCallFor(node, 'require') && getArgOfType(node, 0, 'Literal') == moduleName;
}

function concatenify(file) {
  var data = '';
  var dirname = path.dirname(file);

  return through(
    function write(buf) { data += buf; },
    function end() {
      var output = falafel(data, function (node) {
        if(isRequireFor(node, 'concatenify')){
          node.update('undefined');
        }
        if(isCallFor(node, 'concatenify')){
          var filePath = getArgOfType(node, 0, 'Literal');
          var treeFile = makeTreeFile(dirname, filePath);
          node.update(treeFile);
        }
      });
      this.queue(String(output));
      this.queue(null);
    }
  );
};

module.exports = concatenify;
