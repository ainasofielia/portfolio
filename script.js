'use strict';

// ============================================================
// THEME TOGGLE (Light / Dark)
// ============================================================
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const iconSun = document.getElementById('iconSun');
const iconMoon = document.getElementById('iconMoon');

// Load saved preference or default to dark
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
applyTheme(savedTheme);

function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    if (theme === 'dark') {
        iconMoon.style.display = 'block';
        iconSun.style.display = 'none';
        themeToggle.title = 'Switch to Light Mode';
    } else {
        iconMoon.style.display = 'none';
        iconSun.style.display = 'block';
        themeToggle.title = 'Switch to Dark Mode';
    }
}

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ============================================================
// NAVBAR SCROLL + ACTIVE LINK
// ============================================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveNavLink();
});

const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
function updateActiveNavLink() {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

// ============================================================
// HAMBURGER MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

// ============================================================
// AOS – INTERSECTION OBSERVER
// ============================================================
const aosEls = document.querySelectorAll('[data-aos]');
const aosObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute('data-aos-delay') || 0);
            setTimeout(() => entry.target.classList.add('aos-animate'), delay);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
aosEls.forEach(el => aosObs.observe(el));

// ============================================================
// PROJECT SLIDESHOW
// ============================================================
(function () {
    const slides = document.getElementById('projSlides');
    const dotsContainer = document.getElementById('projDots');
    const prevBtn = document.getElementById('projPrev');
    const nextBtn = document.getElementById('projNext');
    const currentEl = document.getElementById('projCurrent');
    const totalEl = document.getElementById('projTotal');

    if (!slides) return;

    const slideEls = slides.querySelectorAll('.proj-slide');
    const total = slideEls.length;
    let current = 0;

    if (totalEl) totalEl.textContent = total;

    // Build dots
    slideEls.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'proj-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to project ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function goTo(index) {
        current = (index + total) % total;
        slides.style.transform = `translateX(-${current * 100}%)`;
        document.querySelectorAll('.proj-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
        if (currentEl) currentEl.textContent = current + 1;
    }

    prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

    // Auto-advance every 5 seconds
    let autoTimer = setInterval(() => goTo(current + 1), 5000);
    const slideshow = slides.closest('.proj-slideshow');
    if (slideshow) {
        slideshow.addEventListener('mouseenter', () => clearInterval(autoTimer));
        slideshow.addEventListener('mouseleave', () => {
            autoTimer = setInterval(() => goTo(current + 1), 5000);
        });
    }

    // Touch/swipe support
    let startX = 0;
    slides.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    slides.addEventListener('touchend', (e) => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });
})();

// ============================================================
// CONTACT FORM (mailto fallback)
// ============================================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value.trim() || 'Portfolio Contact';
        const message = document.getElementById('contactMessage').value.trim();
        if (!name || !email || !message) {
            formStatus.textContent = 'Please fill in all required fields.';
            formStatus.style.color = '#f59e0b';
            return;
        }
        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        window.location.href = `mailto:ainasofielia3@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        formStatus.textContent = 'Message sent! I will get back to you soon.';
        formStatus.style.color = '#22c55e';
        contactForm.reset();
        setTimeout(() => { formStatus.textContent = ''; }, 5000);
    });
}

// ============================================================
// RESUME BUTTON
// ============================================================
// Note: Handled directly via HTML href and download attributes.

// ============================================================
// TYPEWRITER SUBTITLE
// ============================================================
const subtitleEl = document.getElementById('heroSubtitle');
if (subtitleEl) {
    const phrases = [
        'Mobile App Developer · Flutter Specialist · AI Solutions',
        'Building Enterprise Apps · Healthcare Platforms · AI Tools',
        'Flutter  ·  Firebase  ·  REST APIs  ·  UI/UX Design',
    ];
    let pi = 0, ci = 0, del = false;
    function type() {
        const cur = phrases[pi];
        subtitleEl.textContent = del ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
        del ? ci-- : ci++;
        if (!del && ci === cur.length) { del = true; setTimeout(type, 2400); return; }
        if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
        setTimeout(type, del ? 35 : 55);
    }
    setTimeout(type, 2000);
}

// ============================================================
// MOUSE PARALLAX – floating chips
// ============================================================
const floatChips = document.querySelectorAll('.float-chip');
document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
    floatChips.forEach((chip, i) => {
        const d = (i + 1) * 5;
        chip.style.transform = `translate(${dx * d}px, ${dy * d}px)`;
    });
});
