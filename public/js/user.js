

const socket = io();
let i;
let switchFunction = 0;
let bio; 

$(document).ready(()=>{
  let userPageObj;
  let pathname = window.location.pathname;
  let paths = pathname.split('/');
  let userPage = paths[2];
  let userPageUsername;
  let userPageFollowCount; 
  let userPagePostCount;
  let userPageBio;
  let allPost;
  let userBannerImg;
  let userProfileIcon;
  let clientUser = localStorage.getItem("clientAccountIndex");
  
  $.get('/get-current-users', {username: userPage}, (data)=>{
      userPageObj = data.account;
      userPageUsername = userPageObj.username;
      userPageFollowCount = userPageObj.followers;
      userPagePostCount = userPageObj.postCount;
      userPageBio = userPageObj.bio;
      allPost = userPageObj.posts;
      userBannerImg = userPageObj.bannerImage;
      userProfileIcon = userPageObj.profileIcon;
      $('title').html(userPageUsername);
      let userCard = `<div class="user-info">
      <div class="banner-class">
      <img class="banner" src="${userBannerImg}">
      </div>
      <div class="profileIcon-class">
      <img class="profileIcon" src="${userProfileIcon}">
      </div>
      <p id="username">${userPageUsername}</p>
      <p id="follow-count">Followers: ${userPageFollowCount}</p>
      <p id="post-count">Posts: ${userPagePostCount}</p>

      <p id="bio">${userPageBio}</p>
  </div>`
      let body = $(document.body);
      body.append(userCard);
      populateFeed()

      // populate feed
      
    
  });
  $.get('/get-user', {userIndex: clientUser}, (data)=>{
    let userFollowList = data.userAccount.following;
    for(i = 0; i<userFollowList.length; i++){
      if(userFollowList[i] == userPage){
        $('#Follow-User').val("Unfollow");
        
      }
    }
    if(data.userAccount.username == userPage){
      let userInfo = $('.user-info');
      let banner = $('.banner-class');
      let bio = $('#bio');
      let bioVal = $('#bio').text()
      console.log(bioVal)


      banner.append(`<input type="button" onclick="changeBanner()" value="Change Banner" id="banner-button">`);
      banner.append(`<input type="button" onclick="ChangeIcon"()" value="Change Profile Icon" id="icon-button">`);
      bio.html(` <textarea name="text input" id="bio-input" cols="32" rows="6" oninput="changeBio()">${bioVal}</textarea>`);
      userInfo.append(`<input type="button" onclick="saveChanges()" value="Save Changes" id="save-button">`)
    }
    
  })

  

  


  if(localStorage.getItem('clientAccountIndex') == null){
    let loginElement = `<a href="/login" id="profile-link">Profile</a>`;
    let menu = $('.menu');
    menu.append(loginElement);
  }
  else if(localStorage.getItem('clientAccountIndex') != null){
    let userIndex = localStorage.getItem('clientAccountIndex');
    $.get('/get-user', {userIndex: userIndex}, (data)=>{
      let loginElement = `<a href="/user/${data.userAccount.username}" id="profile-link">Profile</a>`;
      let menu = $('.menu');
      
      menu.append(loginElement);
    })
    
  }
 
 
  


});

function changeBanner(){
  $('#files').click();
}
function ChangeIcon(){

}
function changeBio(){
  bio = $("#bio-input").val();
  console.log(bio);
}
function saveChanges(){
  let pathname = window.location.pathname;
  let paths = pathname.split('/');
  let userPage = paths[2];
  socket.emit('update-user-data', {username: userPage, bio: bio});
}

 function change() { 
  let pathname = window.location.pathname;
  let paths = pathname.split('/');
  let userPage = paths[2];
  let followers;
  let currentUserIndex = localStorage.getItem("clientAccountIndex");
  

      if($('#Follow-User').val() == "Unfollow")
      {
        
        $('#Follow-User').val("Follow");
        $.get('/get-current-users', {username: userPage}, (data)=>{
          console.log(data.accountIndex);
          socket.emit('remove-follower',{account:data.accountIndex, clientIndex: currentUserIndex});
          
          location.reload();
          
          

        })
        
       
      }
      else 
      {
        // code to add a follower
        if(currentUserIndex == null){
          window.location.href = '/login';
          return;
        }
        $('#Follow-User').val("Unfollow");
        $.get('/get-current-users', {username: userPage}, (data)=>{
          console.log(currentUserIndex);
          socket.emit('add-follower',{account:data.accountIndex, clientIndex: currentUserIndex});
          location.reload();
         

        })
        
        
       
        
       // i++;
       // $("#follow-count").html("Followers: "  + i)


      }
      
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

function populateFeed(){
  let feed = $('#feed');
  feed.empty();
  let postContainer;
  let sortArray = [];
  let userPageObj;
  let pathname = window.location.pathname;
  let paths = pathname.split('/');
  let userPage = paths[2];
  $.get('/get-current-users',{username: userPage}, (data) => {
      
      let allPost = data.account.posts;
      
      if (switchFunction == 2) {
          $.get('/get-sorted-posts', {
              allPosts: allPost
          }, (data) => {
              sortedPosts = data.sortedPosts;

              for (let i = 0; i < sortedPosts.length; i++) {
                  if (sortedPosts[i].inputType == 0) {
                      let image = '../'+sortedPosts[i].postData;
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
                          
                      }
                      else {
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

                              <div>
                                <p id="post-votes-${postIndex}" class="post-votes">Likes: ${postLikes}</p>  
                              </div>



                                <p id="user-id-${postIndex}" class="user-id">Post By: </p>  
                                <a href="/user/${postedBy.username}" class="user-link">${postedBy.username}</a>
                                
                              </div>
                              
                              
                            
                          </div>`


                      feed.prepend(postContainer)

                      //console.log(account.following);


                      //console.log("test");
                      let client = localStorage.getItem("clientAccountIndex");
                      if (client == null) {
                          
                      }
                      else {
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
              let image = '../'+allPost[i].postData;
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

                              <div>
                                <p id="post-votes-${postIndex}" class="post-votes">Likes: ${postLikes}</p>  
                              </div>

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
                  
              }
              else {
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

                              <div>
                                <p id="post-votes-${postIndex}" class="post-votes">Likes: ${postLikes}</p>  
                              </div>


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
                     
                      if (account.following[k] == postedBy.username) {
                          feed.prepend(postContainer);
                      }
                  }

              }
              //console.log("test");
              let client = localStorage.getItem("clientAccountIndex");
              if (client == null) {
                  
              }
              else {
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

function searchBar(){
  $.get('/get-all-users', {}, (data) => {
    let AllUsersArray = data.allAccountsArray;
    let dropdown = $(".dropdown");
    let dropdownReal = $("#dropdown-list");
    let num = 0;
    
    
    //if name is capitalized, solution; turn everything into lowercase
    //console.log(AllUsersArray)
    dropdownReal.empty();
    for (i = 0; i < AllUsersArray.length; i++) {
        
        
        let dropdownElement = `<li>
        <a href="${AllUsersArray[i]}"  class="dropdown-element" /a> <p>${AllUsersArray[i]}</p>
      </li>`;

        
        if (AllUsersArray[i].toLowerCase().startsWith($('#search').val().toLowerCase())) {
            dropdownReal.append(dropdownElement);
            num++;
        }

        if($('#search').val() == ""){
            dropdownReal.empty();
        }
      
        //console.log(num);
    }


})
}


function signOut() {
  localStorage.clear();
  window.location.href = '/login'
}


/**
 * 
 * function img() {
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
        let appendingData = `<img src="${lastImage}" alt="" height="200px" width="200px" id="preview-data">`
        $("#preview-data").remove();
        $("#image-div").append(appendingData);
       
        return;
      }
    }
  }
 */
