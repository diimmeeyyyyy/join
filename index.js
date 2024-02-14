/* ============================================= 
AFTER INDEX-ANIMATION REDIRECTING TO LOG-IN.HTML
================================================*/
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".index-page img")
    .addEventListener("animationend", function () {
      window.location.href = "log_In.html";
    });
});
