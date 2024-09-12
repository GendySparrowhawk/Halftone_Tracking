const custForm = document.querySelector("#custFrom");
const comicForm = document.querySelector("#comicFrom");
const custBtn = document.querySelector("#addCustBtn");
const comicBtn = document.querySelector("#addComicBtn");
const span = document.querySelector(".close");

custBtn.onclick = function () {
  custForm.style.display = "block";
};

comicBtn.onclick = function () {
  comicForm.style.display = "block";
};

span[0].onclick = function () {
  custForm.stye.display = "none";
};

span[1].onclick = function () {
  comicForm.style.display = "none";
};

window.onclick = function (e) {
  if (e.target === custForm) {
    custForm.style.display = "none";
  }
  if (e.target === comicForm) {
    comicForm.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector("#comic-search");
  const comicItems = document.querySelectorAll(".comic-item");

  searchInput.addEventListener("input", function (e) {
    const searchValue = e.target.value.toLowerCase();

    comicItems.forEach(function (item) {
      const title = item.getAttribute("data-title").toLocaleLowerCase();
      const series = item.getAttribute("data-series").toLocaleLowerCase();

      if(title.includes(searchValue) || series.includes(searchValue)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none'
      }
    });
  });
});
