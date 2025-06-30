"use strict";

const path = require("path");
const fs = require("fs");
const elasticlunr = require("elasticlunr");
require("./lunr.stemmer.support.js")(elasticlunr);
require("./lunr.de.js")(elasticlunr);
const striptags = require("striptags");

const baseDir = process.cwd();
const dataDir = path.join(baseDir, "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// fectch projects
function fetchProjects() {

  const url =
    "https://sammlungsportal.bua-dns.de/items/projects?fields=*,translations.*,logos_coop_partners.*,images.directus_files_id.*,preview_image.*.*,cooperation_partners.institutions_id.name_short,cooperation_partners.institutions_id.logo&limit=-1";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const projects = data.data;
      indexProjects(projects);
    })
    .catch((error) => {
      console.error("Error fetching projects:", error);
    });

  function indexProjects(projects) {
    const langs = ["en", "de"];
    langs.forEach((lang) => {
      const projectsLang = projects.map((project) => {
        const translations = project.translations.find(
          (translation) => translation.languages_code === lang
        );
        return {
          id: project.id,
          title: translations ? translations.title : "",
          sub_line: translations ? translations.sub_line : "",
          description: translations ? striptags(translations.description) : "",
          sidebar_content: translations ? striptags(translations.sidebar_content) : "",
        };
      });
      createIndex(projectsLang, lang);
    });
  }

  function createIndex(projects, lang) {
    if (!projects || projects.length === 0) {
      // console.error(`No projects found for language: ${lang}`);
      return;
    }
    const index = elasticlunr(function () {
      if (lang === "de") {
        this.use(elasticlunr.de);
      }
      this.setRef("id");
      this.addField("title");
      this.addField("sub_line");
      this.addField("description");
      this.addField("sidebar_content");
    });

    projects.forEach((project) => {
      index.addDoc(project);
    });

    const indexPath = path.join(dataDir, `projects_${lang}.json`);
    fs.writeFileSync(indexPath, JSON.stringify(index.toJSON()));
    // console.log(`Index for ${lang} created at ${indexPath}`);

  }
}

fetchProjects();