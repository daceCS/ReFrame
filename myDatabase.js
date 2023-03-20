const {Console} = require('console');
const Data = require('./Data');

let myDatabase = function() {
  this.data = [];
}

let dataIndex = 0;

myDatabase.prototype.displayData = function() {
  for (let i = 0; i < this.data.length; i++) {
      console.log(this.data[i]);
  }
}

myDatabase.prototype.postData = function(_data) {
  this.data[dataIndex++] =
      new Data(_data.caption, _data.image);

  return true;
}

myDatabase.prototype.getData = function() {
  return this.data;
}

myDatabase.prototype.putData = function(_data) {
  for (let i = 0; i < this.data.length; i++) {
      if (this.data[i] && this.data[i].ident == _data.ident) {
          this.data[i] =
              new Data(_data.ident, _data.name, _data.filename2);
          return true;
      }
  }
  return false;
}

myDatabase.prototype.deleteData = function(ident) {
  for (let i = 0; i < this.data.length; i++) {
      if (this.data[i] && ident == this.data[i].ident) {
          let tempPtr = this.data[i];
          this.data[i] = undefined;
          return tempPtr;
      }
  }
  return null;
}

module.exports = myDatabase;