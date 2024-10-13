document.addEventListener("DOMContentLoaded", function () {
  const custForm = document.querySelector("#custForm");
  const comicForm = document.querySelector("#comicForm");
  const variantForm = document.querySelector("#variantForm");
  const custBtn = document.querySelector("#addCustBtn");
  const comicBtn = document.querySelector("#addComicBtn");
  const span = document.querySelectorAll(".close");
  const authorsContainer = document.querySelector("#authors-container");
  const artistsContainer = document.querySelector("#artists-container");
  const urlParams = new URLSearchParams(window.location.search);
  const message = urlParams.get("message");
  const messageType = urlParams.get("messageType");
  const editComicModal = document.querySelector("#editComicForm");
  const addNextSeriesModal = document.querySelector("#nextSeriesForm");
  const editComicBtn = document.querySelector("#editComicBtn");
  const addNextSeriesBtn = document.querySelector("#addNextSeriesBtn");
  const variantBtn = document.querySelector("#addVariantBtn"); 

  if (message) {
    alert(`${messageType.toUpperCase()}: ${decodeURIComponent(message)}`);
  }

  setTimeout(() => {
    const url = new URL(window.location);
    url.searchParams.delete("message");
    url.searchParams.delete("messageType");
    window.history.replaceState({}, document.title, url);
  }, 1000);

  // Show forms when buttons are clicked
  custBtn.onclick = function () {
    custForm.style.display = "block";
  };

  comicBtn.onclick = function () {
    comicForm.style.display = "block";
  };

  variantBtn.onclick = function () {
    variantForm.style.display = "block";
  };
  // Hide forms when close button or outside form is clicked
  span.forEach(function (closeBtn, index) {
    closeBtn.onclick = function () {
      if (index === 0) custForm.style.display = "none";
      if (index === 1) comicForm.style.display = "none";
      if (index === 2) variantForm.style.display = "none";
    };
  });

  // edit comic modal
  editComicBtn.onclick = function () {
    console.log("clicked");
    editComicModal.style.display = "block";
  };

  addNextSeriesBtn.onclick = function () {
    console.log("clicked");
    addNextSeriesModal.style.display = "block";
  };

  window.onclick = function (e) {
    if (e.target === custForm) custForm.style.display = "none";
    if (e.target === comicForm) comicForm.style.display = "none";
    if (e.target === editComicModal) editComicModal.style.display = "none";
    if (e.target === variantForm) variantForm.style.display = "none"
    if (e.target === addNextSeriesModal)
      addNextSeriesModal.style.display = "none";
  };

  // Add new author
  document.querySelector("#addAuthor").addEventListener("click", function () {
    const authorName = document.querySelector("#newAuthor").value.trim();
    if (authorName) {
      const newAuthorDiv = document.createElement("div");
      newAuthorDiv.classList.add("author-container");
      newAuthorDiv.innerHTML = `
  <input type="hidden" name="newAuthors[]" value="${authorName}" />
  <span>${authorName}</span>
  <button type="button" class="remove-author">Remove</button>
`;
      authorsContainer.appendChild(newAuthorDiv);
      document.querySelector("#newAuthor").value = "";
    }
  });

  // Add new artist
  document.querySelector("#addArtist").addEventListener("click", function () {
    const artistName = document.querySelector("#newArtist").value.trim();

    if (artistName) {
      const newArtistDiv = document.createElement("div");
      newArtistDiv.classList.add("artist-container");

      newArtistDiv.innerHTML = `
        <input type="hidden" name="newArtists[]" value="${artistName}" />
        <span>${artistName}</span>
        <button type="button" class="remove-artist">Remove</button>
      `;
      artistsContainer.appendChild(newArtistDiv);

      // Clear input field
      document.querySelector("#newArtist").value = "";
    }
  });

  // Remove author or artist
  authorsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-author")) {
      event.target.parentElement.remove();
    }
  });

  artistsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-artist")) {
      event.target.parentElement.remove();
    }
  });

  // variant form adding artist handled
  variantForm.querySelector("form").addEventListener("submit", function (e) {
    const artistSelect = document.querySelector("#artistSelect");
    const newArtistInput = document.querySelector("#newArtist").value.trim();

    if (!artistSelect.value && !newArtistInput) {
      e.preventDefault();
      alert("Please select an artist or add a new one.");
    }
  });


});
