var express = require('express');
var bodyParser = require('body-parser');
let router = require("./routes");
var app = express();
const http = require('http').Server(app);
const Data = require('./Data');

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
    socket.on('upload-post', (caption, postData, inputType) => {
        
        let obj = new Data(caption, postData, inputType);
        let val = router.db.postData(obj);
        io.emit('post-to-feed');
    })
})

var port = process.env.PORT || 3002;
http.listen(port, () => {
    console.log(`Server live on: port ${port}`)
});
