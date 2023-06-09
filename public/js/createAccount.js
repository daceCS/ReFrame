let clientAccountServerIndex;


function createAccount() {
    let username = $("#username").val();
    let password = $("#password").val();

    if (username == "") {
        alert("Please enter in a username that includes at least 1 character");
        return;
    }

    if (username.includes("/") || username.includes("\\") || username.includes(" ") ||
        username.includes("%") || username.includes("|") || username.includes("=")) {
        alert("Please include url friendly characters in your username");
        return;
    }

    if (password == "") {
        alert("Please put a password");
        return;
    }
    $.ajax({
        url: "/get-current-users",
        type: "GET",
        data: {
            username: username
        },
        success: (data) => {
            if (data.userExist == true) {
                alert("Username Already Taken");
                return;
            } else {
                initAccount();
            }
        },
        dataType: "json"
    });

    function initAccount() {

        $.ajax({
            url: "/handle-new-account",
            type: "POST",
            data: {
                username: username,
                password: password

            },
            success: function(data) {
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

    function changeWindow() {
        localStorage.setItem("clientAccountIndex", clientAccountServerIndex)
        window.location.replace('/feed');
    }
}