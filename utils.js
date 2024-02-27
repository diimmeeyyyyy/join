async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

/* ========================
TO FOCUS CLICKED MENU-POINT
===========================*/
/* let links = document.querySelectorAll('.task-sidebar a');

links.forEach((link) => {
  link.addEventListener('click', function() {
    links.forEach((link) => link.classList.remove('active')); //CSS-Klasse "activ" bei allen antfernen  
    this.classList.add('active'); // CSS-Klasse zum geklickten Element hinzufügen
  });
}); */

document.addEventListener("DOMContentLoaded", function () {
  let links = document.querySelectorAll(".task-sidebar a");

  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the link from being followed
      links.forEach((link) => link.classList.remove("active"));
      this.classList.add("active");
    });
  });
});
