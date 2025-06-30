# Fulltext Search API

A Node.js-based fulltext search API for the BUA-DNS collection portal projects using ElasticLunr with German language support.

## Overview

This API provides fulltext search capabilities for projects from the BUA-DNS collection portal (`sammlungsportal.bua-dns.de`). It indexes project data in both German and English languages and provides fast, client-side search functionality through ElasticLunr indices.

## Features

- **Multi-language support**: German and English search indices
- **German language stemming**: Enhanced search accuracy for German content
- **Field-based boosting**: Different relevance weights for title, subtitle, description, and sidebar content
- **Real-time search**: Fast client-side search with pre-built indices
- **CORS enabled**: Cross-origin requests supported
- **Web interface**: Built-in HTML search interface for testing

## Project Structure

```
├── package.json          # Project dependencies and scripts
├── server.js             # Express server with search endpoints
├── setProjects.js        # Data fetching and indexing script
├── search.html           # Web interface for testing search
├── lunr.de.js            # German language support for Lunr
├── lunr.stemmer.support.js # Stemmer support for Lunr
├── data/
│   ├── projects_de.json  # German search index
│   └── projects_en.json  # English search index
└── README.md            # This file
```

## Installation

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Generate search indices**:
   ```bash
   npm run set-data
   ```
   This will:
   - Fetch project data from the BUA-DNS API
   - Process and clean the content (strip HTML tags)
   - Create search indices for both German and English
   - Save indices to `data/projects_de.json` and `data/projects_en.json`

4. **Start the server**:
   ```bash
   npm run serve
   ```

The server will start on port 3000 and be ready to accept search requests.

## API Endpoints

### German Search
```
GET /api/de?q=<search_query>
```

### English Search
```
GET /api/en?q=<search_query>
```

### Web Interface
```
GET /
```
Serves the built-in search interface.

## Usage Examples

### API Requests

**German search**:
```bash
curl "http://localhost:3000/api/de?q=Kooperation"
```

**English search**:
```bash
curl "http://localhost:3000/api/en?q=Cooperation"
```

### Response Format

```json
[
  {
    "ref": "project_id",
    "score": 3.1054017547966537
  },
  {
    "ref": "another_project_id", 
    "score": 1.7261564546271495
  }
]
```

The response contains:
- `ref`: The project ID from the source system
- `score`: Relevance score (higher = more relevant)

### Web Interface

Visit `http://localhost:3000` to use the built-in search interface, which allows you to:
- Search in German and English simultaneously
- View search results with scores
- Click on results to see detailed project information
- Test the API functionality interactively

## Search Configuration

The search indices are configured with the following field weights:

- **Title**: 2x boost (highest priority)
- **Sub-line**: 1.5x boost
- **Description**: 1x boost (normal priority)
- **Sidebar content**: 0.5x boost (lowest priority)

Search settings:
- **Expand**: `true` - Enables partial word matching
- **Boolean mode**: `AND` - All terms must be present

## Data Source

Project data is fetched from:
```
https://sammlungsportal.bua-dns.de/items/projects
```

The API fetches projects with their translations.

## Dependencies

- **express**: Web server framework
- **elasticlunr**: Client-side search engine
- **cors**: Cross-origin resource sharing support
- **striptags**: HTML tag removal for clean text indexing

## Scripts

- `npm run set-data`: Fetch data and rebuild search indices
- `npm run serve`: Start the search API server

## Development

### Rebuilding Indices

To update the search indices with fresh data:

```bash
npm run set-data
```

This should be run periodically to keep the search data current with the source system.

### Customizing Search

To modify search behavior, edit the search configuration in `server.js`:

```javascript
const results = index.de.search(query, {
  fields: {
    title: { boost: 2 },        // Adjust field weights
    sub_line: { boost: 1.5 },
    description: { boost: 1 },
    sidebar_content: { boost: 0.5 },
  },
  expand: true,  // Enable/disable partial matching
  bool: "AND",   // Change to "OR" for different logic
});
```

## Language Support

The application supports German language stemming through the included `lunr.de.js` and `lunr.stemmer.support.js` files, which enhance search accuracy for German content by handling word variations and stemming.

## License

MIT License

## Author

Grandgeorg Websolutions, Viktor Grandgeorg <viktor@grandgeorg.de>