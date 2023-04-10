function buttonBlock() {
  document.querySelectorAll("#name-input,#comment-input").forEach((el) => {
    el.addEventListener("input", () => {
      if (document.getElementById("name-input").value === '' || document.getElementById("comment-input").value === '')
        document.getElementById("add-button").disabled = true;
      else
        document.getElementById("add-button").disabled = false;
    });
  });
}

 function buttonEnter(){
  addFormElement.addEventListener('keyup', (event) => {

    if (event.code === "Enter"  ) {
      addButtonElement.click();
    }
  });  
}

  export { buttonBlock, buttonEnter };