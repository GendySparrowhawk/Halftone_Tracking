document.addEventListener("DOMContentLoaded", function () {
  const custForm = document.querySelector("#custForm");
  const comicForm = document.querySelector("#comicForm");
  const custBtn = document.querySelector("#addCustBtn");
  const comicBtn = document.querySelector("#addComicBtn");
  const span = document.querySelectorAll(".close");
  const authorsContainer = document.querySelector("#authors-container");
  const artistsContainer = document.querySelector("#artists-container");

  // Show forms when buttons are clicked
  custBtn.onclick = function () {
    custForm.style.display = "block";
  };

  comicBtn.onclick = function () {
    comicForm.style.display = "block";
  };

  // Hide forms when close button or outside form is clicked
  span.forEach(function (closeBtn, index) {
    closeBtn.onclick = function () {
      if (index === 0) custForm.style.display = "none";
      if (index === 1) comicForm.style.display = "none";
    };
  });

  window.onclick = function (e) {
    if (e.target === custForm) custForm.style.display = "none";
    if (e.target === comicForm) comicForm.style.display = "none";
  };

  // Add new author
  document.querySelector("#addAuthor").addEventListener("click", function () {
    const firstName = document.querySelector("#newAuthorFirstName").value;
    const lastName = document.querySelector("#newAuthorLastName").value;

    if (firstName && lastName) {
      const newAuthorDiv = document.createElement("div");
      newAuthorDiv.classList.add("author-container");

      newAuthorDiv.innerHTML = `
        <input type="hidden" name="newAuthors" value="${firstName}, ${lastName}" />
        <span>${firstName} ${lastName}</span>
        <button type="button" class="remove-author">Remove</button>
      `;
      authorsContainer.appendChild(newAuthorDiv);

      // Clear input fields
      document.querySelector("#newAuthorFirstName").value = '';
      document.querySelector("#newAuthorLastName").value = '';
    }
  });

  // Add new artist
  document.querySelector("#addArtist").addEventListener("click", function () {
    const firstName = document.querySelector("#newArtistFirstName").value;
    const lastName = document.querySelector("#newArtistLastName").value;

    if (firstName && lastName) {
      const newArtistDiv = document.createElement("div");
      newArtistDiv.classList.add("artist-container");

      newArtistDiv.innerHTML = `
        <input type="hidden" name="newArtists" value="${firstName}, ${lastName}" />
        <span>${firstName} ${lastName}</span>
        <button type="button" class="remove-artist">Remove</button>
      `;
      artistsContainer.appendChild(newArtistDiv);

      // Clear input fields
      document.querySelector("#newArtistFirstName").value = '';
      document.querySelector("#newArtistLastName").value = '';
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
});