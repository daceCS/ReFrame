function createAccount(){
    let username = $("username").val();
    let password = $("password").val();
    $.ajax({
        url: "/get-current-users",
        type: "GET",
        success: (data) => {
          if (data.error)
            alert("bad");
          else {
            let accounts = data.allAccounts;

            for(i = 0; i<accounts; i++){
                if(username == accounts[i].username){
                    alert("Username Already Taken");
                    return false;
                }
                else{
                    initAccount();
                }
            }
          }
        },
        dataType: "json"
      });
      function initAccount(){
        $.ajax({
            url: '/handle-new-account',
            type: 'POST',
            data: {username: username, 
                password: password}, 
            processData: false, // These two are needed to prevent JQuery from processing the form data
            contentType: false,
            mimeType: 'multipart/form-data',
            dataType: 'json', // Without this, the server's response will be a string instead of a JSON object
            success: changeWindow
          });
      }
      function changeWindow(){
        window.location.replace('/feed');
      }
}