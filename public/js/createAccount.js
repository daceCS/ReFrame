let clientAccount; 
let clientAccountServerIndex;

function createAccount(){
    let username = $("#username").val();
    let password = $("#password").val();
    $.ajax({
        url: "/get-current-users",
        type: "GET",
        data: {
          username: username,
          password: password
    
        },
        success: (data) => {
          if (data.userExist)
            alert("Username Already Taken");
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
        window.location.replace('/feed');
      }
}


