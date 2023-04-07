const addButtonElement = document.getElementById("add-button"); 
const deleteComment = document.getElementById("remove-comment"); 
const commentsElement = document.getElementById("comments"); 
const nameInputElement = document.getElementById("name-input"); 
const commentInputElement = document.getElementById("comment-input");  
const addFormElement = document.querySelector(".add-form"); 
const likeButtonElement = document.querySelectorAll(".like-button");
const textarea = document.querySelectorAll('.add-form-text')
const waitLoadComments = document.getElementById("loaderComments");
const pushComments = document.getElementById("PushCommentsText");
pushComments.style.display = "none"
waitLoadComments.style.display = "flex";

function getDate(date) { 
  const options = { 
      year: '2-digit', 
      month: 'numeric', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
  } 
  const realDate = new Date(date); 
  return realDate.toLocaleString('ru-RU', options).replace(',', ''); 
}

let comments = [];

// Получить список комментариев по API
const fetchAndRenderTasks = () =>{
  return fetch("https://webdev-hw-api.vercel.app/api/v1/:kozharina-anastasia/comments", {
   method: "GET"
 })
   .then((response) => {
    return response.json()
   })
   .then((responseData) => {
     comments = responseData.comments;
     waitLoadComments.style.display = "none";
     renderComments();
   })
   .catch((error) => {
    if (error.message === "Сервер не отвечает, попробуйте позже") {
      alert('Сервер упал')
      return;     
    }
})
  
 }
 fetchAndRenderTasks()

// Удаление коммментария  
function delComment() {
  comments.pop() 
  renderComments();
}

// Очищаем поле
function delValue() {
  nameInputElement.value = "";
  commentInputElement.value = "";
};

function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

// Добавить лайки
function addLike () {
  const likeButtons = commentsElement.querySelectorAll('.like-button');
  for(let likeButton of likeButtons){
    likeButton.addEventListener('click', ( event) => {
      event.stopPropagation()
          const index = likeButton.dataset.index;
          likeButton.classList.add('-loading-like')
          delay(2000).then(()=> {
           
            if (comments[index].isLiked === false) {
              comments[index].isLiked = true;
              comments[index].likes +=1;
            } else {
              comments[index].isLiked = false;
              comments[index].likes -=1;
            }
            renderComments();
          })
      })
  }
}
// Коммент с отсылкой (цитата)
function addComment() {
  
  const allComments = document.querySelectorAll('.comment')
  for(let comment of allComments) {
   comment.addEventListener('click', (event)=>{
     event.stopPropagation()
     const nameUser = comment.dataset.name;
     const userComments = comment.dataset.comment;
     commentInputElement.value = nameUser + ':' + '\n' +
    '>' + userComments
   })
  
  }
 }

 // Безопастность ввода данных 
function secureInput(string) { 
  return string
    .replaceAll("&", "&amp;") 
    .replaceAll("<", "&lt;") 
    .replaceAll(">", "&gt;") 
    .replaceAll('"', "&quot;"); 
}

 function renderComments() { 
   
  const userHtml = comments.map((user, index) => { 
    return `<li class="comment"  data-name="${user.author.name}" data-comment="${user.text}"> 
    <div class="comment-header"> 
      <div>${user.author.name}</div> 
      <div>${getDate(user.date)}</div> 
    </div> 
    <div class="comment-body" > 
   <div class ="comment-text">
   ${user.text} </div> 
    </div> 
    <div class="comment-footer"> 
      <div class="likes"> 
        <span class="likes-counter">${user.likes}</span> 
        <button data-index="${index}"  class="${user.isLiked ? 'like-button -active-like' : 'like-button'}"></button> 
     
      </div> 
    </div> 
  </li>` 
  }).join('') 
 
  commentsElement.innerHTML = userHtml; 
  addLike();
  addComment(); 
  
} 
  addButtonElement.addEventListener("click", () => {

  if (nameInputElement.value === "" || commentInputElement.value === "") {
    nameInputElement.classList.add("error"); 
    commentInputElement.classList.add("error"); 
    nameInputElement.placeholder = 'Введите имя'; 
    commentInputElement.placeholder = 'Введите комментарий'; 
    buttonBlock() 
    return;
  } 

  function pushComment(){
  fetch('https://webdev-hw-api.vercel.app/api/v1/:kozharina-anastasia/comments', {
    method: "POST",
    body: JSON.stringify({
        date: new Date,
        likes: 0,
        isLiked: false,
        text: secureInput(commentInputElement.value),
        name: secureInput(nameInputElement.value),
        forceError: true
      }),
      })
      .then((response) => {
        if (response.status === 400){
          throw new Error("Слишком короткая строчка");
      }
      if (response.status === 500) {
        pushComment();
        throw new Error("Сервер не отвечает, попробуйте позже")
      }
      addFormElement.style.display = "none";
      pushComments.style.display = "flex"
      return fetchAndRenderTasks()

  })

  .then(()=>{     
    addFormElement.style.display = "flex";
    pushComments.style.display = "none"
    delValue(); 
  })

  .catch((error) => {
    if (error.message === "Сервер не отвечает, попробуйте позже") {
      console.warn("Сервер не работает, попробуйте позже")
      addFormElement.style.display = "flex";
      pushComments.style.display = "none"
        return;
    }
    if (error.message === "Слишком короткая строчка") {
        alert("Имя и комментарий должны быть не короче 3 символов")
        addFormElement.style.display = "flex";
        pushComments.style.display = "none"
        return;
    }
    addFormElement.style.display = "flex";
    pushComments.style.display = "none"
    alert("Сервер не отвечает, попробуйте позже");
    return;
})

}

pushComment()
nameInputElement.classList.remove("error");
commentInputElement.classList.remove("error");
renderComments();

}); 
deleteComment.addEventListener("click", () => {
  delComment()
});

nameInputElement.addEventListener('input', (e) => {
  addButtonElement.disabled = true;
  if (e.target.value.length > 0 && commentInputElement.value.length > 0) {
    addButtonElement.disabled = false;
  }
});
commentInputElement.addEventListener('input', (e) => {
  addButtonElement.disabled = true;
  if (e.target.value.length > 0 && nameInputElement.value.length > 0) {
    addButtonElement.disabled = false;
  }
});

addFormElement.addEventListener('keyup', (e) => {
  if (e.code === 'Enter') {
    addButtonElement.click();
    delValue();
  }
});