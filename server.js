const fs = require("fs");
const path = require("path");
const express = require("express");
var cors = require('cors');

const elasticlunr = require("elasticlunr");
require("./lunr.stemmer.support.js")(elasticlunr);
require("./lunr.de.js")(elasticlunr);

const serializedIndex = {
  de: fs.readFileSync(path.join(__dirname, "data/projects_de.json"), "utf8"),
  en: fs.readFileSync(path.join(__dirname, "data/projects_en.json"), "utf8"),
};
const index = {
  de: elasticlunr.Index.load(JSON.parse(serializedIndex.de)),
  en: elasticlunr.Index.load(JSON.parse(serializedIndex.en)),
};

const app = express();
app.use(cors());
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "search.html"));
});
app.get("/api/en", function (req, res) {
  const query = req.query.q;
  const results = index.en.search(query, {
    fields: {
      title: { boost: 2 },
      sub_line: { boost: 1.5 },
      description: { boost: 1 },
      sidebar_content: { boost: 0.5 },
    },
    expand: true,
    bool: "AND",
  });
  res.json(results);
});
app.get("/api/de", function (req, res) {
  const query = req.query.q;
  const results = index.de.search(query, {
    fields: {
      title: { boost: 2 },
      sub_line: { boost: 1.5 },
      description: { boost: 1 },
      sidebar_content: { boost: 0.5 },
    },
    expand: true,
    bool: "AND",
  });
  res.json(results);
});
app.listen(3000, function () {
  console.log(
    "Server is listening on port 3000. Ready to accept requests! e.g. http://localhost:3000/api/en/?q=Cooperation"
  );
});