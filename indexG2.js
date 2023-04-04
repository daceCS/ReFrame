var express = require('express');
var bodyParser = require('body-parser');
let router = require("./routes");
var app = express();
const http = require('http').Server(app);
const Data = require('./Data');
let postId;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/', express.static('./public'));
app.use(router.router);

// attach http server to http server
const io = require('socket.io')(http);

// create a new connection with socket.io
io.on('connection', socket => {
    socket.on('upload-post', (upObj) => {
       postId = generatePostId();
        let obj = new Data(upObj.caption, upObj.postData, upObj.inputType, upObj.userAccount, postId);
        let val = router.db.postData(obj);
        router.db.updateData(upObj.userIndex, obj);
        postId++;
        io.emit('post-to-feed');
    })
    socket.on('like-post', (postObj) =>{
        
    })
})

function generatePostId(){
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 5) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    if(checkIds() == false){
        generatePostId();
    }
    return result;
}
function checkIds(newPostId){
    let allPost = router.db.getData(0);

    for(i = 0; i<allPost.length; i++){
        if(allPost[i].postId == newPostId){
            return false;
        }
    }
    return true;
}

var port = process.env.PORT || 3002;
http.listen(port, () => {
    console.log(`Server live on: port ${port}`)
});
