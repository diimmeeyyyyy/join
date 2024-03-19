
/**
 * This function initializes the index page
 */
function initIndex() {
  let indexPage = document.getElementById("Index_Page");

  if (window.innerWidth <= 850) {
    indexPage.innerHTML = /*html*/ `
       <img src="./assets/img/join-mobile.png" />
    `;
    indexPage.style.backgroundColor = "rgb(43,54,71)";
  } else {
    indexPage.innerHTML = /*html*/ `
      <img src="./assets/img/join.png">
    `;
    indexPage.style.backgroundColor = "white";
  }
  //As soon as animation is over:
  indexPage.querySelector("img").addEventListener("animationend", function () {
    window.location.href = "log_In.html";
  });
}
