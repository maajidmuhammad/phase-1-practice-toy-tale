document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Function to fetch and display toys
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => {
          const card = createToyCard(toy);
          toyCollection.appendChild(card);
        });
      });
  }

  // Function to create a toy card
  function createToyCard(toy) {
    const card = document.createElement("div");
    card.classList.add("card");

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.classList.add("toy-avatar");

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;

    const likeButton = document.createElement("button");
    likeButton.textContent = "Like ❤️";
    likeButton.classList.add("like-btn");
    likeButton.setAttribute("data-id", toy.id);

    // Event listener for like button
    likeButton.addEventListener("click", () => {
      increaseLikes(toy.id);
    });

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(likeButton);

    return card;
  }

  // Function to handle increasing likes
  function increaseLikes(toyId) {
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: parseInt(document.querySelector(`.like-btn[data-id="${toyId}"]`).previousElementSibling.textContent) + 1
      })
    })
    .then(response => response.json())
    .then(updatedToy => {
      const likeElement = document.querySelector(`.like-btn[data-id="${toyId}"]`).previousElementSibling;
      likeElement.textContent = `${updatedToy.likes} Likes`;
    });
  }

  // Event listener for toy form submission
  toyForm.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get("name");
    const image = formData.get("image");

    // Send POST request to add new toy
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name,
        image,
        likes: 0
      })
    })
    .then(response => response.json())
    .then(newToy => {
      const card = createToyCard(newToy);
      toyCollection.appendChild(card);
      // Clear form inputs
      toyForm.reset();
    });
  });

  // Initial fetch and display of toys
  fetchToys();
});
