document.addEventListener("DOMContentLoaded", () => {
  // Checks if the user has reduced motion turned on in their device/browser settings
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Selects all the parts of the page we want to animate/interact with
  const revealItems = document.querySelectorAll(".reveal");
  const cardButtons = document.querySelectorAll(".card-button");
  const cartCount = document.querySelector(".cart-count");
  const cards = document.querySelectorAll(".card");

  let basketTotal = 0;

  // Scroll reveal animation
  if (!prefersReducedMotion) {
    // IntersectionObserver watches elements and triggers when they appear in view
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Adds the visible class so the CSS animation runs
            entry.target.classList.add("is-visible");

            // Stops observing once it has already animated in
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    // If reduced motion is on, just show everything immediately
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Add-to-basket animation and counter update
  cardButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      basketTotal += 1;
      cartCount.textContent = basketTotal;

      // Removes animation classes first so they can be replayed every click
      cartCount.classList.remove("bump");
      button.classList.remove("added");

      // Forces the browser to reflow so the animation can restart properly
      void cartCount.offsetWidth;
      void button.offsetWidth;

      // Adds the classes back to trigger the CSS animations
      cartCount.classList.add("bump");
      button.classList.add("added");

      // Creates the ripple effect on the clicked button
      createRipple(event, button);

      // Removes the button animation class after it finishes
      setTimeout(() => {
        button.classList.remove("added");
      }, 450);
    });
  });

  // Small 3D tilt effect when the mouse moves over a card
  if (!prefersReducedMotion) {
    cards.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Works out mouse position and turns it into rotation values
        const rotateY = ((x / rect.width) - 0.5) * 10;
        const rotateX = ((y / rect.height) - 0.5) * -10;

        card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      // Resets the card when the mouse leaves it
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }
});

// Function for creating the ripple effect inside the button
function createRipple(event, button) {
  const ripple = document.createElement("span");
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.className = "ripple";
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  button.appendChild(ripple);

  // Removes the ripple after the animation ends so the HTML stays clean
  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
}