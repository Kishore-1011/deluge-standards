/**
 * Zoho Deluge Documentation - Core App Orchestrator (v2.0)
 * Manages reading progress, interactive PR audit checklist tool, live code compliance inspector,
 * toast notifications, smooth scrolling, scrollspy, copy buttons, and back-to-top handlers.
 */
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initial component render
  await DocSite.render();

  // 2. Toast Notification Helper
  function showToast(message, iconName = 'check-circle-2') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => toast.classList.add('show'), 20);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2400);
  }

  // 3. Reading Progress Bar & Scroll Tracking
  const progressEl = document.getElementById('reading-progress');
  const topBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressEl) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressEl.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    if (topBtn) {
      topBtn.classList.toggle('visible', window.scrollY > 300);
    }
  }, { passive: true });

  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Mobile Drawer Controls
  const sidebar = document.getElementById('site-sidebar');
  const scrim = document.getElementById('mobile-scrim');

  function openMobileMenu() {
    if (!sidebar) return;
    sidebar.classList.add('open');
    if (scrim) scrim.classList.add('visible');
    const toggle = document.getElementById('menu-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    if (scrim) scrim.classList.remove('visible');
    const toggle = document.getElementById('menu-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('#menu-toggle')) {
      if (sidebar && sidebar.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }
  });

  if (scrim) scrim.addEventListener('click', closeMobileMenu);
  if (sidebar) {
    sidebar.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        closeMobileMenu();
      }
    });
  }

  // 5. Syntax Highlighted Code Block Copy Buttons
  document.querySelectorAll('.code-block').forEach((block) => {
    const copyBtn = block.querySelector('.copy-btn');
    const codeEl = block.querySelector('code');

    if (copyBtn && codeEl) {
      copyBtn.addEventListener('click', async () => {
        try {
          const textToCopy = codeEl.innerText;
          await navigator.clipboard.writeText(textToCopy);
          
          const originalText = copyBtn.innerHTML;
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = `<i data-lucide="check" style="width:14px; height:14px;"></i> Copied!`;
          if (window.lucide) lucide.createIcons();

          showToast('Code snippet copied to clipboard!');

          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = originalText;
            if (window.lucide) lucide.createIcons();
          }, 1800);
        } catch (err) {
          console.error('Failed to copy code text', err);
        }
      });
    }
  });

  // 6. ScrollSpy for Left Subnav & Right TOC Sidebar Highlight
  const sections = [...document.querySelectorAll('article.doc-article section[id]')];
  if (sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          
          // Highlight Left Subnav Links
          document.querySelectorAll('.nav-link.sub').forEach((a) => {
            const isMatch = a.hash === '#' + id;
            a.classList.toggle('active', isMatch);
          });

          // Highlight Right TOC Sidebar Links
          document.querySelectorAll('.toc-item a').forEach((a) => {
            const isMatch = a.hash === '#' + id;
            a.classList.toggle('active', isMatch);
          });
        }
      });
    }, observerOptions);

    sections.forEach((sec) => observer.observe(sec));
  }

  // 7. Smooth scroll for internal links & same-page hash navigation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    const targetPath = href.substring(0, hashIndex);
    const targetId = href.substring(hashIndex + 1);

    const currentFileName = window.location.pathname.split('/').pop() || 'index.html';
    const targetFileName = targetPath.split('/').pop();

    const isCurrentPage = !targetPath || 
      targetFileName === currentFileName ||
      window.location.pathname.endsWith(targetPath.replace(/^(\.\.\/|\.\/)/, ''));

    if (isCurrentPage && targetId) {
      const targetSec = document.getElementById(targetId);
      if (targetSec) {
        e.preventDefault();
        targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, null, '#' + targetId);
      }
    }
  });

  // 8. Handle initial URL hash scrolling on page load
  if (window.location.hash) {
    const initialTargetId = window.location.hash.substring(1);
    const initialTargetEl = document.getElementById(initialTargetId);
    if (initialTargetEl) {
      setTimeout(() => {
        initialTargetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }
});
