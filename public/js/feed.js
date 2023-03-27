const socket = io();
postIndex = 0;
socket.on('post-to-feed', (caption, postData, inputType)=>{
  if(inputType == 0){
    let feed = $('#feed');
    let postContainer = `<div id="post-${postIndex}" class="post-container">
                              <div class="title">
                              <h3 id="post-caption-${postIndex}" class="post-caption">${caption}</h3>
                            </div>
                            <img src="${postData}" id="post-image-${postIndex}" height="auto" width="90%" class="post-image">
                            <div id="post-interact-${postIndex}" class="post-interact">
                            <input type="button" value="like">
                            <p id="user-id-${postIndex}">Post By: </p>
                          </div>
                          
                        </div>`
     

      feed.prepend(postContainer);
  }
  else if(inputType == 1){
    let postContainer = `<div id="post-${postIndex}" class="post-container">
                          <div class="title">
                            <h3 id="post-caption-${postIndex}" class="post-caption">${caption}</h3>
                          </div>
                          <p id="text-post">${postData}</p>
                          <div id="post-interact-${postIndex}" class="post-interact">
                            <input type="button" value="like">
                            <p id="user-id-${postIndex}" class="user-id">Post By: </p>  
                            
                          </div>
                          
                          
                        
                      </div>`
  
    
    feed.prepend(postContainer)  
  }
    
     
  postIndex++;
})
function populateFeed(){
  let feed = $('#feed');
  $.get('/populate-feed', (data)  =>{
    let allPost = data.allPost;
    for(i = 0; i<allPost.length; i++){
      
        if(allPost[i].inputType == 0){
          let image = allPost[i].postData;
          let caption = allPost[i].caption;
          let postContainer2 = `<div id="post-${postIndex}" class="post-container">
                                <div class="title">
                                  <h3 id="post-caption-${postIndex}" class="post-caption">${caption}</h3>
                                </div>
                                
                                <img src="${image}" id="post-image-${postIndex}" height="auto" width="90%"  class="post-image">
                                <div id="post-interact-${postIndex}" class="post-interact">
                                  <input type="button" value="like">
                                  <p id="user-id-${postIndex}" class="user-id">Post By: </p>  
                                  
                                </div>
                                
                                
                              
                            </div>`
        
          
          feed.prepend(postContainer2)  
        }
        else{
          let text = allPost[i].postData;
          let caption = allPost[i].caption;
          let postContainer2 = `<div id="post-${postIndex}" class="post-container">
                                <div class="title">
                                  <h3 id="post-caption-${postIndex}" class="post-caption">${caption}</h3>
                                </div>
                                <p id="text-post">${text}</p>
                                <div id="post-interact-${postIndex}" class="post-interact">
                                  <input type="button" value="like">
                                  <p id="user-id-${postIndex}" class="user-id">Post By: </p>  
                                  
                                </div>
                                
                                
                              
                            </div>`
        
          
          feed.prepend(postContainer2)  
        }
      
          
      
      postIndex++;
    }
  })
}
function reDirectToCreatePost(){
  window.location.href = '/createPost';
}
$(document).ready(()=>{
  
  populateFeed();
})