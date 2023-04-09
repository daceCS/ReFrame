
const socket = io();

let account;

$('#search').on('input', function() {
  $.get('/get-all-users',{}, (data) => {
  let AllUsersArray = data.allAccountsArray;
  //if name is capitalized, solution; turn everything into lowercase
  for(i = 0; i<AllUsersArray.length; i++){

  let realHolder = AllUsersArray[i].substring(0,$('#search').val().length);
  realHolder = realHolder.toLowerCase();
    if(realHolder == $('#search').val().toLowerCase()){
      console.log("this is the holder " + realHolder); 
    }
  }


  })
});



let switchFunction = 0;
socket.on('post-to-feed', ()=>{
  populateFeed()
})
function populateFeed(){
  let feed = $('#feed');
  feed.empty();
  let postContainer;
  $.get('/populate-feed', (data)  =>{
    let allPost = data.allPost;
    for(i = 0; i<allPost.length; i++){
      
        if(allPost[i].inputType == 0){
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
          
         
          if(switchFunction == 0){
            feed.prepend(postContainer) 
          }
          else if(switchFunction == 1){
            feed.append(postContainer) 
          }
          else if(switchFunction == 2){
          }
          else{
            //console.log(account.following);
            
            for(k = 0; k<account.following.length; k++){
              console.log(account.following[k]);
              console.log(postedBy.username)
              if(account.following[k] == postedBy.username){
                feed.prepend(postContainer);
              }
            }
            
          }
          let client = localStorage.getItem("clientAccountIndex");
          if(client == null){
            return;
          }
          let likeButton = $('#like-button-' + postIndex);

          $.get('/get-user', {userIndex: client}, (data)=>{
            let clientLikedPost = data.userAccount.likedPost;
            

            for(i = 0; i<clientLikedPost.length; i++){
              //console.log(clientLikedPost[i])
              //console.log(postIndex);
              if(clientLikedPost[i] == postIndex){
                likeButton.val("Unlike");
                //console.log("reached")
              }
            }
          })  
        

        }
        else{
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
              
                            if(switchFunction == 0){
                              feed.prepend(postContainer) 
                            }
                            else if(switchFunction == 1){
                              feed.append(postContainer) 
                            }
                            else if(switchFunction == 2){
                            }
                            else{
                              
                            }
          //console.log("test");
          let client = localStorage.getItem("clientAccountIndex");
          if(client == null){
            return;
          }
          let likeButton = $('#like-button-' + postIndex);

          $.get('/get-user', {userIndex: client}, (data)=>{
            let clientLikedPost = data.userAccount.likedPost;
            //console.log(clientLikedPost)
            //console.log(postIndex);

            for(i = 0; i<clientLikedPost.length; i++){
              if(clientLikedPost[i] == postIndex){
                likeButton.val("Unlike");
                //console.log("reached")
              }
            }
          })
          
          
          
          
        }
      
          
      
      
    }
  })
}
function sortNew(){
  switchFunction=0;
  populateFeed();
}
function sortOld(){
  switchFunction=1;
  populateFeed();
}
function sortLiked(){
  switchFunction = 2; 
  populateFeed();
}
function sortFollowing(){
  switchFunction = 3; 
  populateFeed();
}
function reDirectToCreatePost(){
  window.location.href = '/createPost';
}
function signOut(){
  localStorage.clear();
}
function likePost(postIdRoot){
  let client = localStorage.getItem("clientAccountIndex");
  if(client == null){
    window.location.href = '/login';
    return;
  }
  let postId = postIdRoot.id.split('-')[2];
  let button = $("#like-button-" + postId);
  let element = $("#post-votes-" + postId);
  //console.log(postId)
  
  if(button.val() == 'Like'){
    button.val("Unlike");
    socket.emit('like-post', {clientIndex:  client, postId: postId})
    let test = element.html().split(" ");
    let number = parseInt(test[1])
    number++;

    element.html("Likes: " + number)
    
    
  }
  else if(button.val() == "Unlike"){
    button.val("Like");
    socket.emit('unlike-post', {clientIndex:  client, postId: postId})

    let test = element.html().split(" ");
    let number = parseInt(test[1])
    number--;

    element.html("Likes: " + number)
    
    // create some update to indexg2.js with sockets
  }
}
$(document).ready(()=>{
  
  
  let num = localStorage.getItem('clientAccountIndex');
  
  if(num == null){
    let loginElement = `<a href="/login" id="profile-link">Profile</a>`;
    let menu = $('.menu');
    menu.append(loginElement);
  }

  
  
  if(num != null){
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

