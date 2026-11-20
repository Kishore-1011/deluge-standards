<div align="center">

# 📘 Deluge Standards

**A clean, modern handbook of coding standards and best practices for Zoho Deluge development.**

[![Live Site](https://img.shields.io/badge/Live-Documentation-2ea44f?style=for-the-badge&logo=githubpages&logoColor=white)](https://kishore-1011.github.io/deluge-standards/)
[![Deploy](https://img.shields.io/github/actions/workflow/status/Kishore-1011/deluge-standards/deploy-pages.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=Deploy)](https://github.com/Kishore-1011/deluge-standards/actions)
![Version](https://img.shields.io/badge/Version-2.0.0-blue?style=for-the-badge)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat-square&logo=githubpages&logoColor=white)

### 🔗 [**Read the documentation → kishore-1011.github.io/deluge-standards**](https://kishore-1011.github.io/deluge-standards/)

</div>

---

## 📖 About

Deluge Standards is the reference guide for writing **reliable, maintainable, secure and performant** Zoho Deluge code. It brings naming rules, error handling, connections, configuration, logging and performance guidance into one searchable site, so every developer on a project writes code the same way.

## ✨ Features

- 🧭 **Sidebar navigation** across all seven sections
- 🔍 **Built-in search** to jump straight to a standard
- 🌗 **Light and dark theme** toggle
- 📱 **Responsive layout** that works on desktop and mobile
- 🚀 **Automatic deployment** to GitHub Pages through GitHub Actions
- ⚡ **No build step.** It is plain HTML, CSS and JavaScript

## 🗂️ What's Covered

| # | Section | What you'll find |
|---|---------|------------------|
| 1 | **Introduction & Governance** | Purpose and scope, why standards matter, and who they apply to |
| 2 | **Deluge Coding Standards** | Naming, declarations, formatting, function headers, comments, error handling, logging, null-safe coding and API response validation |
| 3 | **Connection Standards** | One connection per service, scope and reuse policy, OAuth scope minimization |
| 4 | **API Logging Standards** | Mandatory audit logging and log schema attributes |
| 5 | **Configuration Standards** | Top-level config declaration, parameter catalog, sandbox vs production switching |
| 6 | **Performance Guidelines** | API call batching, loop optimization, field selection and memory control |
| 7 | **Code Review Checklist** | Pre-release verification and the 13-point review audit |

## 🏗️ Project Structure

```text
deluge-standards/
├── index.html                # Landing page (Introduction & Governance)
├── pages/                    # One page per standards section
│   ├── introduction.html
│   ├── naming-convention.html
│   ├── connection-standards.html
│   ├── api-logging.html
│   ├── configuration.html
│   ├── performance.html
│   └── code-review-checklist.html
├── assets/
│   ├── css/                  # style.css, theme.css
│   ├── js/                   # app, navigation, search, theme
│   └── icons/                # favicon
├── data/
│   └── toc.json              # Table of contents that drives navigation
└── .github/workflows/
    └── deploy-pages.yml      # GitHub Pages deployment
```

## 🚀 Run Locally

No dependencies or build step are needed.

```bash
# 1. Clone the repository
git clone https://github.com/Kishore-1011/deluge-standards.git
cd deluge-standards

# 2. Serve it with any static server (the TOC is loaded with fetch, so open it over http)
python -m http.server 8000
```

Then open **http://localhost:8000** in your browser.

## 🌐 Deployment

Pushing to the default branch triggers the **Deploy Pages** workflow, which publishes the site to GitHub Pages at
**https://kishore-1011.github.io/deluge-standards/**

## 🤝 Contributing

1. Edit or add a page under `pages/`.
2. Register new pages in `data/toc.json` so they appear in the sidebar and search.
3. Preview locally, then open a pull request.

---

<div align="center">

**Built for Zoho Deluge developers** · [Live Site](https://kishore-1011.github.io/deluge-standards/) · [Repository](https://github.com/Kishore-1011/deluge-standards)

</div>
