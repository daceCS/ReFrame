let path = require("path");
let express = require("express");
var formidable = require('formidable');
var mv = require('mv');

let router = express.Router();
let lastImg;
const myDatabase = require('./myDatabase');
let db = new myDatabase();
const Data = require('./Data');
const Account = require('./Account');

let newDevEnvVar = 0;




// standard ajax routes

// root 
router.get("/", function(req, res) {
    // redirects user to /feed
    res.redirect("/feed")
});

// sends html file to create a post
router.get("/createPost", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/views/createPost.html"));
});

// sends html file for the post feed
router.get("/feed", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/public/views/feed.html"));
})
router.get('/user/:identifier', (req, res)=>{
    let username = req.params.identifier.trim();

    let accounts = db.getData(1);

    for(i = 0; i<accounts.length; i++){
        if(accounts[i].username == username){
            res.sendFile(path.join(__dirname, "/public/views/user.html"));
            return;
            
        }
        
    }
    res.send("no user")
})
// handles file uploads
router.post('/fileupload', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var oldpath = files.image.path;
        var newpath = __dirname + '/public/images/' + files.image.name;
        lastImg = files.image.name;
        console.log(files.image.name)
       

        
        mv(oldpath, newpath, function(err) {
           
            //console.log(files.image.name)
            res.json({
                name: files.image.name
            });
        });
    });
});

// sends all post back to the client feed
router.get("/populate-feed", (req, res) => {
    res.json({
        allPost: db.getData(0)
    })
})
router.get('/login', (req, res) =>{
    res.sendFile(path.resolve(__dirname + "/public/views/login.html"));
})
router.get('/create-account', (req, res) =>{
    res.sendFile(path.resolve(__dirname + "/public/views/createAccount.html"));
})
router.get('/get-current-users', (req, res) =>{
    
    let accounts = db.getData(1); // getData pass in 1 for accounts
 
    for(i = 0; i<accounts.length; i++){
        if(req.query.username == accounts[i].username){
            accounts[i].posts = db.updateUserPost(accounts[i].username);
            res.json({userExist: true, account: accounts[i], accountIndex: i})
            return;
        }
    }
    res.json({userExist: false});
})
router.get('/get-user', (req, res) =>{
    let user = db.getUser(req.query.userIndex);
    res.json({userAccount: user});
})
router.get('/get-all-users', (req, res) =>{
    let user = db.getData(1);
    let usernames = [];
    for(i = 0; i<user.length; i++){
    usernames[i] = user[i].username;
    }
    res.json({allAccountsArray: usernames});
})
router.get('/get-post-from-id', (req, res)=>{
    let postId = req.query.postId;
    let allPost = db.getData(0);

    for(i = 0; i<allPost.length; i++){
        if(postId == allPost[i].postId){
            res.json({post: allPost[i]});
        }
    }
})

router.get('/get-sorted-posts', (req, res) =>{
    posts = req.query.allPosts; 
    sortedPosts = db.getSortedPosts(posts);
    res.json({sortedPosts: sortedPosts});
})

router.post('/handle-new-account', (req, res)=>{

    let username = req.body.username;
    let password = req.body.password;
    let accObj = new Account(username, password)
    let val = db.initAccount(accObj);
    //console.log(accObj +"handle new user");
    
    res.json({userServerIndex: val});

})

router.put('/updateFollowCount', (req, res) =>{
    
})


// exports express routes and myDatabase instance
module.exports = {
    router: router,
    db: db
};
