const addButtonElement = document.getElementById("add-button"); 
const deleteComment = document.getElementById("remove-comment"); 
const commentsElement = document.getElementById("comments"); 
const nameInputElement = document.getElementById("name-input"); 
const commentInputElement = document.getElementById("comment-input");  
const addFormElement = document.querySelector(".add-form"); 
const likeButtonElement = document.querySelectorAll(".like-button");

const optionsData = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  timezone: 'UTC',
  hour: '2-digit',
  minute: '2-digit',
};

let now = new Date().toLocaleString("ru-RU",optionsData).replace(",", "");
let realDate = new Date().toLocaleString("ru-RU", optionsData).replace(",", "");

const comments = [
  {
    name: "Глеб Фокин",
    date: "12.02.22 12:18",
    comment: "Это будет первый комментарий на этой странице",
    likesCount: 75,
    isLiked: false,
    isEdit: false,
  },

  {
    name: "Варвара Н.",
    date: "13.02.22 19:22",
    comment: " Мне нравится как оформлена эта страница! ❤",
    likesCount: 12,
    isLiked: true,
    isEdit: false,

  },
];

// Удаление коммментария  
const delComment = () => {
  const elem = document.getElementById("comments").lastChild;
  elem.parentNode.removeChild(elem);
};

const delValue = () => {
  nameInputElement.value = "";
  commentInputElement.value = "";
};

// Добавить лайки
const addLike = () => {
  const likeButtons = commentsElement.querySelectorAll('.like-button');
  for(let likeButtonElement of likeButtons) {

    likeButtonElement.addEventListener('click', (event) => {
        // stopPropagation() отключает всплытие события вверх по дереву (то есть отлючим добавления цитаты при нажатии на лайк)
        event.stopPropagation();
          const index = likeButtonElement.dataset.index;
          if (!comments[index].isLiked)  {
      
            comments[index].isLiked = true;
            comments[index].likesCount += 1;
          } 
          else if (comments[index].isLiked === true) {
            comments[index].isLiked = false;
            comments[index].likesCount -= 1;
          }
          renderComments();
      })
  };
};

const commentsList = document.querySelector('ul.comments'); 

const editText = (ev) => {
  const editButtons = commentsElement.querySelectorAll('.edit_comment');
  for(let editButton of  editButtons){

    editButton.addEventListener('click', (event) => {
          const index = editButton.dataset.index;
          if (comments[index].isEdit === false) {
            comments[index].isEdit = true;
          } 
          else {
            let currentTextarea = document.querySelectorAll('.comment') [index].querySelector('textarea');
            comments[index].isEdit = false;
            comments[index].comment = safeInputText(currentTextarea.value);
          }

          renderComments();
      })
  };
};

// Коммент с отсылкой (цитата)
const addComment = () => {
  
  const allComments = document.querySelectorAll('.comment')
  for(let comment of allComments) {
   comment.addEventListener('click', (event)=>{
     event.stopPropagation();
     const nameUser = comment.dataset.name;
     const userComments = comment.dataset.comment;
     commentInputElement.value = nameUser + ':' + '\n' +
    '>' + userComments
   })
  
  }
 }

const renderComments = () => {
  const userHtml = comments.map((user, index) => {
    return `<li class="comment" data-name="${user.name}" data-comment="${user.comment}">
    <div class="comment-header">
      <div>${user.name}</div>
      <div>${user.date}</div>
    </div>
    <div class="comment-body">
    ${user.isEdit ? `<textarea class ="aria-text"
    onclick="event.stopPropagation()">${user.comment}
    </textarea>` :`<div class ="comment-text"> ${user.comment} </div>`}
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span class="likes-counter">${user.likesCount}</span>
        <button data-index="${index}"  class="${user.isLiked ? 'like-button -active-like' : 'like-button'}"></button>
        <button data-index="${index}" class= "edit_comment">Редатировать</button>
      </div>
    </div>
  </li>`
  }).join('');

  commentsElement.innerHTML = userHtml;

  delValue();
  addLike();
  editText();
  addComment();

};

renderComments();

addButtonElement.addEventListener("click", () => {

  if (nameInputElement.value === "" || commentInputElement.value === "") {
    nameInputElement.classList.add("error");
    commentInputElement.classList.add("error");
    nameInputElement.placeholder = 'Введите имя';
    commentInputElement.placeholder = 'Введите комментарий';
    nameInputElement.value = '';
    commentInputElement.value = '';
    return;
  } 

  else {
    comments.push({
      name: nameInputElement.value
      .replaceAll("<", "&lt;")  // Безопастность ввода данных
      .replaceAll(">", "&gt;")
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;"),
      date: realDate,
      comment: commentInputElement.value
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;"),
      likesCount: 0,
      isLiked: false,
      isEdit: false,
    });

    nameInputElement.classList.remove("error");
    commentInputElement.classList.remove("error");
    const oldListHtml = commentsElement.innerHTML;
  }; 

  renderComments();
});

deleteComment.addEventListener("click", () => {
  delComment();
});

addFormElement.addEventListener('keyup', (e) => {
  if (e.code === 'Enter') {
    addButtonElement.click();
    delValue();
  }
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

