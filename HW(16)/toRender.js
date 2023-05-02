import { clickCheckRe, clickCheck } from "./script.js";
import { correctDate } from "./secondFunc.js";

function toRegistration(checkButtonEnter, registrationElement, login, name) {
    switch (checkButtonEnter) {
        case "enter":
            registrationElement.innerHTML = `
            <input id="login" type="text" class="registration__input" placeholder="Введите login"><br>
            <input id="password" class="registration__input" type="password" placeholder="Введите password"><br>
            <button id="enterButton" class="registration__button">Войти</button><br>
            <button id="registrationButton" class="registration__button">Зарегистрироваться</button>
            `
            break;
        case "registration":
            registrationElement.innerHTML = `
            <input id="name" type="text" class="registration__input" placeholder="Введите Имя"><br>
            <input id="login" type="text" class="registration__input" placeholder="Введите login"><br>
            <input id="password" class="registration__input" type="password" placeholder="Введите password"><br>
            <input id="passwordRe" class="registration__input" type="password" placeholder="Введите password повторно"><br>
            <button id="registrationButton" class="registration__button">Зарегистрироваться</button><br>
            <button id="enterButton" class="registration__button">Войти</button>
            `
            const loginEnterElement = document.getElementById("login");
            const nameElementElement = document.getElementById("name");
            if (login) loginEnterElement.value = login;
            if (name) nameElementElement.value = name;
            break;
        case "exit":
            registrationElement.innerHTML = `
            <button id="registrationButton" class="registration__button -display-none">Зарегистрироваться</button><br>
            <button id="enterButton" class="registration__button">Выйти</button>
            `
            break;
        default:
            break;
    }
    
    clickCheckRe();
}

function renderComment(listElement, comments, localStorage) {
    listElement.innerHTML = comments.map((comment, index) => `
            <li class="comments__list">
                <div class="comments__header">
                    <p>${comment.author.name}</p>
                    <p>${correctDate(comment.date)}</p>
                </div>
                <div data-comments="${index}" class="comments__body">
                    <p>${comment.text}</p>
                </div>
                <textarea data-textarea="${index}" type="textarea" class="-redactor-textarea -display-none">${comment.text}</textarea>
                <div class="comments__footer">
                    <button data-redact="${index}" class="comments__button-redact">Редактировать</button>
                    <button data-delete="${index}" id="button__delete" class="delete__button">Удалить</button>
                    <div>
                        <span>${comment.likes}</span>
                        <button data-heart="${index}" class="comments__button-heart ${!localStorage.getItem(`isLiked${index}`) ? '' : '-active-like'}"></button>
                    </div>
                </div>
            </li>`
    ).join("");

    clickCheck();
}

export { toRegistration, renderComment }