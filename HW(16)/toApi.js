function fetchGet() {
  return fetch("https://webdev-hw-api.vercel.app/api/v2/anastasia-kozharina/comments", {
      method: "GET",
  })
      .then((response) => {
          if (response.status === 500) throw new Error("Сервер упал");
          return response.json();
      })
}

function fetchAuthorization(login, password) {
  return fetch("https://webdev-hw-api.vercel.app/api/user/login", {
      method: "POST",
      body: JSON.stringify({
          login: login,
          password: password,
      }),
  })
      .then((response) => {
          if (response.status === 400) throw new Error("Неверный логин или пароль");
          if (response.status === 401) throw new Error("Запрос без авторизации");
          return response.json();
      })
}

function fetchRegistration(login, name, password) {
  return fetch("https://webdev-hw-api.vercel.app/api/user", {
      method: "POST",
      body: JSON.stringify({
          login: login,
          name: name,
          password: password,
      })
  })
  .then((response) => {
      if (response.status === 400) throw new Error("400")
      return response.json();
  })
}

function fetchPost(text, token) {
  return fetch("https://webdev-hw-api.vercel.app/api/v2/anastasia-kozharina/comments", {
      method: "POST",
      body: JSON.stringify({
          text: text,
      }),
      headers: {
          Authorization: token,
      },
  });
}

function fetchDelete(id, token) {
  return fetch("https://webdev-hw-api.vercel.app/api/v2/anastasia-kozharina/comments/" + id, {
      method: "DELETE",
      headers: {
          Authorization: token,
      },
  })
}

function fetchLikeComments(id, token) {
  return fetch("https://webdev-hw-api.vercel.app/api/v2/anastasia-kozharina/comments/" + id + "/toggle-like", {
      method: "POST",
      headers: {
          Authorization: token,
      },
  })
}

export { fetchGet, fetchPost, fetchAuthorization, fetchDelete, fetchRegistration, fetchLikeComments };