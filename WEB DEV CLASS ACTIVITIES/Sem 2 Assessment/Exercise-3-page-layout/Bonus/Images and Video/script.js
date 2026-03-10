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

function revealOnScroll() {
  revealElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      element.classList.add("visible");
    }
  });
}

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

function openLightbox(src, caption) {
  lightboxImage.src = src;
  lightboxCaption.textContent = caption || "";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

zoomableImages.forEach((image) => {
  image.addEventListener("click", () => {
    openLightbox(image.src, image.alt);
  });
});

openFeatureBtn.addEventListener("click", () => {
  openLightbox(featureImage.src, featureImage.alt);
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

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

  if (window.scrollY > 300) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }

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

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

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

revealOnScroll();