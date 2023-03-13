const addButtonElement = document.getElementById("add-button"); 
const removeComment = document.getElementById("remove-comment"); 
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

const delComment = () => {
  const elem = document.getElementById("comments").lastChild;
  elem.parentNode.removeChild(elem);
};

const delValue = () => {
  nameInputElement.value = "";
  commentInputElement.value = "";
};

const addLike =() => {
  const likeButtons = commentsElement.querySelectorAll('.like-button');
  for(let likeButtonElement of likeButtons) {

    likeButtonElement.addEventListener('click', () => {
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

const editText = ( ) => {
  const editButtons = commentsElement.querySelectorAll('.edit_comment');
  for(let editButton of  editButtons){

    editButton.addEventListener('click', () => {
          const index = editButton.dataset.index;
          if (comments[index].isEdit === false) {
            comments[index].isEdit = true;
          } 
          else if (comments[index].isEdit === true){
            comments[index].isEdit = false;
          }

          renderComments();
      })
  };
};

const renderComments = () => {
  const userHtml = comments.map((user, index) => {
    return `<li class="comment" >
    <div class="comment-header">
      <div>${user.name}</div>
      <div>${user.date}</div>
    </div>
    <div class="comment-body">
    ${user.isEdit ? `<textarea class ="aria-text">${user.comment}</textarea>` :`<div class ="comment-text"> ${user.comment} </div>`}
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
    buttonBlock();
    return;
  } 

  else {
    comments.push({
      name: nameInputElement.value,
      date: realDate,
      comment: commentInputElement.value,
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

removeComment.addEventListener("click", () => {
  delComment();
});

const buttonBlock = () => {
  document.querySelectorAll("#name-input,#comment-input").forEach((el) => {
    el.addEventListener("input", () => {
      if (document.getElementById("add-button").disabled = !document.getElementById("name-input").value || !document.getElementById("comment-input").value)
        document.getElementById("add-button").disabled = true;
      else
      document.getElementById("add-button").disabled = false;
    });
  });
};

addFormElement.addEventListener('keyup', (e) => {
  if (e.code === "Enter") {
    addButtonElement.click();
    delValue();
  }
});
