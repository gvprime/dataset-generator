var debug = require('debug')('dataset:schema');
var _ = require('underscore');
var util = require('util');
var stream = require('stream');

var Context = require('./context');
var Field = require('./field');
var helpers = require('./helpers');

// doc must be an object or an array of object
function Document (document, parent) {
  if (!(this instanceof Document)) return new Document(document, parent);
  stream.Readable.call(this, {objectMode: true});
  this._parent = parent;
  this._context = new Context(this);
  this._currVal = {};
  this._children = {};

  this._arrayConfig = helpers.demuxArray(document);
  var doc = this._arrayConfig.isArray ? _.last(document) : document;
  for (var name in doc) {
    var data = doc[name];
    if ((Array.isArray(data) && typeof data[0] === 'object') ||
        (typeof data === 'object' && !Array.isArray(data))) {
       this._children[name] = new Document(data, this);
    } else {
       this._children[name] = new Field(data, this);
    }
    (function (method) {
      var child = this._children[method];
      Object.defineProperty(this._currVal, method, {
        enumerable: true,
        get: function () {
          if (typeof child._currVal === 'undefined') {
            return child.next();
          }
          return child._currVal;
        }
      });
    }).call(this, name);
  }
}
util.inherits(Document, stream.Readable);

Document.prototype.getRoot = function () {
  return this._parent.getRoot();
};

Document.prototype._produce = function () {
  this._clean();
  var data = {};
  for (var name in this._children) {
    data[name] = this._children[name].next();
  }
  return data;
};

Document.prototype.next = function () {
  if (this._arrayConfig.isArray) {
    var data = [];
    for (var i = this._arrayConfig.num(); i > 0; i--) {
      data.push(this._produce());
    }
    return data;
  } else {
    return this._produce();
  }
};

Document.prototype._clean = function () {
  for (var child in this._children) {
    this._children[child]._clean();
  }
};

Document.prototype._read = function (n) {
  this.push(this.next());
};

module.exports = Document;