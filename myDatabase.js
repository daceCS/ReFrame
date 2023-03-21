const {Console} = require('console');
const Data = require('./Data');
const Account = require('./Account');

let myDatabase = function() {
  this.data = [];
  this.accounts = [];
}

let dataIndex = 0;
let accountIndex = 0;

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

myDatabase.prototype.initAccount = function(accObj) {
  this.accounts[accountIndex] = accObj;
  accountIndex++;
}

myDatabase.prototype.getData = function(type) { // pass in type parameter to chose which data type is wanted
  if(type == 0){
    return this.data;

  }
  if(type == 1) {
    return this.accounts;
  }
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