/**
 * Zoho Deluge Documentation - Navigation & Component Architecture Engine (v2.0)
 * Handles dynamic header, reading progress bar, sidebar navigation, right-side TOC,
 * breadcrumbs, page pager, and footer rendering.
 * Fully compatible with GitHub Pages subdirectories and local file system execution.
 */
window.DocSite = (() => {
  const isSubdirPage = location.pathname.includes('/pages/');
  const root = isSubdirPage ? '../' : './';
  let cachedToc = null;

  // Embedded fallback data ensuring static file:// opening works seamlessly without server CORS restrictions
  const FALLBACK_TOC = {
    "version": "2.0.0",
    "updated": "August 10, 2026",
    "author": "Zoho Engineering Standards Guild",
    "repository": "https://github.com/your-org/zoho-deluge-development-standards",
    "pages": [
      {
        "id": "introduction",
        "title": "Introduction & Governance",
        "path": "index.html",
        "description": "Overview, principles, architecture rules, and engineering governance for Zoho Deluge development",
        "icon": "book-open",
        "children": [
          "Document Purpose & Scope",
          "Importance & Benefits",
          "Compliance Scope"
        ]
      },
      {
        "id": "naming-convention",
        "title": "Deluge Coding Standards",
        "path": "pages/naming-convention.html",
        "description": "Naming conventions, formatting, function structure, error handling, logging, and null-safe coding",
        "icon": "code-2",
        "children": [
          "Naming Convention",
          "Variable Naming",
          "Function Naming",
          "API Variable Naming",
          "Variable Declaration",
          "Code Formatting",
          "Function Header",
          "Commenting Standards",
          "Error Handling",
          "Logging Standards",
          "Null Safe Coding",
          "API Response Validation"
        ]
      },
      {
        "id": "connection-standards",
        "title": "Connection Standards",
        "path": "pages/connection-standards.html",
        "description": "Secure OAuth2 authentication, integration scopes, connection link names, and connection reuse",
        "icon": "plug-zap",
        "children": [
          "Connection Naming",
          "Connection Scope Standards",
          "Scope Minimization"
        ]
      },
      {
        "id": "api-logging",
        "title": "API Logging Standards",
        "path": "pages/api-logging.html",
        "description": "Observability practices, correlation IDs, error tracking, and PII data masking",
        "icon": "file-text",
        "children": [
          "API Audit Logging",
          "Log Schema Attributes",
          "Data Masking",
          "Transaction Correlation"
        ]
      },
      {
        "id": "configuration",
        "title": "Configuration Standards",
        "path": "pages/configuration.html",
        "description": "Externalizing environment parameters, dynamic variables, switch flags, and secrets isolation",
        "icon": "settings",
        "children": [
          "Config Declaration Policy",
          "Config Parameters Catalog",
          "Environment Switching"
        ]
      },
      {
        "id": "performance",
        "title": "Performance Guidelines",
        "path": "pages/performance.html",
        "description": "Optimizing script runtime, batching API calls, memory control, and governor limit management",
        "icon": "zap",
        "children": [
          "API Call Reduction",
          "Loop Efficiency",
          "Payload Trimming",
          "Rate Limit Backoff"
        ]
      },
      {
        "id": "code-review-checklist",
        "title": "Code Review Checklist",
        "path": "pages/code-review-checklist.html",
        "description": "Interactive pre-release audit checklist, PR readiness score calculator, and governance verification",
        "icon": "check-square",
        "children": [
          "Pre Release Audit",
          "Review Checklist Breakdown"
        ]
      }
    ]
  };

  async function loadToc() {
    if (cachedToc) return cachedToc;
    try {
      const res = await fetch(root + 'data/toc.json');
      if (res.ok) {
        cachedToc = await res.json();
        return cachedToc;
      }
    } catch (e) {
      console.info('Using embedded fallback TOC data');
    }
    cachedToc = FALLBACK_TOC;
    return cachedToc;
  }

  function icon(name) {
    return `<i data-lucide="${name || 'file-text'}" aria-hidden="true"></i>`;
  }

  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  async function render() {
    const data = await loadToc();
    const currentPageId = document.body.dataset.page || 'introduction';

    // 0. Ensure Reading Progress Bar exists
    if (!document.getElementById('reading-progress')) {
      const bar = document.createElement('div');
      bar.id = 'reading-progress';
      bar.className = 'reading-progress-bar';
      document.body.prepend(bar);
    }

    // 1. Render Header Component
    const headerEl = document.getElementById('site-header');
    if (headerEl) {
      headerEl.innerHTML = `
        <header class="header">
          <button class="menu-btn" id="menu-toggle" aria-label="Open mobile navigation" aria-expanded="false">
            ${icon('menu')}
          </button>
          <a class="brand" href="${root}index.html">
            <span class="brand-mark">${icon('code-2')}</span>
            <span class="brand-text">
              <span class="brand-title">Deluge Standards</span>
              <span class="brand-subtitle">Developer Coding Guide</span>
            </span>
          </a>
          <div class="header-actions">
            <button class="search-btn" id="search-toggle" aria-label="Search documentation">
              ${icon('search')}
              <span>Search docs...</span>
              <kbd>Ctrl K</kbd>
            </button>
            <button class="icon-btn" id="theme-toggle" aria-label="Toggle color theme">
              ${icon('moon')}
            </button>
          </div>
        </header>
      `;
    }

    // 2. Render Left Navigation Sidebar
    const sidebarEl = document.getElementById('site-sidebar');
    if (sidebarEl) {
      const navItemsHtml = data.pages.map(p => {
        const isActive = p.id === currentPageId;
        const pageUrl = root + p.path;
        
        let subHtml = '';
        if (isActive) {
          // Priority 1: Extract actual DOM sections dynamically if rendered
          const headings = document.querySelectorAll('article.doc-article section[id] > h2');
          if (headings.length > 0) {
            const subLinks = Array.from(headings).map(h2 => {
              const sec = h2.closest('section');
              const id = sec ? sec.id : h2.id;
              const title = h2.textContent.trim();
              return `<a class="nav-link sub" href="${pageUrl}#${id}">${title}</a>`;
            }).join('');
            subHtml = `<div class="nav-sub-list">${subLinks}</div>`;
          } else if (p.children && p.children.length > 0) {
            const subLinks = p.children.map(childTitle => {
              const anchor = slugify(childTitle);
              return `<a class="nav-link sub" href="${pageUrl}#${anchor}">${childTitle}</a>`;
            }).join('');
            subHtml = `<div class="nav-sub-list">${subLinks}</div>`;
          }
        }

        return `
          <div class="nav-item">
            <a class="nav-link ${isActive ? 'active' : ''}" href="${pageUrl}">
              ${icon(p.icon)}
              <span>${p.title}</span>
            </a>
            ${subHtml}
          </div>
        `;
      }).join('');

      sidebarEl.innerHTML = `
        <div class="nav-group">
          <div class="nav-label">Engineering Handbook</div>
          ${navItemsHtml}
        </div>
      `;
    }

    // 3. Render Breadcrumbs Component
    const breadcrumbsEl = document.getElementById('breadcrumbs');
    if (breadcrumbsEl) {
      const currentPageObj = data.pages.find(p => p.id === currentPageId) || data.pages[0];
      breadcrumbsEl.innerHTML = `
        <a href="${root}index.html">Handbook</a>
        <span class="sep">/</span>
        <span class="current">${currentPageObj.title}</span>
      `;
    }

    // 4. Render Right Sidebar (On This Page TOC)
    const tocSidebarEl = document.getElementById('site-toc-sidebar');
    if (tocSidebarEl) {
      const headings = document.querySelectorAll('article.doc-article section[id] > h2');
      if (headings.length > 0) {
        const tocItemsHtml = Array.from(headings).map(h2 => {
          const sec = h2.closest('section');
          const id = sec ? sec.id : h2.id;
          const title = h2.textContent.trim();
          return `<li class="toc-item"><a href="#${id}">${title}</a></li>`;
        }).join('');

        tocSidebarEl.innerHTML = `
          <aside class="toc-sidebar" aria-label="On this page navigation">
            <div class="toc-title">On this page</div>
            <ul class="toc-list">
              ${tocItemsHtml}
            </ul>
          </aside>
        `;
      } else {
        tocSidebarEl.innerHTML = '';
      }
    }

    // 5. Render Page Pager Component
    const pagerEl = document.getElementById('page-pager');
    if (pagerEl) {
      const currentIndex = data.pages.findIndex(p => p.id === currentPageId);
      if (currentIndex !== -1) {
        const prevPage = data.pages[currentIndex - 1];
        const nextPage = data.pages[currentIndex + 1];

        let pagerHtml = '';
        if (prevPage) {
          const prevUrl = root + prevPage.path;
          pagerHtml += `
            <a class="pager-link prev" href="${prevUrl}">
              <span class="pager-label">← Previous</span>
              <span class="pager-title">${prevPage.title}</span>
            </a>
          `;
        } else {
          pagerHtml += `<div></div>`;
        }

        if (nextPage) {
          const nextUrl = root + nextPage.path;
          pagerHtml += `
            <a class="pager-link next" href="${nextUrl}">
              <span class="pager-label">Next →</span>
              <span class="pager-title">${nextPage.title}</span>
            </a>
          `;
        } else {
          pagerHtml += `<div></div>`;
        }

        pagerEl.innerHTML = pagerHtml;
      }
    }

    // 6. Render Footer Component
    const footerEl = document.getElementById('site-footer');
    if (footerEl) {
      footerEl.innerHTML = `
        <footer class="footer">
          <div class="footer-content">
            <div class="footer-brand">
              <span class="footer-title">Zoho Deluge Development Standards</span>
            </div>
            <div class="footer-meta">
              <span>Version 1.0</span>
              <span class="sep">•</span>
              <span>Last Updated: August 2026</span>
              <span class="sep">•</span>
              <span>Created & Maintained by Kishore</span>
              <span class="sep">•</span>
              <span>© 2026</span>
            </div>
          </div>
        </footer>
      `;
    }

    // Refresh Lucide SVG Icons
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  return { root, loadToc, render };
})();
