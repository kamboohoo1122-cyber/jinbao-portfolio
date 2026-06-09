const page = document.querySelector("#collection-page");
const empty = document.querySelector("#collection-empty");
const meta = document.querySelector("#collection-meta");
const title = document.querySelector("#collection-title");
const summary = document.querySelector("#collection-summary");
const tags = document.querySelector("#collection-tags");
const grid = document.querySelector("#collection-grid");
const template = document.querySelector("#project-card-template");

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

function renderTags(items) {
  tags.innerHTML = "";
  items.forEach((tag) => {
    const span = document.createElement("span");
    span.className = "project-tag";
    span.textContent = tag;
    tags.appendChild(span);
  });
}

function renderCard(project) {
  const node = template.content.cloneNode(true);
  const img = node.querySelector(".thumb");
  const cardMeta = node.querySelector(".meta");
  const cardTitle = node.querySelector("h3");
  const desc = node.querySelector(".desc");
  const tagList = node.querySelector(".tags");
  const linkButton = node.querySelector(".link-btn");

  img.src = project.preview || project.images?.[0]?.src || project.images?.[0];
  img.alt = `${project.title} 预览图`;
  cardMeta.textContent = `${project.category} · ${project.year} · ${project.images.length} 张`;
  cardTitle.textContent = project.title;
  desc.textContent = project.description;

  (project.tags || []).forEach((tag) => {
    const li = document.createElement("li");
    li.textContent = tag;
    tagList.appendChild(li);
  });

  linkButton.href = `./project.html?slug=${encodeURIComponent(project.slug)}`;
  linkButton.textContent = `查看详情（${project.images.length} 张）`;
  grid.appendChild(node);
}

function renderCollection(collection) {
  page.hidden = false;
  document.title = `${collection.title} | 何金宝作品集`;
  meta.textContent = `${collection.category} · ${collection.year} · ${collection.items.length} 个子项目`;
  title.textContent = collection.title;
  summary.textContent = collection.description;
  renderTags(collection.tags || []);
  grid.innerHTML = "";
  collection.items.forEach(renderCard);
}

const collection = (window.COLLECTIONS || []).find((item) => item.slug === slug);

if (!collection) {
  empty.hidden = false;
} else {
  renderCollection(collection);
}
