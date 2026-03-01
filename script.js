// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn?.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// Close menu when clicking a link (mobile)
navLinks?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => navLinks.classList.remove("show"));
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Contact form -> opens mail app with pre-filled content
const form = document.getElementById("contactForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const fromName = document.getElementById("fromName").value.trim();
  const fromEmail = document.getElementById("fromEmail").value.trim();
  const message = document.getElementById("message").value.trim();

  const subject = encodeURIComponent(`Portfolio Contact from ${fromName}`);
  const body = encodeURIComponent(
    `Name: ${fromName}\nEmail: ${fromEmail}\n\nMessage:\n${message}\n`
  );

  window.location.href = `mailto:bhavana.manjunath2005@gmail.com?subject=${subject}&body=${body}`;
});