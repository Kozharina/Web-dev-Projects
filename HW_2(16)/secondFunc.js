import { newComment } from "./script.js"

function correctDate(str) {
  const options = { 
    year: '2-digit', 
    month: 'numeric', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
} 
const realDate = new Date(str); 
return realDate.toLocaleString('ru-RU', options).replace(',', ''); 
}

function checkEnter(key) {
    if (key.code === "Enter" || key.code === "NumpadEnter") newComment();
    return;
}

function safeHtmlString(str) {
    str = str
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
    return str;
}

export { correctDate, checkEnter, safeHtmlString, };