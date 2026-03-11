// This waits until the full HTML page has loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  // Selecting important elements from the page
  const hero = document.querySelector(".hero");
  const heroTitle = document.querySelector(".hero h1");
  const heroNavLinks = document.querySelectorAll('.hero-nav a[href^="#"]');
  const sections = document.querySelectorAll(".section");
  const dots = document.querySelectorAll(".dot");

  /* =========================
     1) REVEAL ON SCROLL
  ========================= */

  // These are the elements that should fade in when the user scrolls
  const revealTargets = document.querySelectorAll(".section, .feature");

  // Setting initial hidden styles before reveal
  revealTargets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = "opacity 700ms ease, transform 700ms ease";
  });

  // Intersection Observer checks when elements enter the screen
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // If the element is visible on screen, show it
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16
    }
  );

  // Applying the observer to each reveal target
  revealTargets.forEach((el) => revealObserver.observe(el));

  /* =========================
     2) ACTIVE NAV HIGHLIGHT
  ========================= */

  // This function highlights the nav link based on the section in view
  function updateActiveNav() {
    let currentId = "";

    sections.forEach((section) => {
      const top = section.offsetTop - 160;
      const bottom = top + section.offsetHeight;

      if (window.scrollY >= top && window.scrollY < bottom) {
        currentId = section.id;
      }
    });

    // Remove active class from all links first
    heroNavLinks.forEach((link) => {
      link.classList.remove("is-active");

      // Compare the link target with the current visible section
      const targetId = link.getAttribute("href").replace("#", "");
      if (targetId === currentId) {
        link.classList.add("is-active");
      }
    });
  }

  // Run on scroll and once when page loads
  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();

  /* =========================
     3) ANIMATE TIMELINE DOTS
  ========================= */

  // Animate each green dot for a nice pulsing effect
  dots.forEach((dot, index) => {
    dot.animate(
      [
        {
          transform: "scale(1)",
          boxShadow: "0 10px 22px rgba(47,111,13,0.35)"
        },
        {
          transform: "scale(1.18)",
          boxShadow: "0 14px 28px rgba(47,111,13,0.55)"
        },
        {
          transform: "scale(1)",
          boxShadow: "0 10px 22px rgba(47,111,13,0.35)"
        }
      ],
      {
        duration: 1800,
        delay: index * 180,
        iterations: Infinity,
        easing: "ease-in-out"
      }
    );
  });

  /* =========================
     4) TYPEWRITER EFFECT
  ========================= */

  // This creates a typing animation for the hero title
  if (heroTitle) {
    const originalText = heroTitle.textContent.trim();
    heroTitle.textContent = "";

    let i = 0;

    function typeTitle() {
      if (i < originalText.length) {
        heroTitle.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeTitle, 45);
      }
    }

    typeTitle();
  }

  /* =========================
     5) BACK TO TOP BUTTON
  ========================= */

  // Creating the back-to-top button using JavaScript
  const topBtn = document.createElement("button");
  topBtn.textContent = "↑";
  topBtn.setAttribute("aria-label", "Back to top");

  // Styling the button directly in JS
  topBtn.style.position = "fixed";
  topBtn.style.right = "20px";
  topBtn.style.bottom = "20px";
  topBtn.style.width = "48px";
  topBtn.style.height = "48px";
  topBtn.style.border = "none";
  topBtn.style.borderRadius = "999px";
  topBtn.style.cursor = "pointer";
  topBtn.style.fontSize = "22px";
  topBtn.style.fontWeight = "700";
  topBtn.style.background = "linear-gradient(180deg, #3e8f12 0%, #2f6f0d 100%)";
  topBtn.style.color = "#fff";
  topBtn.style.boxShadow = "0 12px 30px rgba(0,0,0,0.28)";
  topBtn.style.opacity = "0";
  topBtn.style.visibility = "hidden";
  topBtn.style.transform = "translateY(10px)";
  topBtn.style.transition = "all 220ms ease";
  topBtn.style.zIndex = "999";

  // Adding the button to the page
  document.body.appendChild(topBtn);

  // Function to show/hide the button depending on scroll position
  function toggleTopButton() {
    if (window.scrollY > 300) {
      topBtn.style.opacity = "1";
      topBtn.style.visibility = "visible";
      topBtn.style.transform = "translateY(0)";
    } else {
      topBtn.style.opacity = "0";
      topBtn.style.visibility = "hidden";
      topBtn.style.transform = "translateY(10px)";
    }
  }

  window.addEventListener("scroll", toggleTopButton);
  toggleTopButton();

  // Smooth scroll back to the top when clicked
  topBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  /* =========================
     6) READING PROGRESS BAR
  ========================= */

  // Creating a progress bar at the top of the page
  const progressBar = document.createElement("div");
  progressBar.style.position = "fixed";
  progressBar.style.top = "0";
  progressBar.style.left = "0";
  progressBar.style.height = "4px";
  progressBar.style.width = "0%";
  progressBar.style.zIndex = "1000";
  progressBar.style.background = "linear-gradient(90deg, #dff7d5 0%, #3e8f12 55%, #2f6f0d 100%)";
  progressBar.style.boxShadow = "0 2px 14px rgba(62,143,18,0.45)";

  // Adding the progress bar to the page
  document.body.appendChild(progressBar);

  // Updating the progress bar width according to page scroll
  function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener("scroll", updateProgressBar);
  updateProgressBar();

  /* =========================
     7) HERO PARALLAX EFFECT
  ========================= */

  // Adds a small movement effect to the hero section while scrolling
  if (hero) {
    window.addEventListener("scroll", () => {
      const offset = window.scrollY * 0.25;
      hero.style.backgroundPosition = `center ${offset}px`;
    });
  }

  /* =========================
     8) EXTRA HOVER POLISH
  ========================= */

  // Adds a small hover effect to the nav links
  heroNavLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      link.style.transform = "translateY(-2px) scale(1.02)";
    });

    link.addEventListener("mouseleave", () => {
      // If the link is active, keep a slight raised effect
      if (!link.classList.contains("is-active")) {
        link.style.transform = "";
      } else {
        link.style.transform = "translateY(-1px)";
      }
    });
  });
});