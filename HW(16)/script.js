import { fetchGet, fetchPost, fetchAuthorization, fetchDelete, fetchRegistration, fetchLikeComments } from "./toApi.js";
import { checkEnter, safeHtmlString } from "./secondFunc.js";
import { toRegistration, renderComment } from "./toRender.js"
import _ from "lodash";

const listElement = document.getElementById("list");
const loaderText = document.getElementById("loaderText");
const buttonWriteElement = document.getElementById("button__write");
const loaderCommentsElement = document.getElementById("loaderComments");
const textareaCommentElement = document.getElementById("textarea__comment");
const registrationElement = document.getElementById("registration");
const formElement = document.getElementById("form");

loaderCommentsElement.classList.remove("-display-none");


let redactClickCheck = false;
let checkButtonEnter = "enter";
let comments;
let token;
let myStorage = window.localStorage;

fetchGetAndRenderComment()
    .then(() => {
        checkLocalStorage();
    })

buttonWriteElement.addEventListener("click", newComment);
textareaCommentElement.addEventListener("keyup", checkEnter);
window.addEventListener("input", () => {
    if (textareaCommentElement.value === "") {
        buttonWriteElement.disabled = true;
    } else {
        buttonWriteElement.disabled = false;
    }
}, false);

function fetchGetAndRenderComment() {
    buttonWriteElement.disabled = true;
    return fetchGet()
        .then((json) => {
            comments = json.comments;
            loaderCommentsElement.classList.add("-display-none");
            toRegistration(checkButtonEnter, registrationElement);
            renderComment(listElement, comments, localStorage);
        })
        .catch((error) => {
            if (error.message === "Сервер упал") {
                if (textareaCommentElement.value === "") {
                    fetchGetAndRenderComment();
                } else {
                    newComment();
                }
                return;
            }
            alert("Нет связи с интернетом, попробуйте позже");
            return console.log(error);
        })
}

function checkLocalStorage() {
    if (myStorage.length > 0) {
        loaderText.textContent = "Выполняется вход"
        loaderCommentsElement.classList.remove("-display-none");
        fetchAuthorization(localStorage.getItem("login"), localStorage.getItem("password"))
            .then((response) => {
                token = `Bearer ${response.user.token}`;
                checkButtonEnter = "exit";
                toRegistration(checkButtonEnter, registrationElement);
                renderComment(listElement, comments, localStorage);
                formElement.classList.remove("-display-none");
                loaderCommentsElement.classList.add("-display-none");
                registrationElement.classList.remove("-display-none")
            })
    } else {
        const buttonHeartElements = document.querySelectorAll(".comments__button-heart");
        registrationElement.classList.remove("-display-none");
        for (const buttonHeartElement of buttonHeartElements) {
            buttonHeartElement.disabled = true;
        }
    }
}

function newComment() {
    textareaCommentElement.classList.remove("-background-error");
    if (textareaCommentElement.value === "") {
        textareaCommentElement.classList.add("-background-error");
        return;
    }

    formElement.classList.add("-display-none");
    loaderText.textContent = "Комментарий добавляется";
    loaderCommentsElement.classList.remove("-display-none");
    fetchPost(`${safeHtmlString(textareaCommentElement.value)}`, token)
        .then((response) => {
            if (response.status === 500) throw new Error("Сервер упал");
            if (response.status === 400) throw new Error("Некорректное значение");
            return fetchGetAndRenderComment();
        })
        .then(() => {
            textareaCommentElement.value = "";
            formElement.classList.remove("-display-none");
        })
        .catch((error) => {
            switch (error.message) {
                case "Сервер упал":
                    newComment();
                    break;
                case "Некорректное значение":
                    alert("Имя и комментарий должны быть не короче 3-х символов")
                    formElement.classList.remove("-display-none");
                    loaderCommentsElement.classList.add("-display-none");
                    break;
                default:
                    alert("Нет связи с интернетом, попробуйте позже");
                    formElement.classList.remove("-display-none");
                    loaderCommentsElement.classList.add("-display-none");
                    break;
            }
            return console.log(error);
        })
}

function clickCheck() {
    const buttonHeartElements = document.querySelectorAll(".comments__button-heart");
    const buttonRedactElements = document.querySelectorAll(".comments__button-redact");
    const buttonDeleteElements = document.querySelectorAll(".delete__button");
    const commentBodyElements = document.querySelectorAll(".comments__body");
    const textareaRedactElements = document.querySelectorAll(".-redactor-textarea");

    for (const buttonHeartElement of buttonHeartElements) {
        buttonHeartElement.addEventListener("click", () => {
            const index = buttonHeartElement.dataset.heart;        
            buttonHeartElement.classList.add("-loading-like");
            for (const buttonHeartElement of buttonHeartElements) {
                buttonHeartElement.disabled = true;
            }
            for (const buttonRedactElement of buttonRedactElements) {
                buttonRedactElement.disabled = true;
            }
            for (const buttonDeleteElement of buttonDeleteElements) {
                buttonDeleteElement.disabled = true;
            }
            fetchLikeComments(comments[index].id, token)
                .then(() => {
                    if (!localStorage.getItem(`isLiked${index}`)) {
                        localStorage.setItem(`isLiked${index}`, "true");
                    } else {
                        localStorage.removeItem(`isLiked${index}`);
                    }
                    return fetchGetAndRenderComment();
                })
                .then(() => {
                    for (const buttonHeartElement of buttonHeartElements) {
                        buttonHeartElement.disabled = false;
                    }
                    for (const buttonRedactElement of buttonRedactElements) {
                        buttonRedactElement.disabled = false;
                    }
                    for (const buttonDeleteElement of buttonDeleteElements) {
                        buttonDeleteElement.disabled = false;
                    }
                })
            return;
        });
    }

    for (const buttonRedactElement of buttonRedactElements) {
        buttonRedactElement.addEventListener("click", () => {
            const index = buttonRedactElement.dataset.redact;
            if (!redactClickCheck) {
                buttonRedactElements[index].textContent = "Сохранить";
                commentBodyElements[index].classList.add("-display-none");
                textareaRedactElements[index].classList.remove("-display-none");
                for (const buttonHeartElement of buttonHeartElements) {
                    buttonHeartElement.disabled = true;
                }
                for (const buttonDeleteElement of buttonDeleteElements) {
                    buttonDeleteElement.disabled = true;
                }
            } else {
                buttonRedactElements[index].textContent = "Редактировать";
                comments[index].text = safeHtmlString(document.querySelectorAll(".-redactor-textarea")[index].value);
                renderComment(listElement, comments, localStorage);
            }
            redactClickCheck = !redactClickCheck;
            return;
        });
    }

    for (const buttonDeleteElement of buttonDeleteElements) {
        if (!localStorage.getItem("login")) buttonDeleteElement.disabled = true;
        buttonDeleteElement.addEventListener("click", () => {
            const index = buttonDeleteElement.dataset.delete;
            for (const buttonHeartElement of buttonHeartElements) {
                buttonHeartElement.disabled = true;
            }
            for (const buttonRedactElement of buttonRedactElements) {
                buttonRedactElement.disabled = true;
            }
            for (const buttonDeleteElement of buttonDeleteElements) {
                buttonDeleteElement.disabled = true;
            }
            fetchDelete(comments[index].id, token)
                .then(() => {
                    return fetchGetAndRenderComment();
                })
        })
    }
}


function clickCheckRe() {
    const buttonEnterElement = document.getElementById("enterButton");
    const buttonRegistrationElement = document.getElementById("registrationButton");

    buttonEnterElement.addEventListener("click", () => {
        switch (checkButtonEnter) {
            case "enter":
                const loginEnterElement = document.getElementById("login");
                const passwordEnterElement = document.getElementById("password");

                if (loginEnterElement.value === "" || passwordEnterElement.value === "") {
                    alert("Имя или логин не могут быть пустыми")
                    return;
                }

                loaderText.textContent = "Выполняется вход"
                loaderCommentsElement.classList.remove("-display-none");
                registrationElement.classList.add("-display-none");

                fetchAuthorization(`${safeHtmlString(loginEnterElement.value)}`, `${safeHtmlString(passwordEnterElement.value)}`)
                    .then((response) => {
                        checkButtonEnter = "exit";
                        token = `Bearer ${response.user.token}`;
                        localStorage.setItem("login", loginEnterElement.value);
                        localStorage.setItem("password", passwordEnterElement.value);
                        loginEnterElement.value = "";
                        passwordEnterElement.value = "";
                        formElement.classList.remove("-display-none");
                        loaderCommentsElement.classList.add("-display-none");
                        registrationElement.classList.remove("-display-none");
                        toRegistration(checkButtonEnter, registrationElement);
                        renderComment(listElement, comments, localStorage);
                    })
                    .catch((error) => {
                        alert("Неверный логин или пароль");
                        loaderCommentsElement.classList.add("-display-none");
                        registrationElement.classList.remove("-display-none");
                        return console.log(error);
                    })
                break;
            case "registration":
                checkButtonEnter = "enter";
                toRegistration(checkButtonEnter, registrationElement);
                break;
            case "exit":
                checkButtonEnter = "enter";
                localStorage.clear();
                formElement.classList.add("-display-none");
                toRegistration(checkButtonEnter, registrationElement);
                renderComment(listElement, comments, localStorage);
                checkLocalStorage();
                break;
            default:
                break;
        }
    })

    buttonRegistrationElement.addEventListener("click", () => {
        switch (checkButtonEnter) {
            case "enter":
                checkButtonEnter = "registration";
                toRegistration(checkButtonEnter, registrationElement);
                break;
            case "registration":
                const loginEnterElement = document.getElementById("login");
                const nameElementElement = document.getElementById("name");
                const passwordEnterElement = document.getElementById("password");
                const passwordReEnterElement = document.getElementById("passwordRe");

                if (passwordEnterElement.value !== passwordReEnterElement.value) {
                    alert("Пароли не совпадают");
                    toRegistration(checkButtonEnter, registrationElement, loginEnterElement.value, nameElementElement.value);
                    passwordEnterElement.value = "";
                    passwordReEnterElement.value = "";
                    return;
                }

                if (loginEnterElement.value === "" || nameElementElement.value === "") {
                    alert("Имя или логин не могут быть пустыми")
                    return;
                }

                fetchRegistration(`${safeHtmlString(loginEnterElement.value)}`, `${safeHtmlString(nameElementElement.value)}`, `${safeHtmlString(passwordEnterElement.value)}`)
                    .then((response) => {
                        localStorage.setItem("login", loginEnterElement.value);
                        localStorage.setItem("password", passwordEnterElement.value);
                        checkButtonEnter = "exit";
                        token = `Bearer ${response.user.token}`;
                        loginEnterElement.value = "";
                        nameElementElement.value = "";
                        passwordEnterElement.value = "";
                        passwordReEnterElement.value = "";
                        formElement.classList.remove("-display-none");
                        toRegistration(checkButtonEnter, registrationElement);
                        renderComment(listElement, comments, localStorage);
                    })
                    .catch((error) => {
                        alert("Пользователь с таким логином уже существует")
                        return console.log(error);
                    })
                break;
            default:
                break;
        }
    });
}

export { clickCheckRe, newComment, clickCheck }