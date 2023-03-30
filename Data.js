let Data = function(caption, postData, inputType, postedBy) {
    
    this.caption = caption;
    this.postData = postData;
    this.votes = 0;
    this.inputType = inputType;
    this.postedBy = postedBy;
}


module.exports = Data;