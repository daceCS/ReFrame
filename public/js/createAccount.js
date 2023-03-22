let clientAccount; 
let clientAccountServerIndex;

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
        $.get('/handle-new-account', (userAccount, userServerIndex)=>{
            clientAccount = userAccount; 
            clientAccountServerIndex = userServerIndex;
        })
      }
      function changeWindow(){
        window.location.replace('/feed');
      }
}

module.exports = {
    clientAccount: clientAccount, 
    clientAccountServerIndex: clientAccountServerIndex
}