const page = document.querySelector("#project-page");
const empty = document.querySelector("#project-empty");
const meta = document.querySelector("#project-meta");
const title = document.querySelector("#project-title");
const summary = document.querySelector("#project-summary");
const tags = document.querySelector("#project-tags");
const challenge = document.querySelector("#project-challenge");
const role = document.querySelector("#project-role");
const process = document.querySelector("#project-process");
const outcome = document.querySelector("#project-outcome");
const gallery = document.querySelector("#project-gallery");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector("#lightbox-close");
const lightboxPrev = document.querySelector("#lightbox-prev");
const lightboxNext = document.querySelector("#lightbox-next");

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");
let activeProject = null;
let activeImageIndex = 0;

function updateLightbox() {
  if (!activeProject) {
    return;
  }

  const src = activeProject.images[activeImageIndex];
  lightboxImage.src = src;
  lightboxImage.alt = `${activeProject.title} 第 ${activeImageIndex + 1} 张大图`;
  lightboxCaption.textContent = `${activeProject.title} · ${activeImageIndex + 1} / ${activeProject.images.length}`;
  lightboxPrev.hidden = activeProject.images.length < 2;
  lightboxNext.hidden = activeProject.images.length < 2;
}

function openLightbox(index) {
  activeImageIndex = index;
  updateLightbox();
  lightbox.hidden = false;
  document.body.classList.add("modal-open");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("modal-open");
  lightboxImage.removeAttribute("src");
}

function showAdjacentImage(direction) {
  if (!activeProject || activeProject.images.length < 2) {
    return;
  }

  activeImageIndex =
    (activeImageIndex + direction + activeProject.images.length) % activeProject.images.length;
  updateLightbox();
}

function renderProject(project) {
  activeProject = project;
  page.hidden = false;
  document.title = `${project.title} | 何金宝作品集`;

  meta.textContent = `${project.category} · ${project.year} · 共 ${project.images.length} 张`;
  title.textContent = project.title;
  summary.textContent = project.description;
  challenge.textContent = project.challenge;
  role.textContent = project.role;
  outcome.textContent = project.outcome;

  tags.innerHTML = "";
  project.tags.forEach((tag) => {
    const span = document.createElement("span");
    span.className = "project-tag";
    span.textContent = tag;
    tags.appendChild(span);
  });

  process.innerHTML = "";
  project.process.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    process.appendChild(li);
  });

  gallery.innerHTML = "";
  project.images.forEach((src, index) => {
    const figure = document.createElement("figure");
    figure.className = "project-image-card";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `${project.title} 第 ${index + 1} 张`;
    img.loading = index < 2 ? "eager" : "lazy";

    const button = document.createElement("button");
    button.className = "project-image-button";
    button.type = "button";
    button.setAttribute("aria-label", `查看${project.title}第 ${index + 1} 张大图`);
    button.addEventListener("click", () => openLightbox(index));

    button.appendChild(img);
    figure.appendChild(button);
    gallery.appendChild(figure);
  });
}

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => showAdjacentImage(-1));
lightboxNext.addEventListener("click", () => showAdjacentImage(1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showAdjacentImage(-1);
  }

  if (event.key === "ArrowRight") {
    showAdjacentImage(1);
  }
});

async function init() {
  const projects = await window.loadProjects();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    empty.hidden = false;
    return;
  }

  renderProject(project);
}

init();
