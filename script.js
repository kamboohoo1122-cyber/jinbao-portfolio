const grid = document.querySelector("#project-grid");
const filtersContainer = document.querySelector("#filters");
const template = document.querySelector("#project-card-template");
const emptyState = document.querySelector("#project-empty");

let projects = [];
let categories = ["全部"];
let currentCategory = "全部";

function renderFilters() {
  filtersContainer.innerHTML = "";

  if (projects.length === 0) {
    filtersContainer.setAttribute("hidden", "");
    return;
  }

  filtersContainer.removeAttribute("hidden");

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `filter-btn${category === currentCategory ? " active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      currentCategory = category;
      renderFilters();
      renderProjects();
    });
    filtersContainer.appendChild(button);
  });
}

function renderProjects() {
  grid.innerHTML = "";

  const filtered =
    currentCategory === "全部"
      ? projects
      : projects.filter((project) => project.category === currentCategory);

  if (filtered.length === 0) {
    emptyState.removeAttribute("hidden");
    grid.setAttribute("hidden", "");
  } else {
    emptyState.setAttribute("hidden", "");
    grid.removeAttribute("hidden");
  }

  filtered.forEach((project) => {
    const node = template.content.cloneNode(true);
    const img = node.querySelector(".thumb");
    const meta = node.querySelector(".meta");
    const title = node.querySelector("h3");
    const desc = node.querySelector(".desc");
    const tags = node.querySelector(".tags");
    const linkButton = node.querySelector(".link-btn");

    img.src = project.preview || project.images[0];
    img.alt = `${project.title} 预览图`;
    meta.textContent = `${project.category} · ${project.year} · ${project.images.length} 张`;
    title.textContent = project.title;
    desc.textContent = project.description;

    project.tags.forEach((tag) => {
      const li = document.createElement("li");
      li.textContent = tag;
      tags.appendChild(li);
    });

    linkButton.href = `./project.html?slug=${encodeURIComponent(project.slug)}`;
    linkButton.textContent = `进入项目子页面（${project.images.length} 张）`;

    grid.appendChild(node);
  });
}

document.querySelector("#year").textContent = String(new Date().getFullYear());

async function init() {
  projects = await window.loadProjects();
  categories = ["全部", ...new Set(projects.map((item) => item.category).filter(Boolean))];
  renderFilters();
  renderProjects();
}

init();
