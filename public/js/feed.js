const socket = io();
postIndex = 0;
socket.on('post-to-feed', ()=>{

  populateFeed();
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
          postContainer = `<div id="post-${postIndex}" class="post-container">
                                <div class="title">
                                  <h3 id="post-caption-${postIndex}" class="post-caption">${caption}</h3>
                                </div>
                                
                                <img src="${image}" id="post-image-${postIndex}" height="auto" width="90%"  class="post-image">
                                <div id="post-interact-${postIndex}" class="post-interact">
                                  <input type="button" value="like">
                                  <p id="user-id-${postIndex}" class="user-id">Post By: </p>  
                                  
                                </div>
                                
                                
                              
                            </div>`

          feed.prepend(postContainer)  
        }
        else{
          let text = allPost[i].postData;
          let caption = allPost[i].caption;
          postContainer = `<div id="post-${postIndex}" class="post-container">
                                <div class="title">
                                  <h3 id="post-caption-${postIndex}" class="post-caption">${caption}</h3>
                                </div>
                                <p id="text-post">${text}</p>
                                <div id="post-interact-${postIndex}" class="post-interact">
                                  <input type="button" value="like">
                                  <p id="user-id-${postIndex}" class="user-id">Post By: </p>  
                                  
                                </div>
                                
                                
                              
                            </div>`
        
          
          feed.prepend(postContainer)  
        }
      
          
      
      postIndex++;
    }
  })
}
function reDirectToCreatePost(){
  window.location.href = '/createPost';
}
$(document).ready(()=>{
  $.get('/new-dev-env', {},  (data)=>{
    if(data.dev == 0){
      localStorage.clear();
    }
  })
  let num = localStorage.getItem('clientAccountIndex');
  
  console.log(num)
  
  

  $.ajax({
    url: "/get-user",
    type: "GET",
    data: {
      userIndex: num

    },
    success: (data) => {
      console.log(data.userAccount)
    },
    dataType: "json"
  });

  
  populateFeed();
})

