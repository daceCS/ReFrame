const socket = io();
let account;



function searchBar() {
    $.get('/get-all-users', {}, (data) => {
        let AllUsersArray = data.allAccountsArray;
        let dropdown = $(".dropdown");
        let dropdownReal = $("#dropdown-list");
        let num = 0;


        //if name is capitalized, solution; turn everything into lowercase
        dropdownReal.empty();
        for (i = 0; i < AllUsersArray.length; i++) {


            let dropdownElement = `<li>
        <a href="user/${AllUsersArray[i]}"  class="dropdown-element" /a> <p>${AllUsersArray[i]}</p>
      </li>`;


            if (AllUsersArray[i].toLowerCase().startsWith($('#search').val().toLowerCase())) {
                dropdownReal.append(dropdownElement);
                num++;
            }

            if ($('#search').val() == "") {
                dropdownReal.empty();
            }


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
                                  
                                <button class="button-like" value="Like" id="like-button-${postIndex}" onclick="likePost(this)">
                                <i class="fa fa-heart"></i>
                                <span></span>
                                </button>

                                <div>
                                  <p id="post-votes-${postIndex}" class="post-votes">Likes: ${postLikes}</p>  
                                </div>
                                  <p id="user-id-${postIndex}" class="user-id">Post By: </p>  
                                  <a href="/user/${postedBy.username}" class="user-link">${postedBy.username}</a>
                                  
                                </div>
                                
                                
                              
                            </div>`



                        feed.prepend(postContainer)





                        let client = localStorage.getItem("clientAccountIndex");
                        if (client == null) {

                        } else {
                            let likeButton = $('#like-button-' + postIndex);

                            $.get('/get-user', {
                                userIndex: client
                            }, (data) => {
                                let clientLikedPost = data.userAccount.likedPost;


                                for (i = 0; i < clientLikedPost.length; i++) {

                                    if (clientLikedPost[i] == postIndex) {
                                        likeButton.val("Unlike");
                                        $(likeButton).addClass('liked').removeClass('button-like');


                                    }
                                }
                            })
                        }


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
                                

                                <button class="button-like" value="Like" id="like-button-${postIndex}" onclick="likePost(this)">
                                <i class="fa fa-heart"></i>
                                <span></span>
                                </button>

                                  <p id="post-votes-${postIndex}" class="post-votes">Likes: ${postLikes}</p>  
                                  <p id="user-id-${postIndex}" class="user-id">Post By: </p>  
                                  <a href="/user/${postedBy.username}" class="user-link">${postedBy.username}</a>
                                  
                                </div>
                                
                                
                              
                            </div>`


                        feed.prepend(postContainer)




                        let client = localStorage.getItem("clientAccountIndex");
                        if (client == null) {

                        } else {
                            let likeButton = $('#like-button-' + postIndex);

                            $.get('/get-user', {
                                userIndex: client
                            }, (data) => {
                                let clientLikedPost = data.userAccount.likedPost;


                                for (i = 0; i < clientLikedPost.length; i++) {

                                    if (clientLikedPost[i] == postIndex) {
                                        likeButton.val("Unlike");
                                        $(likeButton).addClass('liked').removeClass('button-like');

                                    }
                                }
                            })
                        }




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
                               

                                <button class="button-like" value="Like" id="like-button-${postIndex}" onclick="likePost(this)">
                                <i class="fa fa-heart"></i>
                                <span></span>
                                </button>

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
                        if (account.following[k] == postedBy.username) {
                            feed.prepend(postContainer);
                        }
                    }

                }
                let client = localStorage.getItem("clientAccountIndex");
                if (client == null) {

                } else {
                    let likeButton = $('#like-button-' + postIndex);

                    $.get('/get-user', {
                        userIndex: client
                    }, (data) => {
                        let clientLikedPost = data.userAccount.likedPost;


                        for (i = 0; i < clientLikedPost.length; i++) {

                            if (clientLikedPost[i] == postIndex) {
                                likeButton.val("Unlike");
                                $(likeButton).addClass('liked').removeClass('button-like');

                            }
                        }
                    })
                }



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
                              

                                <button class="button-like" value="Like" id="like-button-${postIndex}" onclick="likePost(this)">
                                <i class="fa fa-heart"></i>
                                <span></span>
                                </button>


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
                        if (account.following[k] == postedBy.username) {
                            feed.prepend(postContainer);
                        }
                    }

                }
                let client = localStorage.getItem("clientAccountIndex");
                if (client == null) {

                } else {
                    let likeButton = $('#like-button-' + postIndex);

                    $.get('/get-user', {
                        userIndex: client
                    }, (data) => {
                        let clientLikedPost = data.userAccount.likedPost;


                        for (i = 0; i < clientLikedPost.length; i++) {

                            if (clientLikedPost[i] == postIndex) {
                                likeButton.val("Unlike");
                                $(likeButton).addClass('liked').removeClass('button-like');


                            }
                        }
                    })
                }

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
    window.location.href = '/login'
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
        $(button).addClass('liked').removeClass('button-like');


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
        $(button).addClass('button-like').removeClass('liked');

        // create some update to indexg2.js with sockets
    }
}
$(document).ready(() => {


    let num = localStorage.getItem('clientAccountIndex');

    if (num == null) {
        let loginElement = `<a href="/login" id="profile-link">Profile</a>`;
        let menu = $('.menu');
        window.location.href = '/create-account';
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