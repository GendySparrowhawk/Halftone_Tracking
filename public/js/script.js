document.addEventListener("DOMContentLoaded", function () {
  const custForm = document.querySelector("#custFrom");
  const comicForm = document.querySelector("#comicForm");
  const messageModal = document.querySelector("#messageModal");
  const closeModal = document.querySelector("#closeModal");
  const custBtn = document.querySelector("#addCustBtn");
  const comicBtn = document.querySelector("#addComicBtn");
  const span = document.querySelectorAll(".close");

  custBtn.onclick = function () {
    custForm.style.display = "block";
  };

  comicBtn.onclick = function () {
    comicForm.style.display = "block";
  };

  span.forEach(function (clsoeBtn, index) {
    clsoeBtn.onclick = function () {
      if (index === 0) custForm.style.display = "none";
      if (index === 1) comicForm.style.display = "none";
      if (index === 2 && messageModal) messageModal.style.display = "none";
    };
  });

  window.onclick = function (e) {
    if (e.target === custForm) custForm.style.display = "none";
    if (e.target === comicForm) comicForm.style.display = "none";
    if (e.target === messageModal) messageModal.style.display = "none";
  };

  // Handle AJAX submission for quick-add form (comic pulling)
  document.querySelectorAll(".quick-add-form").forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the form from submitting the traditional way

      const comicId = this.querySelector('input[name="comicId"]').value;
      const customerId = this.querySelector('select[name="customerId"]').value;

      fetch("/pull/quick-add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comicId: comicId,
          customerId: customerId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          showMessageModal(data.message, data.messageType);
        })
        .catch((err) => {
          console.error("Error:", err);
          showMessageModal(
            "An error occurred while processing your request.",
            "error"
          );
        });
    });
  });

  // Function to show message modal
  function showMessageModal(message, messageType) {
    const messageContent = document.querySelector(
      "#messageModal .message-content p"
    );

    // Set the message and message type
    messageContent.innerHTML = message;
    messageModal.style.display = "block"; // Show the modal
    messageModal.classList.add(messageType);
  }

  // Manually close message modal
  closeModal.onclick = function () {
    messageModal.style.display = "none";
  };
});
