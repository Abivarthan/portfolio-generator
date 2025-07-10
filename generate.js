function downloadHTML() {
  const formData = JSON.parse(localStorage.getItem("formData"));
  const fileName = formData?.name ? `${formData.name}-portfolio.html` : "portfolio.html";

  // Get full HTML content
  let content = document.documentElement.outerHTML;

  // Replace all dynamic text values
  const replaceText = (id, value) => {
    const regex = new RegExp(`<[^>]*id="${id}"[^>]*>(.*?)<\\/[^>]+>`, 'g');
    content = content.replace(regex, match => {
      return match.replace(/>.*?</, `>${value}<`);
    });
  };

  replaceText("user-name", formData.name);
  replaceText("user-title", formData.title);
  replaceText("user-bio", formData.bio);
  replaceText("user-about", formData.about);
  replaceText("user-email", formData.email);
  replaceText("user-phone", formData.phone);

  // Replace image, links
  content = content.replace(/id="user-photo"[^>]*src="[^"]*"/, `id="user-photo" src="${formData.photo}"`);
  content = content.replace(/id="user-linkedin"[^>]*href="[^"]*"/, `id="user-linkedin" href="${formData.linkedin}"`);
  content = content.replace(/id="user-github"[^>]*href="[^"]*"/, `id="user-github" href="${formData.github}"`);

  // Replace skills
  const skillTags = formData.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join("");
  content = content.replace(/<div id="user-skills"[^>]*>[\s\S]*?<\/div>/, `<div id="user-skills">${skillTags}</div>`);

  // Replace projects
  const projectsHTML = formData.projects.map(project => `
    <div class="project-card">
      ${project.image ? `<div class="project-image"><img src="${project.image}" alt="${project.title}"></div>` : ""}
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">View Project</a>` : ""}
      </div>
    </div>
  `).join("");

  content = content.replace(/<div id="project-list"[^>]*>[\s\S]*?<\/div>/, `<div id="project-list" class="portfolio-grid">${projectsHTML}</div>`);

  //  Remove all <script> tags
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Minify (optional): remove excessive whitespace & line breaks
  content = content.replace(/\n\s*/g, ' ').replace(/\s{2,}/g, ' ');

  // Create blob and trigger download
  const blob = new Blob([content], { type: 'text/html' });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
}
