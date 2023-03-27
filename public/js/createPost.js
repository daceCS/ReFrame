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
        $("#preview-image").attr("src", lastImage);
       
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
      let caption = $("#caption").val();
      let image = lastImage;
      if(image == null){
        alert("Choose an Image to Post")
        return;
      }
      socket.emit('upload-post', caption, image)
      window.location.replace('/feed');
      return false;
  }