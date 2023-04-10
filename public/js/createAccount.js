let clientAccountServerIndex;
$('#username').on('keypress', function (event) {
  var regex = new RegExp("^[a-zA-Z0-9]+$");
  var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
  if (!regex.test(key)) {
     event.preventDefault();
     return false;
  }
});
function createAccount(){
    let username = $("#username").val();
    let password = $("#password").val();

    if(username == ""){
      alert("Please enter in a username that includes at least 1 character");
      return;  
    }

    if(password == ""){
      return;
    }
    $.ajax({
        url: "/get-current-users",
        type: "GET",
        data: {
          username: username
        },
        success: (data) => {
          if (data.userExist == true){
            console.log('username match')
            alert("Username Already Taken");
            return;
          }
          else {
            initAccount();
          }
        },
        dataType: "json"
      });
      function initAccount(){

        $.ajax({
          url: "/handle-new-account",
          type: "POST",
          data: {
            username: username,
            password: password
      
          },
          success: function (data) {
            if (data.error)
              alert("bad");
            else {
              clientAccountServerIndex = data.userServerIndex;
              changeWindow();
            }
            
          },
          dataType: "json"
        });
      }
      function changeWindow(){
        localStorage.setItem("clientAccountIndex", clientAccountServerIndex)
        window.location.replace('/feed');
      }
}


