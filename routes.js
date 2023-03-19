let path = require("path");
let express = require("express");
var formidable = require('formidable');
var mv = require('mv');

let router = express.Router();
let lastImg;
const myDatabase = require('./myDatabase');
let db = new myDatabase();
const Data = require('./Data');

router.get("/",function(req,res) {
    res.redirect("/home")
});
router.get("/createPost",function(req,res) {
    res.sendFile(path.join(__dirname, "/public/views/createPost.html"));
});
router.get("/home", (req, res) =>{
    res.sendFile(path.resolve(__dirname + "/public/views/feed.html"));
})

router.post('/fileupload', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.image.path;
        var newpath = __dirname + '/public/images/' + files.image.name;
        //console.log(files.image.name);
        lastImg = files.image.name;

        //console.log('Received image: ' + files.image.name);

        mv(oldpath, newpath, function (err) {
            //if (err) throw err;

            res.json({ name: files.image.name });
        });
    });
});

router.get("/populate-feed", (req,res)=>{
   //db.displayData()
   res.json({allPost: db.getData()})
})






router.delete('/delete/:identifier', function(req, res){
    let trimIdentifier = req.params.identifier.trim();
    if (trimIdentifier == "") {
        res.json({error:true});
        return;
    }

    let identifier = Number(trimIdentifier);
    if (Number.isNaN(identifier)) {
        res.json({error:true});
        return;
    }
//changed code.
//    return( db.deleteData(identifier,res));

    let val = db.deleteData(identifier);
    if (val == null)
        res.json({error:true});
    else
        res.json({error:false});

});

module.exports = {router:router, db:db};
