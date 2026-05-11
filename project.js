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

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

function renderProject(project) {
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

    figure.appendChild(img);
    gallery.appendChild(figure);
  });
}

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
