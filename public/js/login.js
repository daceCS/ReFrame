function login(){
    let username = $('#username').val();


    if(username == "" || password == ""){
        alert("Missing either password or username")
        return;
    }
   
    $.get('/get-current-users', {username: username}, success)
}

function success(data){
    let password = $("#password").val();
    if (data.userExist == true){
        console.log(password)
    if(data.account.password == password){ // login is good
        localStorage.setItem("clientAccountIndex", data.accountIndex)
        window.location.replace('/feed');
    } 
    else if(data.account.password != password){ // login is good
        alert("Password is incorrect")
        return;
    }
    }
    else if(data.userExist == false){ // login is bad because no user exist on database
    alert("No user exist")
    return;
    }
}
