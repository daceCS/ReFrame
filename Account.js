let Account = function(username, password){
    this.followers = 0;
    this.username = username;
    this.password = password;
    this.postCount = 0;
    this.bio = "No bio yet";
    this.posts = [];  // array for "Data Class"
    this.following = []; // array of other accounts
    this.followingCount = 0;
    let int = Math.floor(Math.random() * 4);
    this.bannerImage = '../images/banner' + int + '.png';
    this.profileIcon = '../images/defaultpfp.jpg';
    this.likedPost = [];
}

module.exports = Account;
