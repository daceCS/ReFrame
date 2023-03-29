let inputType = 0;
/*
function deleteClicked() {
    let trimIdentifier = $("#identifier").val().trim();
    if (trimIdentifier == "") {
      alert("bad");
      return false;
    }
  
    $.ajax({
      url: "/delete/" + $("#identifier").val(),
      type: "DELETE",
      success: function (data) {
        if (data.error)
          alert("bad");
        else
          alert("good");
      },
      dataType: "json"
    });
    return false;
  }
*/
  function changePreviewCaption(){
  
    //Changes caption live in preview
    let captionValue = $("#caption").val()
    $("#preview-caption").text(captionValue);
  }
  
  let lastImage;
  let lastText;
  let lastImageName;
  $(document).ready(function () {
    console.log('Ready');
    $("#createButton").click(createClicked);
  });

  function uploadFile(){
    console.log($('#uploader'))
    $('#uploader').click();
  }
  
  function img() {
    let data = new FormData($("#fileupload")[0]);
  
    $.ajax({
      url: '/fileupload',
      type: 'POST',
      data: data,
      processData: false, // These two are needed to prevent JQuery from processing the form data
      contentType: false,
      mimeType: 'multipart/form-data',
      dataType: 'json', // Without this, the server's response will be a string instead of a JSON object
      success: uploadSuccess
    });
  }
  
  // !!! dont touch this (I have no idea how this works)
  function uploadSuccess(data) {
    
    let index = data.name.indexOf(".");
    if (index >= 0) {
      let ext = data.name.substring(index + 1);
      if (ext == "txt") {
        $('#text').load("images/" + data.name);
        tempMem = data.name;
        display.src = "";
      }
      else if (ext == "jpg" || ext == "png") {
        $('#text').html("Hello");
        lastImageName = data.name;
        lastImage = "images/" + data.name;
        let appendingData = `<img src="${lastImage}" alt="" height="200px" width="200px" id="preview-data">`
        $("#preview-data").remove();
        $("#image-div").append(appendingData);
       
        return;
      }
    }
  }

    //socket.io code 
    const socket = io();
    socket.on('connect', () =>{
      console.log(socket.id);
    })



    function createClicked() {
      if(inputType == 0){
        let caption = $("#caption").val();
        let postData = lastImage;
        if(postData == null){
          alert("Choose an Image to Post")
          return;
        }
        socket.emit('upload-post', caption, postData, inputType)
        window.location.replace('/feed');
        return false;
      }
      else {
        let caption =  $("#caption").val();
        let postData = $("#text-input").val();
        socket.emit('upload-post', caption, postData, inputType)
        window.location.replace('/feed');
        return false;
      }
      
      
  }
  function switchToUploadPhoto(){
    let UploadPhotoHtml = `<input id="uploader" type="file" name="image" onchange="img()" hidden accept="image/png, image/jpeg" />
    <input type="button" name="" id="upload-image" value="Upload Image" onclick="uploadFile()">`;
    console.log('etst');
    let imageDiv = $('#image-div');
    imageDiv.html(UploadPhotoHtml);
    inputType = 0;
  }
  function switchToUploadText() {
    let UploadTextHtml = ` <textarea name="text input" id="text-input" cols="60" rows="15"></textarea>`;
    let imageDiv = $('#image-div');
    imageDiv.html(UploadTextHtml);
    inputType = 1;
  }
