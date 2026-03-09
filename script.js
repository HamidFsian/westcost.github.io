/* =============================================
   ORAN MOTOR FESTIVAL — SCRIPTS
   ============================================= */

'use strict';

// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    // Trigger hero animations after loader
    triggerHeroAnimations();
  }, 2000);
});

function triggerHeroAnimations() {
  const heroEls = document.querySelectorAll('.hero .reveal-up, .hero .reveal-fade');
  heroEls.forEach(el => {
    el.classList.add('visible');
  });
  // Start counter
  setTimeout(startCounters, 600);
}

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== MOBILE MENU =====
const burger = document.getElementById('nav-burger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ===== PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const isGold = Math.random() > 0.7;
    p.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${isGold ? '#ffd700' : '#00d4ff'};
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.5 + 0.1};
      animation: particleFloat ${Math.random() * 10 + 8}s ease-in-out ${Math.random() * 5}s infinite alternate;
    `;
    container.appendChild(p);
  }
  if (!document.getElementById('particle-style')) {
    const style = document.createElement('style');
    style.id = 'particle-style';
    style.textContent = `
      @keyframes particleFloat {
        0% { transform: translate(0, 0) scale(1); opacity: 0.1; }
        50% { opacity: 0.5; }
        100% { transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 60 + 20}px, ${Math.random() > 0.5 ? '-' : ''}${Math.random() * 80 + 30}px) scale(1.5); opacity: 0.1; }
      }
    `;
    document.head.appendChild(style);
  }
}
createParticles();

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Don't unobserve — keep animation state
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => {
  // Skip hero elements — those are triggered manually
  if (!el.closest('.hero')) {
    revealObserver.observe(el);
  }
});

// ===== STAT COUNTERS =====
function animateCount(el, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

function startCounters() {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    animateCount(el, parseInt(el.dataset.count));
  });
}

// ===== COUNTDOWN TIMER =====
const eventDate = new Date('2026-06-12T09:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = eventDate - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent = '00';
    document.getElementById('cd-secs').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = n => String(n).padStart(2, '0');
  document.getElementById('cd-days').textContent = pad(days);
  document.getElementById('cd-hours').textContent = pad(hours);
  document.getElementById('cd-mins').textContent = pad(mins);
  document.getElementById('cd-secs').textContent = pad(secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ===== PROGRAM TABS =====
const tabBtns = document.querySelectorAll('.tab-btn');
const programDays = document.querySelectorAll('.program-day');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const day = btn.dataset.day;
    tabBtns.forEach(b => b.classList.remove('active'));
    programDays.forEach(d => d.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`day-${day}`).classList.add('active');

    // Re-trigger reveal for newly visible items
    document.querySelectorAll(`#day-${day} .reveal-fade`).forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => el.classList.add('visible'), 50);
    });
  });
});

// Trigger reveals for the default active day
setTimeout(() => {
  document.querySelectorAll('#day-1 .reveal-fade').forEach(el => {
    if (document.getElementById('day-1').classList.contains('active')) {
      el.classList.add('visible');
    }
  });
}, 500);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || 80);
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== PARALLAX HERO GLOW =====
document.addEventListener('mousemove', e => {
  const { innerWidth: w, innerHeight: h } = window;
  const x = (e.clientX / w - 0.5) * 30;
  const y = (e.clientY / h - 0.5) * 20;
  const glueBlue = document.querySelector('.hero-glow--blue');
  const glueGold = document.querySelector('.hero-glow--gold');
  if (glueBlue) glueBlue.style.transform = `translate(${x}px, ${y}px)`;
  if (glueGold) glueGold.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
});

// ===== HERO CAR SILHOUETTE PARALLAX =====
const heroCar = document.querySelector('.hero-car-silhouette');
window.addEventListener('scroll', () => {
  if (!heroCar) return;
  const scrollY = window.scrollY;
  heroCar.style.transform = `translateY(${scrollY * 0.3}px)`;
}, { passive: true });

// ===== FORM SUBMISSIONS =====
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    const btn = newsletterForm.querySelector('button');
    btn.textContent = 'Subscribed!';
    btn.style.background = 'linear-gradient(135deg, #00cc66, #009944)';
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
    }, 3000);
  });
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.querySelector('span') ? btn.querySelector('span').textContent : btn.textContent;
    btn.textContent = 'Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #00cc66, #009944)';
    setTimeout(() => {
      btn.textContent = originalText || 'Send Message';
      btn.style.background = '';
    }, 3000);
  });
}

// ===== GALLERY HOVER TILT =====
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mousemove', e => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    item.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(l => {
        l.style.color = l.getAttribute('href') === `#${id}` ? 'var(--white)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ===== CAR CARD MAGNETIC EFFECT =====
document.querySelectorAll('.car-card, .ticket-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    card.style.transform = `translateY(-6px) perspective(800px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
