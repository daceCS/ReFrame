let Account = function(username, password){
    this.username = username;
    this.password = password;
    this.postCount = 0; 
    this.posts = [];  // array for "Data Class"
    this.following = []; // array of other accounts
}

module.exports = Account;