// Selecting important elements from the page
const revealElements = document.querySelectorAll(".reveal");
const statNumbers = document.querySelectorAll(".stat-number");
const filterButtons = document.querySelectorAll(".filter-btn");
const tiles = document.querySelectorAll(".tile");
const zoomableImages = document.querySelectorAll(".zoomable");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const surpriseBtn = document.getElementById("surpriseBtn");
const openFeatureBtn = document.getElementById("openFeatureBtn");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const navLinks = document.querySelectorAll(".nav a");
const sections = document.querySelectorAll("main section[id]");
const featureImage = document.querySelector(".feature img");

// Makes elements appear when the user scrolls down
function revealOnScroll() {
  revealElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      element.classList.add("visible");
    }
  });
}

// Animates the numbers in the stats section when they come into view
const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const stat = entry.target;
    const target = Number(stat.dataset.target);
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 30));

    const updateCounter = () => {
      current += increment;
      if (current >= target) {
        stat.textContent = target;
      } else {
        stat.textContent = current;
        requestAnimationFrame(updateCounter);
      }
    };

    updateCounter();
    observer.unobserve(stat);
  });
}, { threshold: 0.6 });

statNumbers.forEach((stat) => statsObserver.observe(stat));

// Filters gallery items depending on which button is clicked
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    tiles.forEach((tile) => {
      const type = tile.dataset.type;

      if (filter === "all" || filter === type) {
        tile.classList.remove("is-hidden");
      } else {
        tile.classList.add("is-hidden");
      }
    });
  });
});

// Opens the lightbox with the selected image
function openLightbox(src, caption) {
  lightboxImage.src = src;
  lightboxCaption.textContent = caption || "";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

// Closes the lightbox
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Lets gallery images open in the lightbox when clicked
zoomableImages.forEach((image) => {
  image.addEventListener("click", () => {
    openLightbox(image.src, image.alt);
  });
});

// Opens the featured image when the button is clicked
openFeatureBtn.addEventListener("click", () => {
  openLightbox(featureImage.src, featureImage.alt);
});

lightboxClose.addEventListener("click", closeLightbox);

// Closes the lightbox if the dark background is clicked
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Closes the lightbox when Escape key is pressed
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

// Opens a random visible image when Surprise Me is clicked
surpriseBtn.addEventListener("click", () => {
  const imageTiles = Array.from(document.querySelectorAll('.tile[data-type="image"]'));
  const visibleImageTiles = imageTiles.filter((tile) => !tile.classList.contains("is-hidden"));
  const sourcePool = visibleImageTiles.length ? visibleImageTiles : imageTiles;
  const randomTile = sourcePool[Math.floor(Math.random() * sourcePool.length)];
  const randomImage = randomTile.querySelector("img");

  openLightbox(randomImage.src, randomImage.alt);
});

window.addEventListener("scroll", () => {
  revealOnScroll();

  // Shows the scroll-to-top button after scrolling down
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }

  // Highlights the nav link for the section currently on screen
  let currentSection = "";

  sections.forEach((section) => {
    const top = section.offsetTop - 140;
    const height = section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < top + height) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href").replace("#", "");
    if (href === currentSection) {
      link.classList.add("active");
    }
  });
});

// Smoothly scrolls back to the top of the page
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Adds a small 3D tilt effect when hovering over gallery items
tiles.forEach((tile) => {
  tile.addEventListener("mousemove", (event) => {
    if (window.innerWidth <= 980) return;

    const rect = tile.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 6;
    const rotateX = ((y / rect.height) - 0.5) * -6;

    tile.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  tile.addEventListener("mouseleave", () => {
    tile.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
});

// Runs once when the page first loads
revealOnScroll();