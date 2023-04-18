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

 function secureInput(string) { 
  return string
    .replaceAll("&", "&amp;") 
    .replaceAll("<", "&lt;") 
    .replaceAll(">", "&gt;") 
    .replaceAll('"', "&quot;"); 
}


function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

function delValue() {
  nameInputElement.value = "";
  commentInputElement.value = "";
};


export { getDate, secureInput, delay, delValue };