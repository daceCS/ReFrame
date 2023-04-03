



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
    $.get('/get-current-users', {username: userPage}, (data)=>{
        userPageObj = data.account;
        userPageUsername = userPageObj.username;
        userPageFollowCount = userPageObj.following.length;
        userPagePostCount = userPageObj.postCount;
        userPageBio = userPageObj.bio;
        allPost = userPageObj.posts;
        userBannerImg = userPageObj.bannerImage;
        userProfileIcon = userPageObj.profileIcon;
        $('title').html(userPageUsername);
        let postIndex = 0;
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
              postIndex++;

             
    
            }
            else{
              let text = allPost[i].postData;
              let caption = allPost[i].caption;
              let postedBy = allPost[i].postedBy;
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
              postIndex++;
              
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