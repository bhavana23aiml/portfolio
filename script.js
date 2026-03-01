// ========= CONFIG =========
const GITHUB_USERNAME = "bhavana23aiml";
const EMAIL_TO = "bhavana.manjunath2005@gmail.com";

// ========= THEME =========
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  setTheme(current === "dark" ? "light" : "dark");
}
(function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) setTheme(saved);
  else setTheme("dark");
})();

document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
document.getElementById("themeToggle2")?.addEventListener("click", toggleTheme);

// ========= MOBILE DRAWER =========
const drawer = document.getElementById("drawer");
const menuBtn = document.getElementById("menuBtn");
const closeDrawer = document.getElementById("closeDrawer");

function openDrawer() {
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}
function hideDrawer() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}
menuBtn?.addEventListener("click", openDrawer);
closeDrawer?.addEventListener("click", hideDrawer);
drawer?.addEventListener("click", (e) => {
  if (e.target === drawer) hideDrawer();
});
document.querySelectorAll(".drawer-link").forEach(a => a.addEventListener("click", hideDrawer));

// ========= YEAR =========
document.getElementById("year").textContent = new Date().getFullYear();

// ========= REVEAL ON SCROLL =========
const reveals = [];
document.querySelectorAll(".section, .hero, .card, .project").forEach((el) => {
  el.classList.add("reveal");
  reveals.push(el);
});

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");

      // animate skill bars once visible
      entry.target.querySelectorAll(".bar-fill").forEach((bar) => {
        const w = bar.getAttribute("style")?.match(/width:\s*(\d+%)/)?.[1];
        if (w) {
          bar.style.width = w;
        }
      });

      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => io.observe(el));

// ========= CONTACT FORM (mailto) =========
document.getElementById("mailForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("fName").value.trim();
  const subject = document.getElementById("fSub").value.trim();
  const msg = document.getElementById("fMsg").value.trim();

  const fullSubject = encodeURIComponent(`${subject} — from ${name}`);
  const body = encodeURIComponent(msg);

  window.location.href = `mailto:${EMAIL_TO}?subject=${fullSubject}&body=${body}`;
});

// ========= GITHUB REPO FETCH =========
const repoGrid = document.getElementById("repoGrid");
const repoStatus = document.getElementById("repoStatus");
const repoSearch = document.getElementById("repoSearch");
const repoSort = document.getElementById("repoSort");

let allRepos = [];

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return "";
  }
}

function renderRepos(list) {
  repoGrid.innerHTML = "";
  if (!list.length) {
    repoStatus.textContent = "No repositories matched your search.";
    return;
  }
  repoStatus.textContent = `Showing ${list.length} repositories`;

  list.slice(0, 9).forEach((r) => {
    const card = document.createElement("div");
    card.className = "repo card";
    card.innerHTML = `
      <div class="repo-name">${r.name}</div>
      <div class="repo-desc">${r.description ? r.description : "No description provided."}</div>

      <div class="repo-meta">
        ${r.language ? `<span class="kpi">${r.language}</span>` : ""}
        <span class="kpi">★ ${r.stargazers_count}</span>
        <span class="kpi">🍴 ${r.forks_count}</span>
        <span class="kpi">Updated ${fmtDate(r.updated_at)}</span>
      </div>

      <div class="repo-actions">
        <a class="btn btn-ghost" href="${r.html_url}" target="_blank" rel="noreferrer">Repo ↗</a>
        ${r.homepage ? `<a class="btn btn-ghost" href="${r.homepage}" target="_blank" rel="noreferrer">Live ↗</a>` : ""}
      </div>
    `;
    repoGrid.appendChild(card);
  });
}

function applyFilters() {
  const q = (repoSearch.value || "").toLowerCase();
  const sort = repoSort.value;

  let list = [...allRepos];

  if (q) {
    list = list.filter(r =>
      (r.name || "").toLowerCase().includes(q) ||
      (r.description || "").toLowerCase().includes(q) ||
      (r.language || "").toLowerCase().includes(q)
    );
  }

  if (sort === "updated") {
    list.sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at));
  } else if (sort === "stars") {
    list.sort((a,b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
  } else if (sort === "name") {
    list.sort((a,b) => (a.name || "").localeCompare(b.name || ""));
  }

  renderRepos(list);
}

async function fetchRepos() {
  repoStatus.textContent = "Loading GitHub repositories...";
  try {
    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;
    const res = await fetch(url, { headers: { "Accept": "application/vnd.github+json" } });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = await res.json();
    // Keep public repos only; hide forks if you want (optional)
    allRepos = data
      .filter(r => !r.private)
      .filter(r => !r.fork); // remove forks for cleaner showcase

    applyFilters();
  } catch (err) {
    console.error(err);
    repoStatus.textContent = "Could not load GitHub repos (rate limit or network issue). Please refresh later.";
  }
}

repoSearch?.addEventListener("input", applyFilters);
repoSort?.addEventListener("change", applyFilters);

fetchRepos();