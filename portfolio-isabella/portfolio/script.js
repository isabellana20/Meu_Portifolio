/* =========================================================
   Portfólio · Isabella Ana Dutra de Sousa
   ========================================================= */

const GITHUB_USER = "isabellana20";

/* ---------- Tema claro / escuro (lembra a escolha) ---------- */
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function getSavedTheme() {
  try { return localStorage.getItem("theme"); } catch { return null; }
}
function saveTheme(t) {
  try { localStorage.setItem("theme", t); } catch { /* ignora */ }
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
root.dataset.theme = getSavedTheme() || (prefersDark ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  saveTheme(next);
});

/* ---------- Menu mobile ---------- */
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  })
);

/* ---------- Borda da nav ao rolar ---------- */
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

/* ---------- Efeito de digitação ---------- */
const phrases = [
  "Estudante de Sistemas de Informação",
  "Suporte de TI",
  "Desenvolvimento Web",
  "Redes & Banco de Dados",
];
const typedEl = document.getElementById("typed");
let pIndex = 0, cIndex = 0, deleting = false;

function type() {
  const current = phrases[pIndex];
  typedEl.textContent = current.slice(0, cIndex);

  if (!deleting && cIndex < current.length) {
    cIndex++;
    setTimeout(type, 70);
  } else if (!deleting && cIndex === current.length) {
    deleting = true;
    setTimeout(type, 1800);
  } else if (deleting && cIndex > 0) {
    cIndex--;
    setTimeout(type, 35);
  } else {
    deleting = false;
    pIndex = (pIndex + 1) % phrases.length;
    setTimeout(type, 300);
  }
}
type();

/* ---------- Animações ao rolar ---------- */
function animateCount(el) {
  const target = +el.dataset.count;
  const duration = 1200;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add("visible");
    el.querySelectorAll("[data-count]").forEach(animateCount);
    el.querySelectorAll(".bar span").forEach((b) => (b.style.width = b.dataset.level + "%"));
    observer.unobserve(el);
  });
}, { threshold: 0.15 });

function observeReveals(scope = document) {
  scope.querySelectorAll(".reveal:not(.visible)").forEach((el) => observer.observe(el));
}
observeReveals();

/* ---------- Link ativo no menu ---------- */
const sections = document.querySelectorAll("main section[id]");
const navLinks = menu.querySelectorAll("a");

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
      );
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((s) => sectionObserver.observe(s));

/* ---------- Copiar e-mail ---------- */
const copyBtn = document.getElementById("copyEmail");
const copyHint = document.getElementById("copyHint");

copyBtn.addEventListener("click", async () => {
  const email = copyBtn.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    copyHint.textContent = "copiado! ✓";
  } catch {
    window.location.href = "mailto:" + email;
  }
  setTimeout(() => (copyHint.textContent = "clique para copiar"), 2000);
});

/* ---------- Projetos do GitHub ---------- */
const projectsEl = document.getElementById("projects");

function escapeHTML(str = "") {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function emptyState(msg) {
  projectsEl.innerHTML = `
    <div class="projects__empty">
      ${msg}<br />
      <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener">Ver perfil no GitHub →</a>
    </div>`;
}

async function loadProjects() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`);
    if (!res.ok) throw new Error(res.status);
    const repos = (await res.json())
      .filter((r) => !r.fork && r.name.toLowerCase() !== `${GITHUB_USER}.github.io`)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, 6);

    if (!repos.length) {
      emptyState("Em breve novos projetos por aqui! 🚀");
      return;
    }

    projectsEl.innerHTML = repos.map((r) => `
      <a class="project reveal" href="${r.homepage || r.html_url}" target="_blank" rel="noopener">
        <div class="project__top">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <span class="mono">↗</span>
        </div>
        <h3>${escapeHTML(r.name.replace(/[-_]/g, " "))}</h3>
        <p>${escapeHTML(r.description || "Projeto no GitHub.")}</p>
        <div class="project__meta mono">
          ${r.language ? `<span class="project__lang">${escapeHTML(r.language)}</span>` : ""}
          ${r.stargazers_count ? `<span>★ ${r.stargazers_count}</span>` : ""}
          <span>${new Date(r.pushed_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}</span>
        </div>
      </a>`).join("");

    observeReveals(projectsEl);
  } catch (err) {
    emptyState("Não foi possível carregar os projetos agora.");
  }
}
loadProjects();

/* ---------- Galeria dos projetos em destaque ---------- */
const galleries = {
  annas: [
    ["assets/projetos/annas-1.jpg", "Anna's Suplementos · Página inicial"],
    ["assets/projetos/annas-2.jpg", "Anna's Suplementos · Catálogo com filtros"],
    ["assets/projetos/annas-3.jpg", "Anna's Suplementos · Carrinho de compras"],
    ["assets/projetos/annas-4.jpg", "Anna's Suplementos · Contato"],
  ],
  criancas: [
    ["assets/projetos/criancas-1.jpg", "Dia das Crianças · Página inicial com carrossel"],
    ["assets/projetos/criancas-2.jpg", "Dia das Crianças · Cards e história"],
    ["assets/projetos/criancas-3.jpg", "Dia das Crianças · Direitos e como comemorar"],
  ],
};

const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCap = document.getElementById("lbCap");
let lbList = [], lbIndex = 0, lastFocus = null;

function showSlide(i) {
  lbIndex = (i + lbList.length) % lbList.length;
  const [src, cap] = lbList[lbIndex];
  lbImg.src = src;
  lbImg.alt = cap;
  lbCap.textContent = `${cap}  ·  ${lbIndex + 1}/${lbList.length}`;
}
function openGallery(name) {
  lbList = galleries[name];
  lastFocus = document.activeElement;
  showSlide(0);
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("lbClose").focus();
}
function closeGallery() {
  lb.hidden = true;
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

document.querySelectorAll("[data-gallery]").forEach((el) =>
  el.addEventListener("click", () => openGallery(el.dataset.gallery))
);
document.getElementById("lbClose").addEventListener("click", closeGallery);
document.getElementById("lbPrev").addEventListener("click", () => showSlide(lbIndex - 1));
document.getElementById("lbNext").addEventListener("click", () => showSlide(lbIndex + 1));
lb.addEventListener("click", (e) => { if (e.target === lb) closeGallery(); });
document.addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeGallery();
  if (e.key === "ArrowLeft") showSlide(lbIndex - 1);
  if (e.key === "ArrowRight") showSlide(lbIndex + 1);
});

/* ---------- Ano no rodapé ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
