let Data = function(caption, postData, inputType, postedBy, postId) {
    
    this.caption = caption;
    this.postData = postData;
    this.votes = 0;
    this.inputType = inputType;
    this.postedBy = postedBy;
    this.postId = postId;
}


module.exports = Data;