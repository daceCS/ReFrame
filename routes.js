let path = require("path");
let express = require("express");
var formidable = require('formidable');
var mv = require('mv');

let router = express.Router();
let lastImg;
const myDatabase = require('./myDatabase');
let db = new myDatabase();
const Data = require('./Data');


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

// handles file uploads
router.post('/fileupload', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var oldpath = files.image.path;
        var newpath = __dirname + '/public/images/' + files.image.name;
        lastImg = files.image.name;
       

        
        mv(oldpath, newpath, function(err) {
           

            res.json({
                name: files.image.name
            });
        });
    });
});

// sends all post back to the client feed
router.get("/populate-feed", (req, res) => {
    res.json({
        allPost: db.getData()
    })
})

// exports express routes and myDatabase instance
module.exports = {
    router: router,
    db: db
};

// saving this code for later
/*
router.delete('/delete/:identifier', function(req, res) {
    let trimIdentifier = req.params.identifier.trim();
    if (trimIdentifier == "") {
        res.json({
            error: true
        });
        return;
    }

    let identifier = Number(trimIdentifier);
    if (Number.isNaN(identifier)) {
        res.json({
            error: true
        });
        return;
    }

    let val = db.deleteData(identifier);
    if (val == null)
        res.json({
            error: true
        });
    else
        res.json({
            error: false
        });

});
*/

