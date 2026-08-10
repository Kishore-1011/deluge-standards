/**
 * Zoho Deluge Documentation - Interactive Deep Search Engine (v2.0)
 * Client-side section-level search modal supporting category filtering, keyword highlighting,
 * keyboard navigation, and instant indexing.
 */
document.addEventListener('DOMContentLoaded', () => {
  let searchModal = null;
  let searchInput = null;
  let searchResults = null;
  let activeIndex = -1;
  let searchData = [];
  let currentCategory = 'all';

  const CATEGORIES = [
    { id: 'all', label: 'All Standards' },
    { id: 'coding', label: 'Coding Standards' },
    { id: 'security', label: 'OAuth & Scope' },
    { id: 'logging', label: 'Logging & PII' },
    { id: 'performance', label: 'Performance' },
    { id: 'checklist', label: 'Checklist' }
  ];

  function createSearchModal() {
    if (document.getElementById('search-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'search-modal';
    modal.className = 'search-dialog';
    modal.setAttribute('aria-hidden', 'true');

    const filterTabsHtml = CATEGORIES.map(c => `
      <button class="search-filter-tab ${c.id === 'all' ? 'active' : ''}" data-category="${c.id}">${c.label}</button>
    `).join('');

    modal.innerHTML = `
      <div class="search-panel">
        <div class="search-header">
          <i data-lucide="search" class="search-input-icon"></i>
          <input type="search" id="search-input" class="search-input" placeholder="Search standards, rules, function headers, OAuth..." autocomplete="off" />
          <kbd class="search-esc-badge">ESC</kbd>
        </div>
        <div class="search-categories">
          ${filterTabsHtml}
        </div>
        <div id="search-results" class="search-results"></div>
      </div>
    `;
    document.body.appendChild(modal);

    searchModal = modal;
    searchInput = modal.querySelector('#search-input');
    searchResults = modal.querySelector('#search-results');

    if (window.lucide) lucide.createIcons();

    // Close on clicking backdrop
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeSearch();
    });

    // Category filter click listener
    modal.querySelectorAll('.search-filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        modal.querySelectorAll('.search-filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.dataset.category;
        performSearch(searchInput.value);
      });
    });

    // Input search listener
    searchInput.addEventListener('input', () => {
      performSearch(searchInput.value);
    });

    // Keyboard navigation inside search input
    searchInput.addEventListener('keydown', (e) => {
      const items = searchResults.querySelectorAll('.search-result');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (items.length > 0) {
          activeIndex = (activeIndex + 1) % items.length;
          updateActiveItem(items);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (items.length > 0) {
          activeIndex = (activeIndex - 1 + items.length) % items.length;
          updateActiveItem(items);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && items[activeIndex]) {
          items[activeIndex].click();
        } else if (items.length > 0) {
          items[0].click();
        }
      } else if (e.key === 'Escape') {
        closeSearch();
      }
    });
  }

  function updateActiveItem(items) {
    items.forEach((item, idx) => {
      item.classList.toggle('focused', idx === activeIndex);
      if (idx === activeIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  async function openSearch() {
    createSearchModal();
    if (window.DocSite) {
      const tocData = await window.DocSite.loadToc();
      searchData = tocData ? tocData.pages : [];
    }

    searchModal.classList.add('open');
    searchModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      if (searchInput) searchInput.focus();
    }, 50);

    performSearch('');
  }

  function closeSearch() {
    if (!searchModal) return;
    searchModal.classList.remove('open');
    searchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    activeIndex = -1;
  }

  function highlightText(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  function categorizePage(pageId) {
    if (pageId.includes('naming')) return 'coding';
    if (pageId.includes('connection')) return 'security';
    if (pageId.includes('logging')) return 'logging';
    if (pageId.includes('performance')) return 'performance';
    if (pageId.includes('checklist')) return 'checklist';
    return 'coding';
  }

  function performSearch(query) {
    if (!searchResults) return;
    const q = query.toLowerCase().trim();

    const matches = [];

    searchData.forEach(page => {
      const pageCat = categorizePage(page.id);
      if (currentCategory !== 'all' && pageCat !== currentCategory) return;

      const pageTitleMatch = page.title.toLowerCase().includes(q);
      const pageDescMatch = page.description && page.description.toLowerCase().includes(q);

      if (!q || pageTitleMatch || pageDescMatch) {
        matches.push({
          title: page.title,
          desc: page.description,
          url: window.DocSite.root + page.path,
          icon: page.icon || 'file-text',
          badge: 'Handbook Page'
        });
      }

      if (page.children) {
        page.children.forEach(child => {
          if (!q || child.toLowerCase().includes(q)) {
            const anchor = child.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            matches.push({
              title: child,
              desc: `Section in ${page.title}`,
              url: window.DocSite.root + page.path + '#' + anchor,
              icon: 'hash',
              badge: page.title
            });
          }
        });
      }
    });

    renderResults(matches, q);
  }

  function renderResults(results, query) {
    activeIndex = -1;
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-empty">
          <i data-lucide="file-x" style="width:32px; height:32px; opacity:0.5; margin-bottom:0.5rem;"></i>
          <p>No documentation standards found matching "<strong>${query}</strong>".</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    searchResults.innerHTML = results.slice(0, 15).map(item => `
      <a class="search-result" href="${item.url}">
        <div class="search-result-main">
          <span class="search-result-title">
            <i data-lucide="${item.icon}" style="width:16px; height:16px; flex-shrink:0;"></i>
            ${highlightText(item.title, query)}
          </span>
          <span class="search-result-desc">${highlightText(item.desc || '', query)}</span>
        </div>
        <span class="search-result-badge">${item.badge}</span>
      </a>
    `).join('');

    if (window.lucide) lucide.createIcons();

    // Add click listeners to close modal upon selecting a link
    searchResults.querySelectorAll('.search-result').forEach(link => {
      link.addEventListener('click', () => {
        closeSearch();
      });
    });
  }

  // Global Trigger Listeners
  document.addEventListener('click', (e) => {
    if (e.target.closest('#search-toggle')) {
      openSearch();
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchModal && searchModal.classList.contains('open')) {
        closeSearch();
      } else {
        openSearch();
      }
    } else if (e.key === 'Escape' && searchModal && searchModal.classList.contains('open')) {
      closeSearch();
    }
  });
});
