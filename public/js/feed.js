const socket = io();
let account;



function searchBar(){
  $.get('/get-all-users', {}, (data) => {
    let AllUsersArray = data.allAccountsArray;
    let dropdown = $(".dropdown");
    
    let num = 0; 
    
    
    //if name is capitalized, solution; turn everything into lowercase
    //console.log(AllUsersArray)
    for (i = 0; i < AllUsersArray.length; i++) {
        
        let realHolder = AllUsersArray[i].substring(0, $('#search').val().length);
        realHolder = realHolder.toLowerCase();
        let dropdownElement = ` <div class="dropdown-element">
          <p>${AllUsersArray[i]}</p>
          </div>`;
        if (realHolder == $('#search').val().toLowerCase()) {
            dropdown.append(dropdownElement);
            num++;
            
            
        }else if(realHolder == ""){
          dropdown.empty();
        }
        //console.log(num);
    }


})
}



let switchFunction = 0;
socket.on('post-to-feed', () => {
    populateFeed()
})

function populateFeed() {
    let feed = $('#feed');
    feed.empty();
    let postContainer;
    let sortArray = [];
    $.get('/populate-feed', (data) => {
        let allPost = data.allPost;
        if (switchFunction == 2) {
            $.get('/get-sorted-posts', {
                allPosts: allPost
            }, (data) => {
                sortedPosts = data.sortedPosts;

                for (let i = 0; i < sortedPosts.length; i++) {
                    if (sortedPosts[i].inputType == 0) {
                        let image = sortedPosts[i].postData;
                        let caption = sortedPosts[i].caption;
                        let postedBy = sortedPosts[i].postedBy;
                        let postIndex = sortedPosts[i].postId;
                        let postLikes = sortedPosts[i].votes;
                        postContainer = `<div id="post-${postIndex}" class="post-container">
                                <div class="title">
                                  <h3 id="post-caption-${postIndex}" class="post-caption">${caption}</h3>
                                </div>
                                
                                <img src="${image}" id="post-image-${postIndex}" height="auto" width="90%"  class="post-image">
                                <div id="post-interact-${postIndex}" class="post-interact">
                                  <input type="button" value="Like" class="like-button" id="like-button-${postIndex}" onclick="likePost(this)">
                                  <p id="post-votes-${postIndex}" class="post-votes">Likes: ${postLikes}</p>  
                                  <p id="user-id-${postIndex}" class="user-id">Post By: </p>  
                                  <a href="/user/${postedBy.username}" class="user-link">${postedBy.username}</a>
                                  
                                </div>
                                
                                
                              
                            </div>`



                        feed.prepend(postContainer)





                        let client = localStorage.getItem("clientAccountIndex");
                        if (client == null) {
                            return;
                        }
                        let likeButton = $('#like-button-' + postIndex);

                        $.get('/get-user', {
                            userIndex: client
                        }, (data) => {
                            let clientLikedPost = data.userAccount.likedPost;


                            for (i = 0; i < clientLikedPost.length; i++) {

                                if (clientLikedPost[i] == postIndex) {
                                    likeButton.val("Unlike");

                                }
                            }
                        })


                    } else {
                        let text = sortedPosts[i].postData;
                        let caption = sortedPosts[i].caption;
                        let postedBy = sortedPosts[i].postedBy;
                        let postIndex = sortedPosts[i].postId;
                        let postLikes = sortedPosts[i].votes;
                        postContainer = `<div id="post-${postIndex}" class="post-container">
                                <div class="title">
                                  <h3 id="post-caption-${postIndex}" class="post-caption">${caption}</h3>
                                </div>
                                <p id="text-post">${text}</p>
                                <div id="post-interact-${postIndex}" class="post-interact">
                                <input type="button" value="Like" class="like-button" id="like-button-${postIndex}" onclick="likePost(this)">
                                  <p id="post-votes-${postIndex}" class="post-votes">Likes: ${postLikes}</p>  
                                  <p id="user-id-${postIndex}" class="user-id">Post By: </p>  
                                  <a href="/user/${postedBy.username}" class="user-link">${postedBy.username}</a>
                                  
                                </div>
                                
                                
                              
                            </div>`


                        feed.prepend(postContainer)

                        //console.log(account.following);


                        //console.log("test");
                        let client = localStorage.getItem("clientAccountIndex");
                        if (client == null) {
                            return;
                        }
                        let likeButton = $('#like-button-' + postIndex);

                        $.get('/get-user', {
                            userIndex: client
                        }, (data) => {
                            let clientLikedPost = data.userAccount.likedPost;
                            //console.log(clientLikedPost)
                            //console.log(postIndex);

                            for (i = 0; i < clientLikedPost.length; i++) {
                                if (clientLikedPost[i] == postIndex) {
                                    likeButton.val("Unlike");
                                    //console.log("reached")
                                }
                            }
                        })




                    }
                }
                
            })
            return;
        }



        for (i = 0; i < allPost.length; i++) {

            if (allPost[i].inputType == 0) {
                let image = allPost[i].postData;
                let caption = allPost[i].caption;
                let postedBy = allPost[i].postedBy;
                let postIndex = allPost[i].postId;
                let postLikes = allPost[i].votes;
                postContainer = `<div id="post-${postIndex}" class="post-container">
                                <div class="title">
                                  <h3 id="post-caption-${postIndex}" class="post-caption">${caption}</h3>
                                </div>
                                
                                <img src="${image}" id="post-image-${postIndex}" height="auto" width="90%"  class="post-image">
                                <div id="post-interact-${postIndex}" class="post-interact">
                                  <input type="button" value="Like" class="like-button" id="like-button-${postIndex}" onclick="likePost(this)">
                                  <p id="post-votes-${postIndex}" class="post-votes">Likes: ${postLikes}</p>  
                                  <p id="user-id-${postIndex}" class="user-id">Post By: </p>  
                                  <a href="/user/${postedBy.username}" class="user-link">${postedBy.username}</a>
                                  
                                </div>
                                
                                
                              
                            </div>`


                if (switchFunction == 0) {
                    feed.prepend(postContainer)
                } else if (switchFunction == 1) {
                    feed.append(postContainer)
                } else {



                    for (k = 0; k < account.following.length; k++) {
                        console.log(account.following[k]);
                        console.log(postedBy.username)
                        if (account.following[k] == postedBy.username) {
                            feed.prepend(postContainer);
                        }
                    }

                }
                let client = localStorage.getItem("clientAccountIndex");
                if (client == null) {
                    return;
                }
                let likeButton = $('#like-button-' + postIndex);

                $.get('/get-user', {
                    userIndex: client
                }, (data) => {
                    let clientLikedPost = data.userAccount.likedPost;


                    for (i = 0; i < clientLikedPost.length; i++) {

                        if (clientLikedPost[i] == postIndex) {
                            likeButton.val("Unlike");

                        }
                    }
                })


            } else {
                let text = allPost[i].postData;
                let caption = allPost[i].caption;
                let postedBy = allPost[i].postedBy;
                let postIndex = allPost[i].postId;
                let postLikes = allPost[i].votes;
                postContainer = `<div id="post-${postIndex}" class="post-container">
                                <div class="title">
                                  <h3 id="post-caption-${postIndex}" class="post-caption">${caption}</h3>
                                </div>
                                <p id="text-post">${text}</p>
                                <div id="post-interact-${postIndex}" class="post-interact">
                                <input type="button" value="Like" class="like-button" id="like-button-${postIndex}" onclick="likePost(this)">
                                  <p id="post-votes-${postIndex}" class="post-votes">Likes: ${postLikes}</p>  
                                  <p id="user-id-${postIndex}" class="user-id">Post By: </p>  
                                  <a href="/user/${postedBy.username}" class="user-link">${postedBy.username}</a>
                                  
                                </div>
                                
                                
                              
                            </div>`

                if (switchFunction == 0) {
                    feed.prepend(postContainer)
                } else if (switchFunction == 1) {
                    feed.append(postContainer)
                } else {
                    //console.log(account.following);

                    for (k = 0; k < account.following.length; k++) {
                        console.log(account.following[k]);
                        console.log(postedBy.username)
                        if (account.following[k] == postedBy.username) {
                            feed.prepend(postContainer);
                        }
                    }

                }
                //console.log("test");
                let client = localStorage.getItem("clientAccountIndex");
                if (client == null) {
                    return;
                }
                let likeButton = $('#like-button-' + postIndex);

                $.get('/get-user', {
                    userIndex: client
                }, (data) => {
                    let clientLikedPost = data.userAccount.likedPost;
                    //console.log(clientLikedPost)
                    //console.log(postIndex);

                    for (i = 0; i < clientLikedPost.length; i++) {
                        if (clientLikedPost[i] == postIndex) {
                            likeButton.val("Unlike");
                            //console.log("reached")
                        }
                    }
                })




            }




        }


    })
}

function sortNew() {
    switchFunction = 0;
    populateFeed();
}

function sortOld() {
    switchFunction = 1;
    populateFeed();
}

function sortLiked() {
    switchFunction = 2;
    populateFeed();
}

function sortFollowing() {
    switchFunction = 3;
    populateFeed();
}

function reDirectToCreatePost() {
    window.location.href = '/createPost';
}

function signOut() {
    localStorage.clear();
}

function likePost(postIdRoot) {
    let client = localStorage.getItem("clientAccountIndex");
    if (client == null) {
        window.location.href = '/login';
        return;
    }
    let postId = postIdRoot.id.split('-')[2];
    let button = $("#like-button-" + postId);
    let element = $("#post-votes-" + postId);
    //console.log(postId)

    if (button.val() == 'Like') {
        button.val("Unlike");
        socket.emit('like-post', {
            clientIndex: client,
            postId: postId
        })
        let test = element.html().split(" ");
        let number = parseInt(test[1])
        number++;

        element.html("Likes: " + number)


    } else if (button.val() == "Unlike") {
        button.val("Like");
        socket.emit('unlike-post', {
            clientIndex: client,
            postId: postId
        })

        let test = element.html().split(" ");
        let number = parseInt(test[1])
        number--;

        element.html("Likes: " + number)

        // create some update to indexg2.js with sockets
    }
}
$(document).ready(() => {


    let num = localStorage.getItem('clientAccountIndex');

    if (num == null) {
        let loginElement = `<a href="/login" id="profile-link">Profile</a>`;
        let menu = $('.menu');
        menu.append(loginElement);
    }



    if (num != null) {
        $.ajax({
            url: "/get-user",
            type: "GET",
            data: {
                userIndex: num

            },
            success: (data) => {
                //console.log(data.userAccount)
                account = data.userAccount;
                let loginElement = `<a href="/user/${data.userAccount.username}" id="profile-link">Profile</a>`;
                let menu = $('.menu');
                menu.append(loginElement);
            },
            dataType: "json"
        });
    }


    populateFeed();
})