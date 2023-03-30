let Account = function(username, password){
    this.username = username;
    this.password = password;
    this.postCount = 0;
    this.bio = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus laboriosam qui ipsum animi itaque dicta eum, expedita unde excepturi similique, consectetur veritatis sit repellat dolores distinctio delectus veniam alias blanditiis?";
    this.posts = [];  // array for "Data Class"
    this.following = []; // array of other accounts
    this.bannerImage;
    this.profileIcon;
}

module.exports = Account;