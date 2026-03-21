/* ========================================
   MF-Studio — Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ── Navbar scroll effect ──
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile menu toggle ──
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('menu-open', isOpen);
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });

  // ── Reveal on scroll (Intersection Observer) ──
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // ── Stagger siblings (cards, tech items) ──
  document.querySelectorAll('.sol-grid, .tech-grid, .cases-grid').forEach(grid => {
    const children = grid.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.12}s`;
    });
  });

  // ── Active nav link highlight ──
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const highlightNav = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navAnchors.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) {
        a.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
});

// ── Contact form handler ──
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');
  const origText = btn.textContent;
  const formData = new FormData(form);

  // Set loading state
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  try {
    const response = await fetch(form.action || 'https://formspree.io/f/xbdzyqzj', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      // Success state
      btn.textContent = '✓ Enviado';
      btn.style.background = 'var(--accent-green)';
      btn.style.boxShadow = '0 4px 24px rgba(16,185,129,.35)';
      form.reset();
    } else {
      // Error from server
      const data = await response.json();
      throw new Error(data.error || 'Error al enviar');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    btn.textContent = '✕ Error';
    btn.style.background = 'var(--accent-red, #ff4d4d)';
  } finally {
    // Reset button after delay
    setTimeout(() => {
      btn.textContent = origText;
      btn.style.background = '';
      btn.style.boxShadow = '';
      btn.disabled = false;
    }, 4000);
  }

  return false;
}
