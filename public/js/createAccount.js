let clientAccountServerIndex;

function createAccount(){
    let username = $("#username").val();
    let password = $("#password").val();

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


