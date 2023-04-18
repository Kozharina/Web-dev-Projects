function fetchGet() {
  return fetch("https://webdev-hw-api.vercel.app/api/v1/:kozharina-anastasia/comments", {
   method: "GET"
 })
      .then((response) => {
          if (response.status === 500) throw new Error("Сервер упал");
          return response.json();
      })
}

function fetchPost(text, name) {
  return fetch("https://webdev-hw-api.vercel.app/api/v1/:kozharina-anastasia/comments", {
      method: "POST",
      body: JSON.stringify({
          date: new Date,
          likes: 0,
          isLiked: false,
          text: name,
          name: text,
          forceError: true
      }),
  })
}

export { fetchGet, fetchPost };