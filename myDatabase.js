const {Console} = require('console');
const Data = require('./Data');
const Account = require('./Account');

let myDatabase = function() {
  this.data = [];
  this.accounts = [];
}

let dataIndex = 0;
let accountIndex = 0;

myDatabase.prototype.displayData = function(type) {
  if(type == 0){
    for (let i = 0; i < this.data.length; i++) {
      console.log(this.data[i]);
  }
  }
  if(type == 1){
    for(i = 0; i<this.accounts.length; i++){
      console.log(this.accounts[i]);
    }
  }
  
}

myDatabase.prototype.postData = function(_data) {
  let obj = new Data(_data.caption, _data.postData, _data.inputType, _data.postedBy, _data.postId);
  _data.postedBy.posts[_data.postedBy.postCount] = this.data[dataIndex];
  this.data[dataIndex] = obj;
  _data.postedBy.postCount++;
  dataIndex++;

  return true;
}
myDatabase.prototype.updateData = function(index, post){
  console.log(index);
  console.log(this.accounts[index]);
  this.accounts[index].posts[this.accounts[index].postCount] = post;
  this.accounts[index].postCount++;
}
myDatabase.prototype.initAccount = function(accObj) {
  this.accounts[accountIndex] = accObj;
  accountIndex++;
  return accountIndex-1;
}
myDatabase.prototype.getUser = function(userIndex){
  return this.accounts[userIndex];
}
myDatabase.prototype.getData = function(type) { // pass in type parameter to chose which data type is wanted (0 = post, 1 = accounts)
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