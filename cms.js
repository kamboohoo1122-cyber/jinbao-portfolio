(function () {
  const config = window.SANITY_CONFIG || {};

  function hasSanityConfig() {
    return Boolean(config.projectId && config.dataset);
  }

  function imageUrl(src, options = {}) {
    if (!src || typeof src !== "string") {
      return "";
    }

    if (!src.startsWith("https://cdn.sanity.io/images/")) {
      return src;
    }

    const url = new URL(src);
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    url.searchParams.set("q", String(options.quality || config.image?.quality || 82));

    if (options.width) {
      url.searchParams.set("w", String(options.width));
    }

    return url.toString();
  }

  function normalizeProject(project) {
    const coverWidth = config.image?.coverWidth || 900;
    const galleryWidth = config.image?.galleryWidth || 1800;
    const images = (project.images || [])
      .map((image) => imageUrl(image, { width: galleryWidth }))
      .filter(Boolean);

    return {
      ...project,
      tags: project.tags || [],
      process: project.process || [],
      preview: imageUrl(project.preview || images[0], { width: coverWidth }),
      images
    };
  }

  async function fetchSanityProjects() {
    const query = `*[_type == "project"] | order(sortOrder asc, year desc, title asc) {
      "slug": slug.current,
      title,
      category,
      year,
      description,
      tags,
      challenge,
      role,
      process,
      outcome,
      "preview": preview.asset->url,
      "images": images[].asset->url
    }`;

    const host = config.useCdn ? "apicdn.sanity.io" : "api.sanity.io";
    const url = new URL(
      `https://${config.projectId}.${host}/v${config.apiVersion}/data/query/${config.dataset}`
    );
    url.searchParams.set("query", query);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Sanity 数据读取失败：${response.status}`);
    }

    const payload = await response.json();
    return (payload.result || []).map(normalizeProject);
  }

  function localProjects() {
    return (window.PROJECTS || []).map(normalizeProject);
  }

  function mergeProjects(cmsProjects, fallbackProjects) {
    return [...cmsProjects, ...fallbackProjects.filter((project) => !cmsProjects.some((item) => item.slug === project.slug))];
  }

  window.loadProjects = async function loadProjects() {
    const fallbackProjects = localProjects();

    if (!hasSanityConfig()) {
      return fallbackProjects;
    }

    try {
      return mergeProjects(await fetchSanityProjects(), fallbackProjects);
    } catch (error) {
      console.warn(error);
      return fallbackProjects;
    }
  };
})();
