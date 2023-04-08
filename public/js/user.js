

const socket = io();
let i;

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
  $.get('/get-user', {userIndex: clientUser}, (data)=>{
    let userFollowList = data.userAccount.following;
    for(i = 0; i<userFollowList.length; i++){
      if(userFollowList[i] == userPage){
        $('#Follow-User').val("Unfollow");
        
      }
    }
  })
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
      <img class="banner" src="${userBannerImg}">
      <img class="profileIcon" src="${userProfileIcon}">
      <p id="username">${userPageUsername}</p>
      <p id="follow-count">Followers: ${userPageFollowCount}</p>
      <p id="post-count">Posts: ${userPagePostCount}</p>

      <p id="bio">${userPageBio}</p>
  </div>`
      let body = $(document.body);
      body.append(userCard);
      let feed = $('#feed');
      for(i = 0; i<allPost.length; i++){
    
          if(allPost[i].inputType == 0){
            let image = allPost[i].postData;
            console.log(image)
            let caption = allPost[i].caption;
            let postedBy = allPost[i].postedBy;
            let postIndex = allPost[i].postId;
            postContainer = `<div id="post-${postIndex}" class="post-container">
                                  <div class="title">
                                    <h3 id="post-caption-${postIndex}" class="post-caption">${caption}</h3>
                                  </div>
                                  
                                  <img src="${'../'+image}" id="post-image-${postIndex}" height="auto" width="90%"  class="post-image">
                                  <div id="post-interact-${postIndex}" class="post-interact">
                                    <input type="button" value="like">
                                    <p id="user-id-${postIndex}" class="user-id">Post By: </p>  
                                    <a href="/user/${postedBy.username}" class="user-link">${postedBy.username}</a>
                                    
                                  </div>
                                  
                                  
                                
                              </div>`
            
           
            feed.prepend(postContainer) 
            

           
  
          }
          else{
            let text = allPost[i].postData;
            let caption = allPost[i].caption;
            let postedBy = allPost[i].postedBy;
            let postIndex = allPost[i].postId;
            postContainer = `<div id="post-${postIndex}" class="post-container">
                                  <div class="title">
                                    <h3 id="post-caption-${postIndex}" class="post-caption">${caption}</h3>
                                  </div>
                                  <p id="text-post">${text}</p>
                                  <div id="post-interact-${postIndex}" class="post-interact">
                                    <input type="button" value="like">
                                    <p id="user-id-${postIndex}" class="user-id">Post By: </p>  
                                    <a href="/user/${postedBy.username}" class="user-link">${postedBy.username}</a>
                                    
                                  </div>
                                  
                                  
                                
                              </div>`
                
            
            feed.prepend(postContainer) 
            
            
          }

          
          
      }
    
  });

  


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
